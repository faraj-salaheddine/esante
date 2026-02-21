import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUserMd, FaMapMarkerAlt, FaPhone, FaEnvelope, FaRegHeart, FaHeart, FaSearch } from 'react-icons/fa';
import './DoctorList.css'; 

export default function DoctorList() {
  const [medecins, setMedecins] = useState([]);
  const [favorisIds, setFavorisIds] = useState([]); // Tableau des IDs favoris
  const [showFavorisOnly, setShowFavorisOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); 

  const patientId = localStorage.getItem('userId');

  useEffect(() => {
    // 1. Charger tous les médecins
    axios.get('http://localhost:5000/api/medecins')
      .then(res => setMedecins(res.data))
      .catch(err => setError("Impossible de charger la liste des médecins."))
      .finally(() => setLoading(false));

    // 2. Charger les favoris si l'utilisateur est connecté
    if (patientId) {
      axios.get(`http://localhost:5000/api/favoris/${patientId}`)
        .then(res => {
          // ⚠️ CORRECTION : On s'assure que la base de données renvoie bien des Nombres
          const idsEnNombres = res.data.map(id => Number(id));
          setFavorisIds(idsEnNombres);
        })
        .catch(err => console.log("Erreur chargement favoris", err));
    }
  }, [patientId]);

  // Fonction pour gérer le clic sur le coeur
  const handleToggleFavori = async (medecinId) => {
    if (!patientId) {
      alert("Veuillez vous connecter en tant que patient pour ajouter aux favoris.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/favoris/toggle', {
        patient_id: patientId,
        medecin_id: medecinId
      });

      // ⚠️ CORRECTION : Mise à jour en forçant le format Nombre
      if (res.data.isFavori) {
        setFavorisIds([...favorisIds, Number(medecinId)]);
      } else {
        setFavorisIds(favorisIds.filter(id => Number(id) !== Number(medecinId)));
      }
    } catch (err) {
      console.log(err);
      // ⚠️ CORRECTION : Alerte pour t'avertir si la route serveur est manquante
      alert("Erreur serveur : Le serveur n'a pas trouvé la route des favoris. Vérifie ton fichier server.js !");
    }
  };

  // Filtrage intelligent
  const filteredMedecins = medecins.filter((medecin) => {
    const matchesSearch = (medecin.User?.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (medecin.Specialite?.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    // ⚠️ CORRECTION : On compare de manière ultra-sécurisée avec Number()
    const matchesTab = showFavorisOnly ? favorisIds.some(id => Number(id) === Number(medecin.id)) : true;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="doctor-page-container">
      <div className="doctor-page-content">
        
        <header className="doctor-header">
          <h1>Prenez rendez-vous en ligne</h1>
          <p>Trouvez le spécialiste qui vous convient parmi nos professionnels de santé</p>
        </header>

        {patientId && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
            <button 
              onClick={() => setShowFavorisOnly(false)}
              style={{
                padding: '10px 25px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', border: 'none',
                backgroundColor: !showFavorisOnly ? '#3182ce' : '#f1f5f9',
                color: !showFavorisOnly ? 'white' : '#475569',
                transition: 'all 0.3s'
              }}
            >
              Tous les médecins
            </button>
            <button 
              onClick={() => setShowFavorisOnly(true)}
              style={{
                padding: '10px 25px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', border: 'none',
                backgroundColor: showFavorisOnly ? '#e11d48' : '#f1f5f9',
                color: showFavorisOnly ? 'white' : '#475569',
                transition: 'all 0.3s'
              }}
            >
              ❤️ Mes Favoris
            </button>
          </div>
        )}

        <div className="search-bar-container">
          <span className="search-icon"><FaSearch color="#94a3b8" /></span>
          <input 
            type="text" 
            className="search-input"
            placeholder={showFavorisOnly ? "Rechercher dans mes favoris..." : "Rechercher un médecin, une spécialité..."} 
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
                {showFavorisOnly ? "Vous n'avez pas encore de médecin favori." : "Aucun médecin trouvé."}
              </div>
            ) : (
              filteredMedecins.map((medecin) => {
                // ⚠️ CORRECTION : Vérification infaillible pour colorier le coeur
                const isFavori = favorisIds.some(id => Number(id) === Number(medecin.id));

                return (
                  <div key={medecin.id} className="doctor-card" style={{ position: 'relative' }}>
                    
                    <button 
                      onClick={() => handleToggleFavori(medecin.id)}
                      style={{
                        position: 'absolute', top: '20px', right: '20px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: isFavori ? '#e11d48' : '#94a3b8', 
                        transition: 'transform 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      title={isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      {isFavori ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                    </button>

                    <div className="doctor-profile-header">
                      <div className="doctor-avatar" style={{ backgroundColor: '#eff6ff', color: '#3182ce' }}>
                        <FaUserMd size={26} />
                      </div>
                      <div>
                        <h3 className="doctor-name">{medecin.User?.nom}</h3>
                        <span className="doctor-specialty">
                          {medecin.Specialite?.nom || "Médecin Généraliste"}
                        </span>
                      </div>
                    </div>
                    
                    <ul className="doctor-info-list">
                      <li><span className="info-icon" style={{color: '#3182ce'}}><FaMapMarkerAlt /></span> <strong>Cabinet :</strong> {medecin.adresse || "Non communiquée"}</li>
                      <li><span className="info-icon" style={{color: '#3182ce'}}><FaPhone /></span> <strong>Téléphone :</strong> {medecin.telephone || "Non communiqué"}</li>
                      <li><span className="info-icon" style={{color: '#3182ce'}}><FaEnvelope /></span> <strong>Email :</strong> {medecin.User?.email}</li>
                    </ul>

                    <Link to={`/book/${medecin.id}`} className="btn-appointment" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>
                      Prendre Rendez-vous
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}