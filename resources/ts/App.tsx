import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
    return (
    <Router>
            <div className="flex h-screen bg-gray-900">
                <p>testtest</p>
            {/* <Sidebar /> */}
            <div className="flex-1 flex flex-col overflow-hidden">
            {/* <Navbar /> */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800">
                <Routes>
                {/* <Route path="/" element={<Dashboard />} /> */}
                {/* <Route path="/settings" element={<Settings />} /> */}
                </Routes>
            </main>
            </div>
        </div>
    </Router>
    )
}

export default App;
