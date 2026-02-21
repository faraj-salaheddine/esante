import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Composants globaux
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';


// Pages
import Home from './pages/Home';
import DoctorList from './pages/DoctorList';
import PatientDashboard from './pages/PatientDashboard';
import Contact from './pages/Contact';
import BookAppointment from './pages/BookAppointment'; // ⚠️ NOUVELLE PAGE
import DoctorDashboard from './pages/DoctorDashboard'


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');

  const openLogin = () => { setModalMode('login'); setIsModalOpen(true); };
  const openRegister = () => { setModalMode('register'); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <Navbar onOpenLogin={openLogin} onOpenRegister={openRegister} />
      <AuthModal isOpen={isModalOpen} onClose={closeModal} initialMode={modalMode} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        {/* ⚠️ NOUVELLE ROUTE POUR LES RENDEZ-VOUS */}
        <Route path="/book/:doctorId" element={<BookAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;