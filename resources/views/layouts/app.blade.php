<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KakeiFlow</title>
    <!-- OGP -->
    <meta property="og:title" content="KakeiFlow">
    <meta property="og:description" content="家計の流れをシンプルに整える">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:image" content="{{ asset('favicon.svg') }}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="KakeiFlow">
    <meta name="twitter:description" content="家計の流れをシンプルに整える">
    <meta name="twitter:image" content="{{ asset('favicon.svg') }}">
    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml" sizes="any">
    @vite('resources/js/app.jsx') {{-- Vite エントリーポイント --}}
</head>
<body>
    <div id="root"></div>
</body>
</html>
