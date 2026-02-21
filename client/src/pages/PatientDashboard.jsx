import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaCalendarCheck, FaHistory, FaFolderOpen, FaUpload, FaTimesCircle, FaIdCard, FaEdit } from 'react-icons/fa';
import './PatientDashboard.css';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('profil');
  const [rendezVous, setRendezVous] = useState([]);
  
  const [patientInfo, setPatientInfo] = useState({
    nom: "Chargement...",
    email: "...",
    telephone: "Non renseigné",
    adresse: "Non renseignée"
  });

  const patientId = localStorage.getItem('userId');

  useEffect(() => {
    if (patientId) {
      // 1. Profil du patient
      axios.get(`http://localhost:5000/api/auth/user/${patientId}`)
        .then(res => {
          setPatientInfo({
            nom: res.data.nom || "Utilisateur sans nom",
            email: res.data.email || "Non renseigné",
            telephone: res.data.telephone || "Non renseigné",
            adresse: res.data.adresse || "Non renseignée"
          });
        })
        .catch(err => console.log("Erreur chargement profil :", err));

      // 2. RDV du patient (avec VRAI NOM DU MEDECIN)
      axios.get(`http://localhost:5000/api/appointments/patient/${patientId}`)
        .then(res => {
          const vraisRdvs = res.data.map(rdv => ({
            id: rdv.id,
            // 🎯 C'EST ICI QUE LA MAGIE OPÈRE :
            medecin: rdv.Medecin?.User?.nom || `Médecin N°${rdv.medecin_id}`,
            date: rdv.date_rdv,
            heure: rdv.heure_rdv,
            motif: rdv.motif,
            statut: rdv.statut
          }));
          setRendezVous(vraisRdvs);
        })
        .catch(err => console.log("Erreur chargement RDV :", err));
    }
  }, [patientId]);

  const rdvsAVenir = rendezVous.filter(r => r.statut === "À venir");
  const rdvsPasses = rendezVous.filter(r => r.statut === "Terminé" || r.statut === "Annulé");

  return (
    <div className="patient-dashboard">
      <aside className="dashboard-sidebar">
        <div className="patient-profile-mini">
          <div className="avatar-patient"><FaUser size={35} /></div>
          <h3>{patientInfo.nom}</h3>
          <p>Mon Dossier Santé</p>
        </div>
        <nav className="sidebar-menu">
          <button className={`menu-item ${activeTab === 'profil' ? 'active' : ''}`} onClick={() => setActiveTab('profil')}>
            <FaIdCard size={20} /> Mes Informations
          </button>
          <button className={`menu-item ${activeTab === 'rdv' ? 'active' : ''}`} onClick={() => setActiveTab('rdv')}>
            <FaCalendarCheck size={20} /> Mes Rendez-vous
          </button>
          <button className={`menu-item ${activeTab === 'historique' ? 'active' : ''}`} onClick={() => setActiveTab('historique')}>
            <FaHistory size={20} /> Mon Historique
          </button>
          <button className={`menu-item ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
            <FaFolderOpen size={20} /> Mes Documents
          </button>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Bonjour, {patientInfo.nom}</h1>
          <p>Gérez vos rendez-vous médicaux et vos documents de santé.</p>
        </div>

        {activeTab === 'profil' && (
          <div className="content-card">
            <h2><FaIdCard /> Mes Informations Personnelles</h2>
            <p style={{color: '#64748b'}}>Consultez et mettez à jour vos données de santé.</p>
            <div className="profile-info-grid">
              <div className="info-group"><label>Nom complet</label><p>{patientInfo.nom}</p></div>
              <div className="info-group"><label>Email</label><p>{patientInfo.email}</p></div>
              <div className="info-group"><label>Téléphone</label><p>{patientInfo.telephone}</p></div>
              <div className="info-group"><label>Date de naissance</label><p>Non renseignée</p></div>
              <div className="info-group"><label>Groupe Sanguin</label><p>Non renseigné</p></div>
              <div className="info-group"><label>Adresse</label><p>{patientInfo.adresse}</p></div>
            </div>
            <button className="btn-edit-profile" onClick={() => alert("La modification du profil sera disponible prochainement !")}>
              <FaEdit /> Modifier mes informations
            </button>
          </div>
        )}

        {activeTab === 'rdv' && (
          <div className="content-card">
            <h2><FaCalendarCheck /> Prochains Rendez-vous</h2>
            <div className="rdv-list">
              {rdvsAVenir.length === 0 ? (
                <p style={{color: '#94a3b8'}}>Vous n'avez aucun rendez-vous prévu.</p>
              ) : (
                rdvsAVenir.map(rdv => (
                  <div key={rdv.id} className="rdv-item">
                    <div className="rdv-info">
                      <div className="rdv-date-badge">
                        {rdv.date}<br/><span style={{fontSize:'14px', color:'#0284c7'}}>{rdv.heure}</span>
                      </div>
                      <div className="rdv-doctor">
                        <h4>Dr. {rdv.medecin}</h4>
                        <p>Motif : {rdv.motif}</p>
                      </div>
                    </div>
                    <button className="btn-cancel" onClick={() => alert("Fonctionnalité d'annulation à venir !")}>
                      <FaTimesCircle /> Annuler
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'historique' && (
          <div className="content-card">
            <h2><FaHistory /> Historique des consultations</h2>
            <div className="rdv-list">
              {rdvsPasses.length === 0 ? (
                <p style={{color: '#94a3b8'}}>Aucun historique disponible.</p>
              ) : (
                rdvsPasses.map(rdv => (
                  <div key={rdv.id} className="rdv-item" style={{opacity: 0.7}}>
                    <div className="rdv-info">
                      <div className="rdv-date-badge" style={{background: '#f1f5f9', color: '#64748b'}}>
                        {rdv.date}
                      </div>
                      <div className="rdv-doctor">
                        <h4 style={{color: '#64748b'}}>Dr. {rdv.medecin}</h4>
                        <p>Motif : {rdv.motif} - Statut : <strong>{rdv.statut}</strong></p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="content-card">
            <h2><FaFolderOpen /> Mes Documents Médicaux</h2>
            <p style={{color: '#64748b'}}>Centralisez vos ordonnances, résultats d'analyses et radiographies en toute sécurité.</p>
            <div className="document-upload-zone" onClick={() => alert("L'upload de fichier sera implémenté prochainement !")}>
              <FaUpload size={40} color="#cbd5e1" style={{marginBottom: '15px'}} />
              <h3 style={{color: '#334155', margin: '0 0 10px 0'}}>Cliquez ici pour ajouter un document</h3>
              <p style={{color: '#94a3b8', margin: 0}}>Formats acceptés : PDF, JPG, PNG (Max 5MB)</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}