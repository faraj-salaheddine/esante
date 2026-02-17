import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoctorList.css';

export default function DoctorList() {
  const [medecins, setMedecins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à l'API de ton projet pfe-esante
    axios.get('http://localhost:5000/api/medecins')
      .then(res => {
        setMedecins(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération :", err);
        setLoading(false);
      });
  }, []);

  // Filtrage par nom de médecin ou par nom de spécialité
  const filteredDoctors = medecins.filter(doc => 
    doc.User?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.Specialite?.nom_specialite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="doctor-list-page">
      <div className="search-container">
        <h1>Trouvez votre spécialiste</h1>
        <p>Plus de {medecins.length} médecins sont à votre écoute</p>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Nom du médecin ou spécialité (Ex: Cardiologue)..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="doctors-grid">
        {loading ? (
          <div className="loader">Chargement des médecins...</div>
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map(doc => (
            <div key={doc.id} className="doctor-card">
              <div className="card-header">
                <div className="doctor-avatar">👨‍⚕️</div>
                <div className="doctor-info">
                  <h3>Dr. {doc.User?.nom}</h3>
                  <span className="specialty-badge">
                    {doc.Specialite?.nom_specialite || "Généraliste"}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p>📍 {doc.adresse || "Rabat, Maroc"}</p>
                <p>📞 {doc.telephone || "Non renseigné"}</p>
              </div>
              <div className="card-footer">
                <button className="btn-book">Prendre RDV</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">Aucun médecin ne correspond à votre recherche.</div>
        )}
      </div>
    </div>
  );
}