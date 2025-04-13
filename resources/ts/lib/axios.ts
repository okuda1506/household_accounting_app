import axios from "axios";

const token = localStorage.getItem("access_token");

const api = axios.create({
    baseURL: "http://localhost:8000/api", // Laravel の API ベースURL
    headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // トークンがある場合にだけ付ける
    },
    withCredentials: true, // 必要に応じて（Sanctum使用時など）
});

export default api;
