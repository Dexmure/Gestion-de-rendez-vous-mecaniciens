import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';

const MechanicAppointments = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [repairCost, setRepairCost] = useState('');
  const [repairDuration, setRepairDuration] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    if (user && user.role === 'mecanicien') {
      // Récupérer les rendez-vous du localStorage
      const storedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
      const storedVehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
  
      const updatedAppointments = storedAppointments.map((appointment) => {
        if (typeof appointment.vehicle === 'string') {
          const vehicle = storedVehicles.find((v) => v.id === appointment.vehicle);
          if (vehicle) {
            return { ...appointment, vehicle };
          }
        }
        return appointment;
      });
      setAppointments(updatedAppointments);
  
      // Récupérer les factures du localStorage
      const storedInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
      setInvoices(storedInvoices);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleShowDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleMarkAsCompleted = () => {
    if (!repairCost || !repairDuration) {
      alert('Veuillez entrer le coût et la durée de la réparation.');
      return;
    }

    // Mettre à jour le rendez-vous avec le coût, la durée, et marquer comme terminé
    const updatedAppointments = appointments.map((appt) =>
      appt === selectedAppointment ? { ...appt, status: 'completed', cost: repairCost, duration: repairDuration } : appt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Ajouter la facture dans le localStorage
    const newInvoice = {
      clientName: selectedAppointment.clientName,
      vehicle: selectedAppointment.vehicle,
      date: selectedAppointment.date,
      cost: repairCost,
      duration: repairDuration,
      mechanicName: user.firstName + ' ' + user.lastName,
      benefit: (0.15 * parseFloat(repairCost)).toFixed(2), // Calcul des bénéfices (15%)
    };
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

    setShowModal(false);
    setRepairCost('');
    setRepairDuration('');
  };

  const handleAcceptReject = (appointment, status) => {
    if (status === 'rejected' && !rejectionReason) {
      alert('Veuillez entrer la raison du refus.');
      return;
    }

    const updatedAppointments = appointments.map((appt) =>
      appt === appointment ? { ...appt, status, rejectionReason: status === 'rejected' ? rejectionReason : undefined } : appt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    setShowRejectionModal(false);
    setRejectionReason('');
  };

  return (
    <Container>
      <Navigation/>
      <h2>Mes Rendez-vous à Traiter</h2>
      {appointments.length === 0 ? (
        <p>Aucun rendez-vous à traiter.</p>
      ) : (
        <ul className="list-group">
          {appointments.map((appointment, index) => (
            <li key={index} className="list-group-item">
              <p><strong>Client :</strong> {appointment.clientName}</p>
              {appointment.vehicle ? (
                <p><strong>Véhicule :</strong> {appointment.vehicle.make} {appointment.vehicle.model} ({appointment.vehicle.year})</p>
              ) : (
                <p><strong>Véhicule :</strong> Information non disponible</p>
              )}
              <p><strong>Date :</strong> {new Date(appointment.date).toLocaleString()}</p>
              <p><strong>Statut :</strong> {appointment.status}</p>
              {appointment.status === 'pending' && (
                <div>
                  <Button variant="success" onClick={() => handleAcceptReject(appointment, 'accepted')} className="me-2">Accepter</Button>
                  <Button variant="danger" onClick={() => { setSelectedAppointment(appointment); setShowRejectionModal(true); }} className="me-2">Refuser</Button>
                </div>
              )}
              {appointment.status === 'accepted' && (
                <Button variant="info" onClick={() => handleShowDetails(appointment)} className="me-2">Détails et Terminer</Button>
              )}
              {appointment.status === 'rejected' && (
                <p><strong>Raison du refus :</strong> {appointment.rejectionReason}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Modal pour voir les détails et marquer comme terminé */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Détails du Rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <p><strong>Client :</strong> {selectedAppointment.clientName}</p>
              <p><strong>Email :</strong> {selectedAppointment.clientEmail}</p>
              {selectedAppointment.vehicle ? (
                <p><strong>Véhicule :</strong> {selectedAppointment.vehicle.make} {selectedAppointment.vehicle.model} ({selectedAppointment.vehicle.year})</p>
              ) : (
                <p><strong>Véhicule :</strong> Information non disponible</p>
              )}
              <p><strong>Symptômes :</strong> {selectedAppointment.symptoms}</p>
              <p><strong>Date :</strong> {new Date(selectedAppointment.date).toLocaleString()}</p>
              <Form.Group className="mb-3">
                <Form.Label>Durée estimée de la réparation</Form.Label>
                <Form.Control
                  type="text"
                  value={repairDuration}
                  onChange={(e) => setRepairDuration(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Coût de la réparation</Form.Label>
                <Form.Control
                  type="number"
                  value={repairCost}
                  onChange={(e) => setRepairCost(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
          <Button variant="primary" onClick={handleMarkAsCompleted}>Marquer comme terminé</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal pour refuser un rendez-vous */}
      <Modal show={showRejectionModal} onHide={() => setShowRejectionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Raison du Refus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Veuillez spécifier la raison du refus</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectionModal(false)}>Fermer</Button>
          <Button variant="danger" onClick={() => handleAcceptReject(selectedAppointment, 'rejected')}>Refuser le rendez-vous</Button>
        </Modal.Footer>
      </Modal>

      <h2 className="mt-4">Factures</h2>
      {invoices.length === 0 ? (
        <p>Aucune facture disponible.</p>
      ) : (
        <ul className="list-group">
          {invoices.map((invoice, index) => (
            <li key={index} className="list-group-item">
              <p><strong>Client :</strong> {invoice.clientName}</p>
              {invoice.vehicle ? (
                <p><strong>Véhicule :</strong> {invoice.vehicle.make} {invoice.vehicle.model} ({invoice.vehicle.year})</p>
              ) : (
                <p><strong>Véhicule :</strong> Information non disponible</p>
              )}
              <p><strong>Date :</strong> {new Date(invoice.date).toLocaleString()}</p>
              <p><strong>Coût :</strong> {invoice.cost} $</p>
              <p><strong>Durée :</strong> {invoice.duration}</p>
              <p><strong>Bénéfice :</strong> {invoice.benefit} $</p>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default MechanicAppointments;