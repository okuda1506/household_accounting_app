<!DOCTYPE html>
<html lang="{{ str_replace('_','-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>開発環境</title>
    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml" sizes="any">
    <script>
        try {
            const savedTheme = window.localStorage.getItem("household-accounting-theme");
            const isDarkMode = savedTheme ? savedTheme === "dark" : true;
            document.documentElement.classList.toggle("dark", isDarkMode);
        } catch (error) {
            document.documentElement.classList.add("dark");
        }
    </script>
    @viteReactRefresh
    @vite([
        'resources/css/app.css',
        'resources/js/app.js',
    ])
</head>
<body>
    <div id="app">
    </div>
</body>
</html>
