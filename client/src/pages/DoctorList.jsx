import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoctorList.css'; // Connexion au nouveau design !

export default function DoctorList() {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // État pour la barre de recherche

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

  // Fonction magique pour filtrer les médecins selon la recherche (par nom ou spécialité)
  const filteredMedecins = medecins.filter((medecin) => {
    const searchLower = searchTerm.toLowerCase();
    const nom = medecin.User?.nom?.toLowerCase() || "";
    const specialite = medecin.Specialite?.nom?.toLowerCase() || "";
    return nom.includes(searchLower) || specialite.includes(searchLower);
  });

  return (
    <div className="doctor-page-container">
      <div className="doctor-page-content">
        
        {/* En-tête de la page */}
        <header className="doctor-header">
          <h1>Prenez rendez-vous en ligne</h1>
          <p>Trouvez le spécialiste qui vous convient parmi nos professionnels de santé</p>
        </header>

        {/* Barre de recherche (L'effet pro pour le PFE) */}
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

        {/* Gestion des messages de chargement et d'erreur */}
        {loading && <div className="state-message loading">Chargement des spécialistes en cours...</div>}
        {error && <div className="state-message error">⚠️ {error}</div>}

        {/* Affichage de la grille des médecins */}
        {!loading && !error && (
          <div className="doctor-grid">
            
            {filteredMedecins.length === 0 ? (
              <div className="state-message empty">
                Aucun médecin ne correspond à votre recherche "{searchTerm}".
              </div>
            ) : (
              filteredMedecins.map((medecin) => (
                <div key={medecin.id} className="doctor-card">
                  
                  {/* Haut de la carte : Photo, Nom, Spécialité */}
                  <div className="doctor-profile-header">
                    <div className="doctor-avatar">👨‍⚕️</div>
                    <div>
                      <h3 className="doctor-name">{medecin.User?.nom}</h3>
                      <span className="doctor-specialty">
                        {medecin.Specialite?.nom || "Médecin Généraliste"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Milieu : Coordonnées */}
                  <ul className="doctor-info-list">
                    <li>
                      <span className="info-icon">📍</span> 
                      <strong>Cabinet :</strong> {medecin.adresse || "Adresse non communiquée"}
                    </li>
                    <li>
                      <span className="info-icon">📞</span> 
                      <strong>Téléphone :</strong> {medecin.telephone || "Non communiqué"}
                    </li>
                    <li>
                      <span className="info-icon">✉️</span> 
                      <strong>Email :</strong> {medecin.User?.email}
                    </li>
                  </ul>

                  {/* Bas : Bouton d'action */}
                  <button className="btn-appointment">
                    Prendre Rendez-vous
                  </button>
                </div>
              ))
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}