import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { login, deletePaymentOption} from '../redux/userSlice'; // Import de l'action login depuis Redux
import Navigation from '../components/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faCar, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import PaymentForm from '../components/PaymentForm';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Récupérer l'utilisateur connecté depuis Redux
  const paymentOptions = useSelector((state) => state.user.paymentOptions);
  const [editingCard, setEditingCard] = useState(null);
  const [showModal, setShowModal] = useState(false); // Contrôle de la modal pour modifier les informations
  const [editableUser, setEditableUser] = useState({ firstName: user?.firstName, lastName: user?.lastName,birthDate: user?.birthDate });

  

  const handleDelete = (cardNumber) => {
    dispatch(deletePaymentOption(cardNumber)); // Supprime l'option de paiement
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  // Sauvegarder les modifications du profil
  const handleSaveChanges = (e) => {
    e.preventDefault();

    // Mise à jour des informations de l'utilisateur
    const updatedUser = { ...user, ...editableUser };
    
    // Mettre à jour localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Mettre à jour Redux avec les nouvelles informations utilisateur
    dispatch(login(updatedUser));
    
    setShowModal(false); // Fermer la modal
  };

  return (
    <div className="container">
      <Navigation />
      <h1>Bienvenue {user?.firstName} {user?.lastName}</h1>
      <p><strong>Rôle :</strong> {user?.role}</p>

      <h3>Informations personnelles</h3>
      <p><strong>Prénom :</strong> {user?.firstName}</p>
      <p><strong>Nom :</strong> {user?.lastName}</p>
      <p><strong>Date de naissance :</strong> {user?.birthDate}</p>
      <p><strong>Email :</strong> {user?.email}</p>

      <Button variant="warning" onClick={() => setShowModal(true)} className="mb-4">
      <FontAwesomeIcon icon={faUserEdit} className="me-2" /> Modifier les informations
      </Button>

      {/* Boutons pour les fonctionnalités client */}
      {user?.role === 'client' && (
        <div className="mt-4">
          <Link to="/mes-vehicules" className="btn btn-primary me-2"> <FontAwesomeIcon icon={faCar} className="me-2" /> Voir mes véhicules</Link>
          <Link to="/mes-rendez-vous" className="btn btn-secondary me-2"> <FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> Voir mes rendez-vous</Link>
          <Link to="/ajouter-paiement" className="btn btn-success" style={{ marginLeft: '10px' }}>
            Ajouter une méthode de paiement
          </Link>
         {/* Affichage des options de paiement sauvegardées */}
        <h3 className="mt-4">Options de paiement sauvegardées</h3>
        {paymentOptions.length > 0 ? (
          <ul>
            {paymentOptions.map((option, index) => (
              <li key={index}>
                Carte se terminant par ****{option.cardNumber.slice(-4)}
                
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(option.cardNumber)}>
                  Supprimer
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune option de paiement sauvegardée.</p>
        )}

        {/* Formulaire pour ajouter ou modifier une carte */}
        {editingCard && <PaymentForm editingCard={editingCard} onEditCancel={() => setEditingCard(null)} />}
      </div>

       
      )}

      {/* Boutons pour les fonctionnalités mécanicien */}
      {user?.role === 'mecanicien' && (
        <div className="mt-4">
          <Link to="/rendez-vous-a-traiter" className="btn btn-primary me-2">Voir les rendez-vous à traiter</Link>
        </div>
      )}

      {/* Modal pour modifier les informations personnelles */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier les informations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveChanges}>
            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={editableUser.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={editableUser.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                value={editableUser.birthDate}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={user?.email}
                readOnly
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enregistrer les modifications
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;