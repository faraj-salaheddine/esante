import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserMd, FaCalendarAlt, FaUserInjured, FaNotesMedical, FaCheckCircle, FaBan, FaSearch, FaSortAmountDown, FaIdCard, FaEdit } from 'react-icons/fa';
import './DoctorDashboard.css';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('profil');
  const [activeNoteId, setActiveNoteId] = useState(null);

  const [sortType, setSortType] = useState('date-asc'); 
  const [searchPatient, setSearchPatient] = useState(''); 
  
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [periodeAbsence, setPeriodeAbsence] = useState('Journée entière');

  const medecinId = localStorage.getItem('userId');

  const [medecinInfo, setMedecinInfo] = useState({
    nom: "Chargement...",
    email: "...",
    telephone: "Non renseigné",
    adresse: "Non renseignée"
  });

  const [rendezVous, setRendezVous] = useState([]);

  useEffect(() => {
    if (medecinId) {
      // 1. Profil du médecin
      axios.get(`http://localhost:5000/api/auth/user/${medecinId}`)
        .then(res => {
          setMedecinInfo({
            nom: res.data.nom || "Médecin sans nom",
            email: res.data.email || "Non renseigné",
            telephone: res.data.telephone || "Non renseigné",
            adresse: res.data.adresse || "Non renseignée"
          });
        })
        .catch(err => console.log("Erreur chargement profil :", err));

      // 2. RDV du médecin (avec VRAI NOM DU PATIENT)
      axios.get(`http://localhost:5000/api/appointments/medecin/${medecinId}`)
        .then(res => {
          const vraisRdvs = res.data.map(rdv => ({
            id: rdv.id,
            // 🎯 C'EST ICI QUE LA MAGIE OPÈRE :
            patient: rdv.Patient?.User?.nom || `Patient N°${rdv.patient_id}`,
            date: rdv.date_rdv,
            heure: rdv.heure_rdv,
            motif: rdv.motif,
            statut: rdv.statut,
            noteSecrete: rdv.note_secrete
          }));
          setRendezVous(vraisRdvs);
        })
        .catch(err => console.log("Erreur chargement RDV :", err));
    }
  }, [medecinId]);

  const sortedRdv = [...rendezVous]
    .filter(r => r.statut === "À venir")
    .sort((a, b) => {
      if (sortType === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortType === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortType === 'nom') return a.patient.localeCompare(b.patient);
      return 0;
    });

  const filteredHistory = rendezVous.filter(r => 
    r.statut === "Terminé" && 
    r.patient.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const handleSaveNote = async (id, text) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/note`, {
        note_secrete: text
      });
      const newData = rendezVous.map(rdv => rdv.id === id ? { ...rdv, noteSecrete: text } : rdv);
      setRendezVous(newData);
      setActiveNoteId(null);
      alert("🔒 Note secrète enregistrée définitivement !");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur serveur lors de la sauvegarde.");
    }
  };

  const handleSaveAbsence = async () => {
    if (!medecinId) return alert("Erreur : Aucun médecin connecté.");
    if (!dateDebut) return alert("⚠️ Veuillez choisir au moins une date de début !");
    
    try {
      const res = await axios.post('http://localhost:5000/api/absences', {
        medecin_id: medecinId,
        date_debut: dateDebut,
        date_fin: dateFin || dateDebut,
        periode: periodeAbsence
      });
      alert(res.data.message);
      setDateDebut('');
      setDateFin('');
    } catch (err) {
      console.error(err);
      alert("❌ Erreur serveur lors de la sauvegarde du congé.");
    }
  };

  return (
    <div className="doctor-dashboard">
      <aside className="dashboard-sidebar">
        <div className="doctor-profile-mini">
          <div className="avatar-pro"><FaUserMd size={40} /></div>
          <h3>{medecinInfo.nom}</h3>
          <p>Espace Praticien</p>
        </div>
        <nav className="sidebar-menu">
          <button className={`menu-item ${activeTab === 'profil' ? 'active' : ''}`} onClick={() => setActiveTab('profil')}>
            <FaIdCard size={20} /> Mes Informations
          </button>
          <button className={`menu-item ${activeTab === 'rdv' ? 'active' : ''}`} onClick={() => setActiveTab('rdv')}>
            <FaCalendarAlt size={20} /> Mon Agenda
          </button>
          <button className={`menu-item ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
            <FaUserInjured size={20} /> Dossiers Patients
          </button>
          <button className={`menu-item ${activeTab === 'absences' ? 'active' : ''}`} onClick={() => setActiveTab('absences')}>
            <FaBan size={20} /> Gérer mes Absences
          </button>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Bonjour, {medecinInfo.nom}</h1>
          <p>Voici un résumé de votre activité de consultation.</p>
        </div>

        {activeTab === 'profil' && (
          <div className="content-card">
            <h2><FaIdCard /> Mes Informations Professionnelles</h2>
            <p style={{color: '#64748b'}}>Consultez et mettez à jour vos coordonnées de cabinet.</p>
            <div className="profile-info-grid">
              <div className="info-group"><label>Nom complet</label><p>{medecinInfo.nom}</p></div>
              <div className="info-group"><label>Email Pro</label><p>{medecinInfo.email}</p></div>
              <div className="info-group"><label>Téléphone Cabinet</label><p>{medecinInfo.telephone}</p></div>
              <div className="info-group"><label>Adresse du Cabinet</label><p>{medecinInfo.adresse}</p></div>
              <div className="info-group"><label>Spécialité</label><p>Médecin</p></div>
              <div className="info-group"><label>Numéro INPE</label><p>Non renseigné</p></div>
            </div>
            <button className="btn-edit-profile" onClick={() => alert("La modification des informations du cabinet sera disponible prochainement !")}>
              <FaEdit /> Modifier mes informations
            </button>
          </div>
        )}

        {activeTab === 'rdv' && (
          <div className="content-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2 style={{margin:0}}><FaCalendarAlt /> Rendez-vous à venir</h2>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <FaSortAmountDown color="#64748b" />
                <select value={sortType} onChange={(e) => setSortType(e.target.value)} style={{padding:'8px', borderRadius:'8px', border:'1px solid #cbd5e1'}}>
                  <option value="date-asc">Date (Plus proche)</option>
                  <option value="date-desc">Date (Plus lointain)</option>
                  <option value="nom">Patient (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="rdv-list">
              {sortedRdv.length === 0 ? (
                <p style={{color: '#94a3b8', textAlign: 'center'}}>Aucun rendez-vous à venir.</p>
              ) : (
                sortedRdv.map(rdv => (
                  <div key={rdv.id} className="rdv-item">
                    <div className="rdv-info">
                      <div className="rdv-time">{rdv.heure}</div>
                      <div className="rdv-patient">
                        <h4>{rdv.patient}</h4>
                        <p>Date : {rdv.date} | Motif : {rdv.motif}</p>
                      </div>
                    </div>
                    <div className="rdv-actions">
                      <button className="btn-action success" onClick={() => alert("Dossier patient ouvert !")}>
                        <FaCheckCircle /> Démarrer la consultation
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="content-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'15px'}}>
              <div>
                <h2 style={{margin:0}}><FaNotesMedical /> Historique et Notes Privées</h2>
                <p style={{color: '#64748b', margin:'5px 0 0 0'}}>Ces notes sont strictement confidentielles.</p>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', background:'#f1f5f9', padding:'8px 15px', borderRadius:'30px'}}>
                <FaSearch color="#64748b" />
                <input type="text" placeholder="Rechercher un patient..." value={searchPatient} onChange={(e) => setSearchPatient(e.target.value)} style={{border:'none', background:'transparent', outline:'none', width:'200px'}} />
              </div>
            </div>
            
            <div className="rdv-list">
              {filteredHistory.length === 0 ? (
                <p style={{textAlign:'center', color:'#94a3b8', padding:'20px'}}>Aucun historique trouvé.</p>
              ) : (
                filteredHistory.map(rdv => (
                  <div key={rdv.id} className="rdv-item" style={{flexWrap: 'wrap'}}>
                    <div className="rdv-info" style={{width: '100%', justifyContent: 'space-between'}}>
                      <div>
                        <h4 style={{margin: '0 0 5px 0'}}>{rdv.patient}</h4>
                        <p style={{color: '#64748b', margin: 0}}>Vu le : {rdv.date} à {rdv.heure} - Motif : {rdv.motif}</p>
                      </div>
                      <button className="btn-action note" onClick={() => setActiveNoteId(activeNoteId === rdv.id ? null : rdv.id)}>
                        <FaNotesMedical /> {rdv.noteSecrete ? "Modifier la note" : "Ajouter une note secrète"}
                      </button>
                    </div>

                    {activeNoteId === rdv.id && (
                      <div className="private-note-zone">
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>📝 Note privée pour {rdv.patient} :</label>
                        <textarea rows="3" defaultValue={rdv.noteSecrete} id={`note-${rdv.id}`}></textarea>
                        <button className="btn-save-note" onClick={() => handleSaveNote(rdv.id, document.getElementById(`note-${rdv.id}`).value)}>
                          Enregistrer la note
                        </button>
                      </div>
                    )}
                    {rdv.noteSecrete && activeNoteId !== rdv.id && (
                      <div style={{width: '100%', marginTop: '10px', padding: '10px', background: '#fffbeb', borderLeft: '4px solid #f59e0b', color: '#b45309', borderRadius: '4px'}}>
                        <strong>Note du médecin :</strong> {rdv.noteSecrete}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'absences' && (
          <div className="content-card">
            <h2><FaBan /> Gérer mes Congés et Indisponibilités</h2>
            <p style={{color: '#64748b'}}>Bloquez des périodes complètes. Les patients ne pourront plus prendre rendez-vous sur ces dates.</p>
            
            <div style={{display: 'flex', gap: '15px', marginTop: '20px', alignItems: 'center', flexWrap: 'wrap', background: '#f8fafc', padding: '20px', borderRadius: '12px'}}>
              <div>
                <label style={{display:'block', fontSize:'13px', fontWeight:'bold', marginBottom:'5px', color:'#64748b'}}>Du :</label>
                <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} style={{padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px'}} />
              </div>
              <div>
                <label style={{display:'block', fontSize:'13px', fontWeight:'bold', marginBottom:'5px', color:'#64748b'}}>Au (Optionnel) :</label>
                <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} min={dateDebut} style={{padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px'}} />
              </div>
              <div style={{alignSelf: 'flex-end'}}>
                <select value={periodeAbsence} onChange={(e) => setPeriodeAbsence(e.target.value)} style={{padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', height:'43px'}}>
                  <option value="Journée entière">Journée entière</option>
                  <option value="Matin">Matin</option>
                  <option value="Après-midi">Après-midi</option>
                </select>
              </div>
              <button className="btn-save-note" style={{background: '#e11d48', height:'43px', alignSelf:'flex-end'}} onClick={handleSaveAbsence}>
                Bloquer la période
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}