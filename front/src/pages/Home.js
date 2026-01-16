import React from 'react';
import Scene from '../components/3d/Scene';

function Home() {
  return (
    <div className="page-container">
      <h1>Bienvenue</h1>
      <p>Ceci est la page d'accueil de votre application React.</p>
        <Scene />
    </div>
  );
}

export default Home;
