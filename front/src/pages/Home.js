import React from 'react';
import Scene from '../components/3d/Scene';

function Home() {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Bienvenue chez <span className="brand-highlight">Soul N leaf</span></h1>
        
        <div className="hero-tagline">
            <div className="tagline-item">
                <span className="tagline-word create">Créez</span>
                <span className="tagline-desc">votre style unique</span>
            </div>
            
            <div className="tagline-separator">•</div>
            
            <div className="tagline-item">
                <span className="tagline-word customize">Personnalisez</span>
                <span className="tagline-desc">chaque détail</span>
            </div>
            
            <div className="tagline-separator">•</div>
            
            <div className="tagline-item">
                <span className="tagline-word wear">Portez</span>
                <span className="tagline-desc">votre création</span>
            </div>
        </div>

        <p className="hero-subtitle">
            Bienvenue dans l'atelier digital Soul N Leaf. <br/>
            L'endroit où vos idées prennent vie en 3D.
        </p>
      </div>
      
      {/* 3D Scene */}
      <Scene />

      {/* Concept Section */}
      <section className="home-section concept">
        <div className="student-badge">Par deux étudiants passionnés</div>
        <h2 className="section-title">Soul N Leaf : L'Humain et la Nature</h2>
        <p className="section-text">
          Bienvenue dans l'univers Soul N Leaf. Nous sommes une marque de vêtements streetwear née d'une conviction : 
          on ne devrait pas avoir à choisir entre le style et la planète. <br/><br/>
          Notre nom incarne notre mission : <strong>Soul</strong> pour l'humain et sa créativité, <strong>Leaf</strong> pour la nature et sa préservation.
          Nous créons des pièces unisexes conçues pour durer, destinées à une génération en quête d'authenticité.
        </p>
        <p className="section-text" style={{marginTop: '1rem', fontStyle: 'italic'}}>
          Derrière ce projet, c'est nous : deux étudiants qui ont envie de découvrir l'industrie de la mode de l'intérieur, 
          avec la volonté farouche de se démarquer en proposant une alternative concrète et 100% éco-responsable.
        </p>
      </section>

      {/* Features Section */}
      <section className="home-section features">
        <h2 className="section-title" style={{textAlign: 'center'}}>Une Mode qui a du Sens</h2>
        <div className="features-grid">
            <div className="feature-card">
                <span className="feature-icon">🌿</span>
                <h3 className="feature-title">100% Écoresponsable</h3>
                <p className="feature-desc">
                    Nous utilisons exclusivement des matières biologiques ou recyclées. 
                    Notre transparence écologique est totale, du champ à votre garde-robe.
                </p>
            </div>
            <div className="feature-card">
                <span className="feature-icon">🎨</span>
                <h3 className="feature-title">Créativité & Collabs</h3>
                <p className="feature-desc">
                    Nos designs, inspirés de la nature, sont réalisés en collaboration avec des artistes locaux 
                    pour un style unique et résolument moderne.
                </p>
            </div>
            <div className="feature-card">
                <span className="feature-icon">💎</span>
                <h3 className="feature-title">Collections Limitées</h3>
                <p className="feature-desc">
                    Pour éviter la surproduction et garantir l'exclusivité de votre look, 
                    nous fonctionnons uniquement par collections limitées.
                </p>
            </div>
        </div>
      </section>

      {/* Products Intro */}
      <section className="products-intro">
        <h2 className="section-title">La Collection Actuelle</h2>
        <p className="section-text">
            Découvrez nos dernières créations. Des coupes modernes et confortables, pensées pour tous. 
            Chaque vêtement raconte une histoire et soutient une démarche durable.
        </p>
      </section>

      {/* Community Section */}
      <section className="community-section">
        <h2 className="section-title">Rejoignez le mouvement</h2>
        <p className="section-text">
            Soul N Leaf, c'est plus qu'une marque, c'est une communauté engagée. 
            Suivez-nous pour ne rien rater de nos prochains pop-up stores et de nos futures collaborations artistiques.
        </p>
      </section>

    </div>
  );
}

export default Home;
