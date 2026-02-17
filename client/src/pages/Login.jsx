import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/doctors');
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Bon retour !</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Se connecter</button>
        </form>
        <p>Pas de compte ? <Link to="/register">Inscrivez-vous</Link></p>
      </div>
    </div>
  );
}