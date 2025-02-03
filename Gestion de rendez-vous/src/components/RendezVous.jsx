import React, { useState, useEffect } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navigation from '../components/Navigation';


const RendezVous = () => {
  const { mechanicId } = useParams(); // ID du mécanicien passé en URL
  const navigate = useNavigate();
  const location = useLocation(); // Récupérer le nom du mécanicien depuis l'annuaire

  const [selectedVehicle, setSelectedVehicle] = useState(''); // Véhicule choisi
  const [symptoms, setSymptoms] = useState(''); // Symptômes du véhicule
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date de rendez-vous
  const [vehicles, setVehicles] = useState([]); // Liste des véhicules du client
  const [user, setUser] = useState({ firstName: '', lastName: '' }); // Infos du client connecté
  const [appointments, setAppointments] = useState([]); // Rendez-vous du client

  useEffect(() => {
    // Récupérer la liste des véhicules du client depuis le localStorage
    const storedVehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    setVehicles(storedVehicles);

    // Récupérer les infos du client connecté
    const storedUser = JSON.parse(localStorage.getItem('user')) || { firstName: 'John', lastName: 'Doe' };
    setUser(storedUser); // Mettre à jour les infos du client connecté

    // Récupérer les rendez-vous du client
    const clientAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const filteredAppointments = clientAppointments.filter((appt) => appt.clientId === storedUser.clientId);
    setAppointments(filteredAppointments);
  }, []);

  const handleSubmitAppointment = (e) => {
    e.preventDefault();

    const vehicleDetails = vehicles.find((v) => v.id === selectedVehicle);

    const clientInfo = {
      clientId: user.clientId || '123', // ID du client
      clientName: `${user.firstName} ${user.lastName}`, // Nom complet du client
      clientEmail: user.email || 'unknown@example.com',
    };

    const newAppointment = {
      mechanicId,
      mechanicName: location.state.mechanicName, // Nom du mécanicien sélectionné
      ...clientInfo,
      vehicle: {
        id: vehicleDetails.id,
        make: vehicleDetails.make,
        model: vehicleDetails.model,
        year: vehicleDetails.year,
        engineType: vehicleDetails.engineType,
        vehicleClass: vehicleDetails.vehicleClass,
      },
      symptoms,
      date: selectedDate,
      status: 'pending', // Statut par défaut
    };

    const existingAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    existingAppointments.push(newAppointment);

    // Sauvegarder le rendez-vous
    localStorage.setItem('appointments', JSON.stringify(existingAppointments));
    navigate('/mes-rendez-vous'); // Rediriger après soumission
  };

  return (
    
    <Container>
      <Navigation/>
      <h2>Prendre un rendez-vous</h2>

      {/* Afficher le nom du mécanicien sélectionné */}
      <Form.Group controlId="mechanicName" className="mb-3">
        <Form.Label>Mécanicien sélectionné</Form.Label>
        <Form.Control
          type="text"
          value={location.state?.mechanicName || 'Mécanicien non trouvé'}
          readOnly
        />
      </Form.Group>

      <Form onSubmit={handleSubmitAppointment}>
        {/* Sélection du véhicule */}
        <Form.Group controlId="vehicleSelect" className="mb-3">
          <Form.Label>Choisir un véhicule</Form.Label>
          <Form.Control
            as="select"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(vehicles.find((v) => v.id === e.target.value))}
            required
          >
            <option value="">Sélectionnez un véhicule</option>
            {vehicles.map((vehicle, index) => (
              <option key={index} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Affichage des détails du véhicule */}
        {selectedVehicle && typeof selectedVehicle === 'object' && (
          <div>
            <p><strong>Véhicule :</strong> {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</p>
            <p><strong>Type de moteur :</strong> {selectedVehicle.engineType}</p>
            <p><strong>Classe du véhicule :</strong> {selectedVehicle.vehicleClass}</p>
          </div>
        )}

        {/* Date de rendez-vous */}
        <Form.Group controlId="datePicker" className="mb-3">
          <Form.Label>Choisir une date</Form.Label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            dateFormat="Pp"
            required
          />
        </Form.Group>

        {/* Symptômes */}
        <Form.Group controlId="symptoms" className="mb-3">
          <Form.Label>Décrire les symptômes ou services souhaités</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Prendre rendez-vous
        </Button>
      </Form>

      <h2 className="mt-4">Mes Rendez-vous</h2>
      {appointments.length === 0 ? (
        <p>Aucun rendez-vous trouvé.</p>
      ) : (
        <ul className="list-group">
          {appointments.map((appointment, index) => (
            <li key={index} className="list-group-item">
              <p><strong>Mécanicien :</strong> {appointment.mechanicName}</p>
              <p><strong>Date :</strong> {new Date(appointment.date).toLocaleString()}</p>
              <p><strong>Symptômes :</strong> {appointment.symptoms}</p>
              <p><strong>État :</strong> {appointment.status}</p>
              {appointment.status === 'completed' && (
                <>
                  <p><strong>Coût :</strong> {appointment.cost} $</p>
                  <p><strong>Durée estimée :</strong> {appointment.duration}</p>
                </>
              )}
              {appointment.status === 'rejected' && (
                <p><strong>Raison du refus :</strong> {appointment.rejectionReason}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default RendezVous;