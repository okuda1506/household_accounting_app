import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: [
                "resources/css/app.css",
                "resources/scss/app.scss",
                "resources/ts/index.tsx",
            ],
            refresh: true,
        }),
    ],
    resolve: {
        // alias: {
        //   "@": path.resolve(__dirname, "resources/ts"),
        // },
        alias: [{ find: "@/", replacement: `${__dirname}/resources/ts/` }],
    },
});
