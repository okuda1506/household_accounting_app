# ==========================================
# Stage 1: フロントエンド (React/Vite) のビルド
# ==========================================
FROM node:20 AS frontend
WORKDIR /app

# パッケージをインストールしてビルド
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ==========================================
# Stage 2: バックエンド (Laravel/Apache) の構築
# ==========================================
FROM php:8.4-apache

# 必要なパッケージとPHP拡張モジュールをインストール
# 本番環境で必要な libpq-dev (PostgreSQL用) などを含めています
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ApacheのドキュメントルートをLaravelの /public に変更
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# mod_rewriteを有効化
RUN a2enmod rewrite

WORKDIR /var/www/html

# Laravelのソースコードをコピー
COPY . .

# Stage 1でビルドした成果物をコピー
COPY --from=frontend /app/public/build ./public/build

# Laravelのパッケージをインストール（本番用最適化）
RUN composer install --no-dev --optimize-autoloader

# ディレクトリ権限の設定
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# --- [ここから追加：無料プラン用自動設定] ---

# 起動時にマイグレーションを実行するスクリプトを作成
RUN echo '#!/bin/sh\n\
php artisan migrate --force\n\
exec apache2-foreground' > /usr/local/bin/docker-entrypoint.sh

# スクリプトに実行権限を付与
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# コンテナ起動時にこのスクリプトを通るように設定
ENTRYPOINT ["docker-entrypoint.sh"]

# --- [ここまで] ---

EXPOSE 80
