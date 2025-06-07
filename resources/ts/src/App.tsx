import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import { ToastContainer } from "react-toastify";
import { Slide } from 'react-toastify';
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
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route
                            path="/transactions"
                            element={<Transactions />}
                        />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
