import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import UpdateUserName from "./pages/UpdateUserName";
import RequestEmailChange from "./pages/RequestEmailChange";
import VerifyEmailChange from "./pages/VerifyEmailChange";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import UpdateBudget from "./pages/UpdateBudget";
import ReactivateAccount from "./pages/ReactivateAccount";
import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./contexts/ThemeContext";
import { NavigationModal } from "./components/NavigationModal";

function App() {
    const { isDarkMode } = useTheme();
    const [isMobileViewport, setIsMobileViewport] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
            setIsMobileViewport(event.matches);
        };

        handleChange(mediaQuery);

        const listener = (event: MediaQueryListEvent) => handleChange(event);
        mediaQuery.addEventListener("change", listener);

        return () => {
            mediaQuery.removeEventListener("change", listener);
        };
    }, []);

    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background text-foreground">
                    <ToastContainer
                        position={
                            isMobileViewport ? "bottom-center" : "top-center"
                        }
                        theme={isDarkMode ? "dark" : "light"}
                        autoClose={3000}
                        hideProgressBar={true}
                        transition={Slide}
                        closeButton={false}
                        className={
                            isMobileViewport ? "mb-16 sm:mb-0" : undefined
                        }
                    />
                    <NavigationModal />
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="/reset-password/:token"
                            element={<ResetPassword />}
                        />
                        <Route
                            path="/reactivate-account/:token"
                            element={<ReactivateAccount />}
                        />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/categories"
                            element={
                                <PrivateRoute>
                                    <Categories />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/transactions"
                            element={
                                <PrivateRoute>
                                    <Transactions />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <PrivateRoute>
                                    <Settings />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/settings/name"
                            element={
                                <PrivateRoute>
                                    <UpdateUserName />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/settings/email/request"
                            element={
                                <PrivateRoute>
                                    <RequestEmailChange />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/settings/email/verify"
                            element={
                                <PrivateRoute>
                                    <VerifyEmailChange />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/settings/password"
                            element={
                                <PrivateRoute>
                                    <UpdatePassword />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/settings/budget"
                            element={
                                <PrivateRoute>
                                    <UpdateBudget />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
