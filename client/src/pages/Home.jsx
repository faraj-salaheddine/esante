import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-wrapper">
      <header className="home-hero">
        <div className="hero-text">
          <h1>Votre santé, <br /><span>Notre priorité.</span></h1>
          <p>Prenez rendez-vous avec les meilleurs spécialistes au Maroc en quelques clics.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn-main">Commencer</Link>
            <Link to="/doctors" className="btn-alt">Voir les médecins</Link>
          </div>
        </div>
      </header>
      
      <section className="home-stats">
        <div className="stat-item"><h3>+500</h3><p>Médecins</p></div>
        <div className="stat-item"><h3>24/7</h3><p>Disponibilité</p></div>
        <div className="stat-item"><h3>100%</h3><p>Sécurisé</p></div>
      </section>
    </div>
  );
}