import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyCode from './pages/VerifyCode';
import DoctorList from './pages/DoctorList';
import PatientDashboard from './pages/PatientDashboard';

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/verify" element={<VerifyCode />} />
  
  {/* Ces deux routes sont maintenant séparées */}
  <Route path="/doctors" element={<DoctorList />} />
  <Route path="/dashboard" element={<PatientDashboard />} />
</Routes>
    </Router>
  );
}

export default App;