import axios from "axios";

const token = localStorage.getItem("access_token");

const api = axios.create({
    baseURL: "http://localhost/api",
    headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    },
});

export default api;
