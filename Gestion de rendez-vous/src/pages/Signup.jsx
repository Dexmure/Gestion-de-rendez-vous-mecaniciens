import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from '../components/Navigation';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // État pour le mot de passe de confirmation
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState('client');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    const newUser = {
      role,
      firstName,
      lastName,
      email,
      userName,
      password,
      birthDate,
    };

    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      dispatch(login(newUser));

      // Réinitialiser les champs après inscription
      setFirstName('');
      setLastName('');
      setEmail('');
      setUserName('');
      setPassword('');
      setConfirmPassword(''); // Réinitialiser le mot de passe de confirmation
      setBirthDate('');

      toast.success('Inscription réussie');
      navigate('/login', { state: { message: 'Inscription réussie' } });
    } catch (error) {
      console.error("Erreur lors de l'inscription", error);
      toast.error("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="container">
      <Navigation/>

      <h1>Inscription</h1>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Sélectionnez votre rôle</label>
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="client">Client</option>
            <option value="mecanicien">Mécanicien</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">Prénom</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="birthDate" className="form-label">Date de naissance</label>
          <input
            type="date"
            className="form-control"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="userName" className="form-label">Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmez le mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">S'inscrire</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;