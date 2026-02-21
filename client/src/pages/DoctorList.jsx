import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ⚠️ AJOUT IMPORTANT
import './DoctorList.css'; 

export default function DoctorList() {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    axios.get('http://localhost:5000/api/medecins')
      .then(res => {
        setMedecins(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur API:", err);
        setError("Impossible de charger la liste des médecins. Le serveur est-il allumé ?");
        setLoading(false);
      });
  }, []);

  const filteredMedecins = medecins.filter((medecin) => {
    const searchLower = searchTerm.toLowerCase();
    const nom = medecin.User?.nom?.toLowerCase() || "";
    const specialite = medecin.Specialite?.nom?.toLowerCase() || "";
    return nom.includes(searchLower) || specialite.includes(searchLower);
  });

  return (
    <div className="doctor-page-container">
      <div className="doctor-page-content">
        
        <header className="doctor-header">
          <h1>Prenez rendez-vous en ligne</h1>
          <p>Trouvez le spécialiste qui vous convient parmi nos professionnels de santé</p>
        </header>

        <div className="search-bar-container">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input"
            placeholder="Rechercher un médecin, une spécialité (ex: Cardiologue)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <div className="state-message loading">Chargement des spécialistes en cours...</div>}
        {error && <div className="state-message error">⚠️ {error}</div>}

        {!loading && !error && (
          <div className="doctor-grid">
            {filteredMedecins.length === 0 ? (
              <div className="state-message empty">
                Aucun médecin ne correspond à votre recherche "{searchTerm}".
              </div>
            ) : (
              filteredMedecins.map((medecin) => (
                <div key={medecin.id} className="doctor-card">
                  
                  <div className="doctor-profile-header">
                    <div className="doctor-avatar">👨‍⚕️</div>
                    <div>
                      <h3 className="doctor-name">{medecin.User?.nom}</h3>
                      <span className="doctor-specialty">
                        {medecin.Specialite?.nom || "Médecin Généraliste"}
                      </span>
                    </div>
                  </div>
                  
                  <ul className="doctor-info-list">
                    <li><span className="info-icon">📍</span> <strong>Cabinet :</strong> {medecin.adresse || "Adresse non communiquée"}</li>
                    <li><span className="info-icon">📞</span> <strong>Téléphone :</strong> {medecin.telephone || "Non communiqué"}</li>
                    <li><span className="info-icon">✉️</span> <strong>Email :</strong> {medecin.User?.email}</li>
                  </ul>

                  {/* ⚠️ LE BOUTON TRANSFORMÉ EN LIEN DYNAMIQUE */}
                  <Link 
                    to={`/book/${medecin.id}`} 
                    className="btn-appointment" 
                    style={{ display: 'block', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}
                  >
                    Prendre Rendez-vous
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}