<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml" sizes="any">
    @vite('resources/js/app.jsx') {{-- Vite エントリーポイント --}}
</head>
<body>
    <div id="root"></div>
</body>
</html>
