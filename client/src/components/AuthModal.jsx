import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, initialMode }) {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1);
  
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('patient');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [dateNaissance, setDateNaissance] = useState('');
  const [sexe, setSexe] = useState('M');
  const [groupeSanguin, setGroupeSanguin] = useState('O+');
  const [specialiteId, setSpecialiteId] = useState('1');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ⚠️ LA CORRECTION EST ICI : On force la réinitialisation dès qu'on ouvre la pop-up
  useEffect(() => {
    setMode(initialMode);
    setStep(1); // On remet toujours le formulaire à l'étape 1
    setError(''); setSuccess(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setNom(''); setDateNaissance(''); setAdresse(''); setTelephone('');
  }, [isOpen, initialMode]);

  const handleClose = () => { onClose(); };

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setError('');
    setStep(2); // On passe à la page suivante du formulaire
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        
        // ⚠️ LA CORRECTION EST ICI : On sauvegarde TOUTES les nouvelles infos dans le navigateur
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
        localStorage.setItem('userId', res.data.user.id); // <-- C'est ça qui manquait !
        
        handleClose();
        navigate(res.data.user.role === 'patient' ? '/dashboard' : '/doctors');
      } else {
        const payload = { nom, email, password, role };
        if (role === 'patient') {
          Object.assign(payload, { date_naissance: dateNaissance, sexe, groupe_sanguin: groupeSanguin });
        } else {
          Object.assign(payload, { specialite_id: specialiteId, adresse, telephone });
        }

        await axios.post('http://localhost:5000/api/auth/register', payload);
        setSuccess("Inscription réussie ! Vous pouvez vous connecter.");
        setTimeout(() => { setMode('login'); setStep(1); setSuccess(''); setPassword(''); setConfirmPassword(''); }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue avec le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-sidebar">
          <div className="modal-icon">⚕️</div>
          <h1>E-Santé Maroc</h1>
          <p>{mode === 'login' ? "Connectez-vous pour gérer vos rendez-vous." : "Rejoignez la plateforme et simplifiez votre santé."}</p>
        </div>

        <div className="modal-form-container">
          <button className="close-button" onClick={handleClose} title="Fermer">✕</button>
          
          <h2>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h2>
          <p className="modal-subtitle">
            {mode === 'login' ? 'Entrez vos identifiants' : 'Complétez votre profil pour continuer'}
          </p>

          {mode === 'register' && <div className="step-indicator">Étape {step} sur 2</div>}

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <form className="modal-form" onSubmit={handleSubmit}>
            
            {/* --- CONNEXION --- */}
            {mode === 'login' && (
              <>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" className="modal-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Mot de passe</label>
                  <div className="password-wrapper">
                    <input type={showPwd ? "text" : "password"} className="modal-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" className="eye-button" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '👁️‍🗨️' : '👁️'}</button>
                  </div>
                </div>
                <button type="submit" className="btn-submit-modal" disabled={isLoading}>{isLoading ? 'Patientez...' : 'Se connecter'}</button>
              </>
            )}

            {/* --- INSCRIPTION ÉTAPE 1 --- */}
            {mode === 'register' && step === 1 && (
              <>
                <div className="input-group">
                  <label>Je suis...</label>
                  <select className="modal-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="patient">Un Patient</option>
                    <option value="medecin">Un Médecin Spécialiste</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Nom Complet</label>
                  <input type="text" className="modal-input" value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" className="modal-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="input-group">
                  <label>Mot de passe</label>
                  <div className="password-wrapper">
                    <input type={showPwd ? "text" : "password"} className="modal-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" className="eye-button" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '👁️‍🗨️' : '👁️'}</button>
                  </div>
                </div>

                <div className="input-group">
                  <label>Confirmer le mot de passe</label>
                  <div className="password-wrapper">
                    <input type={showConfirmPwd ? "text" : "password"} className="modal-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <button type="button" className="eye-button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>{showConfirmPwd ? '👁️‍🗨️' : '👁️'}</button>
                  </div>
                </div>

                <button type="button" className="btn-submit-modal" onClick={handleNextStep}>Suivant ➔</button>
              </>
            )}

            {/* --- INSCRIPTION ÉTAPE 2 (PATIENT) --- */}
            {mode === 'register' && step === 2 && role === 'patient' && (
              <>
                <div className="input-group">
                  <label>Date de naissance</label>
                  <input type="date" className="modal-input" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Sexe</label>
                  <select className="modal-select" value={sexe} onChange={(e) => setSexe(e.target.value)}>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Groupe Sanguin</label>
                  <select className="modal-select" value={groupeSanguin} onChange={(e) => setGroupeSanguin(e.target.value)}>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
              </>
            )}

            {/* --- INSCRIPTION ÉTAPE 2 (MÉDECIN) --- */}
            {mode === 'register' && step === 2 && role === 'medecin' && (
              <>
                <div className="input-group">
                  <label>Spécialité</label>
                  <select className="modal-select" value={specialiteId} onChange={(e) => setSpecialiteId(e.target.value)}>
                    <option value="1">Cardiologue</option>
                    <option value="2">Dermatologue</option>
                    <option value="3">Généraliste</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Adresse du cabinet</label>
                  <input type="text" className="modal-input" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="123 Rue de l'Hôpital, Ville" required />
                </div>
                <div className="input-group">
                  <label>Numéro de téléphone</label>
                  <input type="tel" className="modal-input" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="06..." required />
                </div>
              </>
            )}

            {mode === 'register' && step === 2 && (
              <div className="button-group">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>⬅ Retour</button>
                <button type="submit" className="btn-primary-half" disabled={isLoading}>{isLoading ? '...' : "Valider l'inscription"}</button>
              </div>
            )}

          </form>

          <div className="toggle-mode">
            {mode === 'login' ? (
              <p>Nouveau ici ? <span onClick={() => { setMode('register'); setStep(1); setError(''); }}>Créer un compte</span></p>
            ) : (
              <p>Déjà inscrit ? <span onClick={() => { setMode('login'); setError(''); }}>Se connecter</span></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}