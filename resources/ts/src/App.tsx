import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";

function App() {
    return (
        <div className="flex h-screen bg-gray-900">
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/categories" element={<Categories />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
