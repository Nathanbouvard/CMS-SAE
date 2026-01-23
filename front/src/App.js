import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import ArticleDetail from "./pages/ArticleDetail";
import Login from "./pages/Login";
import Boutique from "./pages/Boutique";
import "./App.css";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      
      // Clean URL
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({path: newUrl}, '', newUrl);
      
      // Force reload to update auth state across app
      window.location.reload();
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/boutique" element={<Boutique />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
