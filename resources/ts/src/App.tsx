import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black">
                    <ToastContainer
                        position="top-center"
                        theme="dark"
                        autoClose={3000}
                        hideProgressBar={true}
                        transition={Slide}
                        closeButton={false}
                    />
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
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
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
