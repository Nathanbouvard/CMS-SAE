import React from 'react';
import Scene from '../components/3d/Scene';

function Home() {
  return (
    <div className="page-container">
      <h1>Bienvenue chez Soul N leaf</h1>
      <p style={{fontSize: '2rem'}}>
        <strong className="home-strong" style={{color: '#185720', fontSize: '3.5rem'}}>Créez</strong>{" "}
        <strong className="home-strong" style={{color: '#58429b', fontSize: '3.5rem'}}>Personnalisez</strong>{" "}
        <strong className="home-strong" style={{color: '#fc9245', fontSize: '3.5rem'}}>Portez</strong>
        <br/>Bienvenue dans l'atelier digital Soul N Leaf.
      </p>
        <Scene />
    </div>
  );
}

export default Home;
