import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setAuthChecked(true);
            setIsAuthenticated(false);
            return;
        }

        api.get("/me")
            .then(() => {
                setIsAuthenticated(true);
            })
            .catch(() => {
                localStorage.removeItem("access_token");
                setIsAuthenticated(false);
                navigate("/login", { replace: true });
            })
            .finally(() => {
                setAuthChecked(true);
            });
    }, []);

    if (!authChecked) {
        return null;
    }

    if (!isAuthenticated) {
        return null;
    }

    return children;
};
