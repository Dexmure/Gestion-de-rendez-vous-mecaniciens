import React, { useState } from 'react';
import axios from 'axios';  // Pour faire des requêtes HTTP à DummyJSON
import { useDispatch } from 'react-redux';
import { login } from '../redux/userSlice';  // Action Redux pour mettre à jour l'état utilisateur
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import du CSS Toastify
import Navigation from '../components/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');  // État pour l'email (ou nom d'utilisateur)
  const [password, setPassword] = useState('');  // État pour le mot de passe
  const dispatch = useDispatch();  // Utiliser Redux pour gérer l'état global
  const navigate = useNavigate();  // Pour la redirection après la connexion

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Vérification locale : Récupérer les utilisateurs du LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    // Chercher l'utilisateur localement par email et mot de passe
    const localUser = users.find((u) => u.email === email && u.password === password);
  
    if (localUser) {
      console.log('Utilisateur trouvé localement:', localUser);
      // Mettre à jour Redux avec l'utilisateur local
      dispatch(login(localUser));
  
      // Rediriger vers le profil
      navigate('/profile', { state: { message: 'Connexion réussie' } });
    } else {
      // Sinon, essayer de connecter avec DummyJSON
      
      try {
        const response = await axios.post('https://dummyjson.com/auth/login', {
          username: email,
          password,
        });
  
        // Ajouter un rôle fictif, car DummyJSON n'en fournit pas
        const userWithRole = {
          ...response.data,
          role: 'mecanicien',  // On peut définir un rôle par défaut (par exemple "client")
        };
  
        // Mettre à jour Redux avec les données de DummyJSON
        dispatch(login(userWithRole));
  
        // Rediriger vers le profil
        navigate('/profile', { state: { message: 'Connexion réussie' } });
      } catch (error) {
        toast.error('Nom d\'utilisateur ou mot de passe incorrect');
      }
    }
  };

  return (
    <div className="container">
      <Navigation/>
     
      <h1>Connexion</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label"> <FontAwesomeIcon icon={faEnvelope} className="me-2" /> Email ou Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">  <FontAwesomeIcon icon={faLock} className="me-2" /> Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Se connecter</button>
      </form>

      {/* Afficher le conteneur des notifications Toastify */}
      <ToastContainer  
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;