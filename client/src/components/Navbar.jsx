import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const navigate = useNavigate();
  
  // On lit la mémoire du navigateur pour savoir si l'utilisateur est connecté
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Fonction pour se déconnecter proprement
  const handleLogout = () => {
    localStorage.clear(); // 🧹 Efface toute la mémoire (adieu Meriam !)
    navigate('/'); // Retour à l'accueil
  };

  return (
    <nav className="global-navbar">
      <div className="nav-logo">
        <Link to="/"><span>⚕️</span> E-Santé</Link>
      </div>
      
      <div className="nav-menu">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/doctors" className="nav-link">Médecins</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>

      <div className="nav-actions">
        {token ? (
          /* --- AFFICHAGE SI CONNECTÉ --- */
          <>
            <Link to={role === 'patient' ? '/dashboard' : '/doctors'} className="btn-text" style={{marginRight: '20px', color: '#0056d2'}}>
              Mon Espace
            </Link>
            <button onClick={handleLogout} className="btn-primary" style={{backgroundColor: '#e11d48', border:'none', cursor:'pointer'}}>
              Déconnexion
            </button>
          </>
        ) : (
          /* --- AFFICHAGE SI DÉCONNECTÉ --- */
          <>
            <button onClick={onOpenLogin} className="btn-text" style={{background:'none', border:'none', cursor:'pointer', fontSize:'16px'}}>
              Se connecter
            </button>
            <button onClick={onOpenRegister} className="btn-primary" style={{border:'none', cursor:'pointer', fontSize:'16px'}}>
              S'inscrire
            </button>
          </>
        )}
      </div>
    </nav>
  );
}