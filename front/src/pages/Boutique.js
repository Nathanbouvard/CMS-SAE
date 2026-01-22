import React from "react";
import { Link } from "react-router-dom";
import "./Boutique.css";

function Boutique() {
  return (
    <div className="page-container boutique-container">
      <h1>Boutique</h1>
      <p>La boutique sera bientôt disponible.</p>
      <p>En attendant, vous pouvez regarder nos actualités.</p>
      <Link to="/blog" className="btn-blog">Actualités</Link>
    </div>
  );
}

export default Boutique;