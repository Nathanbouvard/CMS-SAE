import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const allowedRoles = ['ROLE_ADMIN', 'ROLE_AUTHOR', 'ROLE_EDITOR', 'ROLE_DESIGNER', 'ROLE_PROVIDER'];
        
        if (payload.roles && payload.roles.some(role => allowedRoles.includes(role))) {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">STAK</div>
      <ul className="navbar-nav">
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/custom">Customisation</Link></li>
        {isAdmin && (
            <li><a href={`http://localhost:8000/connect-admin?token=${localStorage.getItem('token')}`} className="nav-link admin-link">Administration</a></li>
        )}
        {isAuthenticated ? (
            <li><a href="/" onClick={handleLogout} className="btn-logout">Déconnexion</a></li>
        ) : (
            <li><Link to="/login" className="btn-login">Connexion</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
