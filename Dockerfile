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
# Sailの設定に合わせてPHP8.4系（または安定版の8.3）を使用
FROM php:8.3-apache

# 必要なパッケージとPHP拡張モジュールをインストール
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

# mod_rewriteを有効化（ルーティングに必須）
RUN a2enmod rewrite

WORKDIR /var/www/html

# Laravelのソースコードをコピー
COPY . .

# Stage 1でビルドしたReactの成果物（public/build）をコピー
COPY --from=frontend /app/public/build ./public/build

# Laravelのパッケージをインストール（本番用）
RUN composer install --no-dev --optimize-autoloader

# Renderのデプロイでエラーにならないよう、ディレクトリの権限を設定
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# ポート開放
EXPOSE 80
