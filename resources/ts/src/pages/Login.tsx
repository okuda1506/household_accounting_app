import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        try {
            const response = await api.post("/login", {
                email,
                password,
                remember, // todo: 多分ここ機能してない
            });

            const accessToken = response.data.access_token;
            localStorage.setItem("access_token", accessToken);

            navigate("/", {
                state: { message: "ログインしました" },
            });
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const allErrors = Object.values(
                    error.response.data.errors
                ).flat();
                setErrors(allErrors as string[]);
            } else {
                setErrors(["ログインに失敗しました"]);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4">
            {status && <p className="mb-4 text-green-600">{status}</p>}
            {errors.length > 0 && (
                <ul className="mb-4 text-red-600 list-disc list-inside">
                    {errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="username"
                        required
                        className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Remember Me */}
                <div className="flex items-center mb-4">
                    <input
                        id="remember_me"
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                    />
                    <label
                        htmlFor="remember_me"
                        className="ml-2 block text-sm text-gray-900"
                    >
                        Remember me
                    </label>
                </div>

                {/* Submit and Forgot Password */}
                <div className="flex items-center justify-between">
                    <a
                        href="/forgot-password"
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                        Forgot your password?
                    </a>
                    <button
                        type="submit"
                        className="ml-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Log in
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
