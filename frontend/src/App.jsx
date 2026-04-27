import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import { useState } from "react";
import Profile from "./pages/Profile";

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const clearAuth = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } catch (err) {
      console.log("Error clearing auth:", err);
    }
    setUser(null);
    setToken(null);
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };
  return (
    <>
      <Routes>
        <Route
          element={
            <Layout onLogout={handleLogout} user={user} setUser={setUser} />
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
