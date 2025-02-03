import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

const ClientAppointments = () => {
  const [appointments, setAppointments] = useState([]);  // Liste des rendez-vous du client
  const [showModal, setShowModal] = useState(false);  // Contrôle de la modal pour l'annulation
  const [selectedAppointment, setSelectedAppointment] = useState(null);  // Rendez-vous sélectionné pour annulation
  const navigate = useNavigate();

  // Récupérer les rendez-vous du client depuis le localStorage
  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    setAppointments(storedAppointments);
  }, []);

  // Fonction pour gérer l'annulation d'un rendez-vous
  const handleCancelAppointment = () => {
    const updatedAppointments = appointments.filter(app => app !== selectedAppointment);
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setShowModal(false);  // Fermer la modal
  };

  // Fonction pour rediriger vers la modification d'un rendez-vous
  const handleEditAppointment = (appointmentId) => {
    navigate(`/rendez-vous/${appointmentId}/modifier`);
  };

  // Redirection vers l'annuaire des mécaniciens pour prendre un rendez-vous
  const handleNewAppointment = () => {
    navigate('/annuaire-mecaniciens');
  };

  return (
    <div className="container">
      <Navigation />
      <h2> <FontAwesomeIcon icon={faCalendarAlt} /> Mes Rendez-Vous</h2>

      <Button
        variant="primary"
        className="mb-3"
        onClick={handleNewAppointment}  // Redirection vers MechanicDirectory
      >
        Prendre un nouveau rendez-vous
      </Button>

      {appointments.length > 0 ? (
        <ListGroup className="mb-3">
          {appointments.map((appointment, index) => (
            <ListGroup.Item key={index}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p><strong>Mécanicien : </strong>{appointment.mechanicName} - <FontAwesomeIcon icon={faEdit} /></p>
                  {/* Assurer que vehicle est un objet avant de l'afficher */}
                  {appointment.vehicle && (
                    <p>
                      <strong>Véhicule : </strong>{appointment.vehicle.make} {appointment.vehicle.model} ({appointment.vehicle.year})
                    </p>
                  )}
                  <p><strong>Date : </strong>{new Date(appointment.date).toLocaleString()}</p>
                  <p><strong>Symptômes : </strong>{appointment.symptoms}</p>
                  <p><strong>État :</strong> {appointment.status || 'En attente'}</p>
                  {appointment.status === 'completed' && (
                <>
                  <p><strong>Coût :</strong> {appointment.cost} $</p>
                  <p><strong>Durée estimée :</strong> {appointment.duration}</p>
                </>
              )}
              {appointment.status === 'rejected' && (
                <p><strong>Raison du refus :</strong> {appointment.rejectionReason}</p>
              )}
                </div>
                <div>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEditAppointment(appointment.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setShowModal(true);
                    }}
                  > <FontAwesomeIcon icon={faTimes} />
                   
                    Annuler
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Vous n'avez aucun rendez-vous pour le moment.</p>
      )}

      {/* Modal de confirmation d'annulation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Annuler le Rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir annuler ce rendez-vous ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button variant="danger" onClick={handleCancelAppointment}>
            Confirmer l'annulation
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientAppointments;