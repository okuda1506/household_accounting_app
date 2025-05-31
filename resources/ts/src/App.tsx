import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";

function App() {
    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black">
                    <Routes>
                        {/* 動作確認後こっちに戻す */}
                        {/* <Route path="/login" element={<Login />} /> */}
                        {/* <Route path="/" element={<Dashboard />} /> */}

                        {/* 動作確認用 */}
                        <Route path="/" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />

                        <Route path="/categories" element={<Categories />} />
                        <Route path="/transactions" element={<Transactions />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
