import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientDashboard.css'; // ⚠️ N'oublie pas cette ligne !

export default function PatientDashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      setError("Session expirée. Veuillez vous reconnecter.");
      return;
    }

    axios.get(`http://localhost:5000/api/patients/me?userId=${userId}`)
      .then(res => setProfile(res.data))
      .catch(err => {
        console.error(err);
        setError("Erreur lors du chargement des données de santé.");
      });
  }, []);

  if (error) return <div className="error-msg">{error}</div>;
  if (!profile) return <div className="loader">Chargement de votre espace E-Santé...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        
        {/* En-tête */}
        <header className="dashboard-header">
          <h2>Bonjour, {profile.User?.nom}</h2>
          <p>Bienvenue sur votre espace patient personnel.</p>
        </header>

        {/* Cartes de statistiques */}
        <section className="info-cards">
          <div className="card">
            <h4>Email de contact</h4>
            <p>{profile.User?.email}</p>
          </div>
          <div className="card">
            <h4>Groupe Sanguin</h4>
            <p>{profile.groupe_sanguin || "Non renseigné"}</p>
          </div>
          <div className="card">
            <h4>Sexe</h4>
            <p>{profile.sexe === 'F' ? 'Femme' : profile.sexe === 'M' ? 'Homme' : 'Non renseigné'}</p>
          </div>
        </section>

        {/* Historique des rendez-vous */}
        <section className="appointments-section">
          <h3>Mes Consultations</h3>
          
          {profile.RendezVous && profile.RendezVous.length > 0 ? (
            <table className="rdv-table">
              <thead>
                <tr>
                  <th>Médecin Spécialiste</th>
                  <th>Date & Heure</th>
                  <th>Motif de consultation</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {profile.RendezVous.map(rv => (
                  <tr key={rv.id}>
                    <td className="medecin-name">Dr. {rv.Medecin?.User?.nom}</td>
                    <td>{new Date(rv.date_rdv).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</td>
                    <td>{rv.motif}</td>
                    <td>
                      {/* La couleur change toute seule selon le statut grâce au CSS ! */}
                      <span className={`status-badge status-${rv.statut}`}>
                        {rv.statut.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#718096', fontStyle: 'italic' }}>Aucun rendez-vous planifié pour le moment.</p>
          )}
        </section>

      </div>
    </div>
  );
}