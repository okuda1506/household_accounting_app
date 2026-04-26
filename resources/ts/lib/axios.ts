import axios from "axios";

const api = axios.create({
    // 環境変数があればそれを使い、なければ localhost を使う
    baseURL: import.meta.env.VITE_API_URL || "http://localhost/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// 毎リクエスト前に最新トークンをセットする
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url;

        // login へのリクエストの場合は呼び出し元で扱わせるので処理しない
        if (status === 401 && url !== "/login") {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
