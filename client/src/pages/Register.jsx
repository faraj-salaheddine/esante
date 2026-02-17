import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [user, setUser] = useState({ nom: '', email: '', password: '', role: 'patient' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', user);
      alert("Compte créé !");
      navigate('/login');
    } catch (err) {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nom complet" onChange={e => setUser({...user, nom: e.target.value})} required />
          <input type="email" placeholder="Email" onChange={e => setUser({...user, email: e.target.value})} required />
          <input type="password" placeholder="Mot de passe" onChange={e => setUser({...user, password: e.target.value})} required />
          <select onChange={e => setUser({...user, role: e.target.value})}>
            <option value="patient">Patient</option>
            <option value="medecin">Médecin</option>
          </select>
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    </div>
  );
}