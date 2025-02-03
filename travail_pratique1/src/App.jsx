import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ClientVehicules from './components/ClientVehicules';
import ClientAppointments from './components/ClientAppointments'; // Import de ClientAppointments
import MechanicAppointments from './components/MechanicAppointments'; // Import MechanicAppointments
import MechanicDirectory from './components/MechanicDirectory'; // Import MechanicDirectory
import RendezVous from './components/RendezVous'; // Import du composant pour la prise de rendez-vous
import { useSelector } from 'react-redux';
import { ThemeProvider } from './context/ThemeContext';
import PaymentForm from './components/PaymentForm';

function App() {
  const user = useSelector((state) => state.user.user); // Récupérer l'utilisateur connecté
  const isAuthentificated = useSelector((state) => state.user.isAuthentificated); // Vérification de l'authentification

  return (
    <ThemeProvider>
    <Router>
      <Routes>
        {/* Routes ouvertes à tous */}
        <Route path="/" element={<Home />} />       {/* Route pour Accueil */}
        <Route path="/login" element={<Login />} /> {/* Route pour Connexion */}
        <Route path="/signup" element={<Signup />} /> {/* Route pour Inscription */}
        
        {/* Profil, accessible uniquement si l'utilisateur est authentifié */}
        <Route path="/profile" element={isAuthentificated ? <Profile /> : <Login />} /> {/* Route pour Profil */}
        <Route path="/ajouter-paiement" element={<PaymentForm />} />
        {/* Routes spécifiques au client */}
        {user && user.role === 'client' && (
          <>
            <Route path="/mes-vehicules" element={<ClientVehicules />} /> {/* Gérer les véhicules */}
            <Route path="/mes-rendez-vous" element={<ClientAppointments />} /> {/* Afficher les rendez-vous du client */}
            <Route path="/annuaire-mecaniciens" element={<MechanicDirectory />} /> {/* Voir l'annuaire des mécaniciens */}
            <Route path="/rendez-vous/:mechanicId" element={<RendezVous />} /> {/* Prendre un rendez-vous */}
            <Route path="/rendez-vous/:mechanicId/modifier" element={<RendezVous />} /> {/* Modifier un rendez-vous */}
          </>
        )}

        {/* Routes spécifiques au mécanicien */}
        {user && user.role === 'mecanicien' && (
          <>
            <Route path="/rendez-vous-a-traiter" element={<MechanicAppointments />} /> {/* Gérer les rendez-vous mécanicien */}
          </>
        )}
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;