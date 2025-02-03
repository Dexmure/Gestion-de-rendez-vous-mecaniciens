import React, { useState } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faClock } from '@fortawesome/free-solid-svg-icons';

// Sélection de quatre utilisateurs de Dummy JSON comme mécaniciens
const mechanicsData = [
  {
    id: 1,
    firstName: 'Emily',
    lastName: 'Johnson',
    speciality: 'Moteur',
    availableSlots: ['10:00 - 12:00', '14:00 - 16:00'],
  },
  {
    id: 2,
    firstName: 'James',
    lastName: 'Davis',
    speciality: 'Carrosserie',
    availableSlots: ['09:00 - 11:00', '13:00 - 15:00'],
  },
  {
    id: 3,
    firstName: 'Alexander',
    lastName: 'Jones',
    speciality: 'Électronique',
    availableSlots: ['08:00 - 10:00', '16:00 - 18:00'],
  },
  {
    id: 4,
    firstName: 'Ethan',
    lastName: 'Martinez',
    speciality: 'Freins',
    availableSlots: ['11:00 - 13:00', '15:00 - 17:00'],
  },
];

const MechanicDirectory = () => {
  const [mechanics, setMechanics] = useState(mechanicsData); // Liste des mécaniciens
  const navigate = useNavigate(); // Pour naviguer vers la prise de rendez-vous

  // Fonction pour naviguer vers la prise de rendez-vous avec le nom du mécanicien
  const handleTakeAppointment = (mechanicId, mechanicName) => {
    navigate(`/rendez-vous/${mechanicId}`, { state: { mechanicName } });
  };

  return (
    <div className="container">
      <Navigation />
      <h2> <FontAwesomeIcon icon={faWrench}/>Annuaire des Mécaniciens</h2>
      <div className="row">
        {mechanics.map((mechanic) => (
          <div className="col-md-4" key={mechanic.id}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title> {mechanic.firstName} {mechanic.lastName}  - <FontAwesomeIcon icon={faClock} /></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{mechanic.speciality}</Card.Subtitle>
                <Card.Text>Disponibilités :</Card.Text>
                <ListGroup>
                  {mechanic.availableSlots.map((slot, index) => (
                    <ListGroup.Item key={index}>{slot}</ListGroup.Item>
                  ))}
                </ListGroup>
                <Button 
                  variant="primary" 
                  className="mt-3" 
                  onClick={() => handleTakeAppointment(mechanic.id, `${mechanic.firstName} ${mechanic.lastName}`)}
                >
                  Prendre rendez-vous
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MechanicDirectory;