import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Importation de l'image selon les standards React
import heroImg from '../assets/home-hero.jpg';

export default function Home() {
  return (
    <div className="home-wrapper">
      

      {/* Section Héro (Le contenu principal) */}
      <main className="hero-container">
        
        {/* Colonne Gauche : Texte */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-line"></span> PLATEFORME E-SANTÉ MAROC
          </div>
          <h1 className="hero-title">
            Votre Santé, <br />
            <span className="text-blue">Plus Proche</span> De Vous
          </h1>
          <p className="hero-desc">
            Une plateforme solidaire et innovante pour faciliter l'accès aux soins, la prise de rendez-vous et le suivi médical de tous les citoyens.
          </p>
          
          <ul className="hero-list">
            <li><span className="check-icon">✔</span> Médecins certifiés</li>
            <li><span className="check-icon">✔</span> Prise de RDV rapide</li>
            <li><span className="check-icon">✔</span> Dossier médical sécurisé</li>
          </ul>

          <div className="hero-buttons">
            <Link to="/register" className="btn-primary large">Commencer ➔</Link>
            <Link to="/doctors" className="btn-dark large">Nos Médecins ➔</Link>
          </div>
        </div>

        {/* Colonne Droite : Image avec décorations */}
        <div className="hero-visuals">
          <div className="image-circle-bg"></div>
          
          <div className="image-wrapper">
            <img src={heroImg} alt="Sa Majesté le Roi Mohammed VI au chevet des victimes" className="main-image" />
          </div>

          {/* Badges flottants style "Template Edura" */}
          <div className="floating-badge badge-top-right">
            <div className="badge-icon red">🏥</div>
            <div>
              <strong>Solidarité</strong>
              <span>Nationale</span>
            </div>
          </div>

          <div className="floating-badge badge-bottom-left">
            <div className="badge-icon blue">👨‍⚕️</div>
            <div>
              <strong>+500</strong>
              <span>Médecins actifs</span>
            </div>
          </div>
        </div>

      </main>

      {/* Barre de statistiques en bas */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-icon">🩺</span> +20k Consultations
        </div>
        <div className="stat-item">
          <span className="stat-icon">⏱️</span> Accès 24/7
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔒</span> Données Sécurisées
        </div>
        <div className="stat-item">
          <span className="stat-icon">🤝</span> Support Communautaire
        </div>
      </section>
    </div>
  );
}