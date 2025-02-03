import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faTools } from '@fortawesome/free-solid-svg-icons';

const ClientVehicules = () => {
  const [vehicles, setVehicles] = useState(JSON.parse(localStorage.getItem('vehicles')) || []);  // Liste des véhicules
  const [showModal, setShowModal] = useState(false);  // Contrôle de la modal pour véhicules
  const [showRepairModal, setShowRepairModal] = useState(false);  // Contrôle de la modal pour réparations
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(null);  // Index du véhicule pour modification ou ajout de réparation
  const [editMode, setEditMode] = useState(false);  // Mode d'édition (pour modification des véhicules)
  const [inputMethod, setInputMethod] = useState('manual');  // Méthode d'ajout de véhicule
  const [vin, setVin] = useState('');  // Numéro VIN pour l'option VIN
  const [vehicleInfo, setVehicleInfo] = useState({
    make: '',  // Marque
    model: '',  // Modèle
    year: '',  // Année
    engineType: '',  // Type de moteur
    vehicleClass: '',  // Classe de véhicule
    repairs: [],  // Liste des réparations du véhicule
  });

  const [repairInfo, setRepairInfo] = useState({
    date: '',
    description: '',
    cost: '',
  });

  // Fonction pour récupérer les infos via VIN
  const fetchVehicleInfoByVIN = async () => {
    try {
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
      const data = response.data.Results;

      setVehicleInfo({
        make: data.find(result => result.Variable === "Make")?.Value || '',
        model: data.find(result => result.Variable === "Model")?.Value || '',
        year: data.find(result => result.Variable === "Model Year")?.Value || '',
        engineType: data.find(result => result.Variable === "Engine Configuration")?.Value || '',
        vehicleClass: data.find(result => result.Variable === "Vehicle Type")?.Value || '',
        repairs: [],  // Initialisation des réparations à un tableau vide
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des informations via VIN', error);
      alert("Impossible de récupérer les informations à partir du VIN.");
    }
  };

  // Fonction pour récupérer les infos via marque, modèle, année (méthode partielle)
  const fetchVehicleInfoByMakeModelYear = async () => {
    try {
      const { make, model, year } = vehicleInfo;

      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`);
      const data = response.data.Results;

      const matchingModel = data.find(item => item.Model_Name.toLowerCase() === model.toLowerCase());

      if (matchingModel) {
        setVehicleInfo(prevState => ({
          ...prevState,
          make: matchingModel.Make_Name || prevState.make,
          model: matchingModel.Model_Name || prevState.model,
          vehicleClass: matchingModel.VehicleType || prevState.vehicleClass,
          engineType: prevState.engineType || 'Inconnu',
        }));
      } else {
        alert("Modèle non trouvé pour cette combinaison de marque et d'année.");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations avec Marque, Modèle, Année', error);
      alert('Impossible de compléter les informations avec l\'API.');
    }
  };

  // Fonction pour ajouter ou modifier un véhicule
  const handleAddOrUpdateVehicle = () => {
    if (!vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.year) {
      alert("Veuillez compléter toutes les informations avant de soumettre.");
      return;
    }

    if (editMode) {
      // Mettre à jour le véhicule existant
      const updatedVehicles = [...vehicles];
      updatedVehicles[currentVehicleIndex] = { ...vehicleInfo, repairs: vehicleInfo.repairs || [] };  // S'assurer que repairs est toujours un tableau
      setVehicles(updatedVehicles);
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));  // Sauvegarde
    } else {
      // Ajouter un nouveau véhicule
      const newVehicle = { ...vehicleInfo, repairs: [] };  // Initialiser les réparations à un tableau vide
      const updatedVehicles = [...vehicles, newVehicle];
      setVehicles(updatedVehicles);
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));  // Sauvegarde
    }

    // Réinitialiser les champs et fermer la modal
    setVehicleInfo({
      make: '',
      model: '',
      year: '',
      engineType: '',
      vehicleClass: '',
      repairs: [],
    });
    setShowModal(false);
    setEditMode(false);
    setCurrentVehicleIndex(null);
  };

  // Fonction pour ajouter une réparation
  const handleAddRepair = () => {
    const updatedVehicles = [...vehicles];
    if (!updatedVehicles[currentVehicleIndex].repairs) {
      updatedVehicles[currentVehicleIndex].repairs = [];  // Initialiser repairs à un tableau vide si elle n'existe pas
    }
    updatedVehicles[currentVehicleIndex].repairs.push(repairInfo);  // Ajouter la réparation
    setVehicles(updatedVehicles);
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));  // Sauvegarde
    setRepairInfo({ date: '', description: '', cost: '' });  // Réinitialiser les champs de réparation
    setShowRepairModal(false);  // Fermer la modal
  };

  // Fonction pour supprimer un véhicule
  const handleDeleteVehicle = (index) => {
    const updatedVehicles = vehicles.filter((_, i) => i !== index);  // Supprimer le véhicule
    setVehicles(updatedVehicles);
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));  // Sauvegarde la nouvelle liste
  };

  // Fonction pour ouvrir la modal en mode édition et charger les données du véhicule
  const handleEditVehicle = (index) => {
    const vehicleToEdit = vehicles[index];
    setVehicleInfo(vehicleToEdit);  // Charger les infos du véhicule à modifier
    setCurrentVehicleIndex(index);  // Définir l'index du véhicule à modifier
    setEditMode(true);  // Passer en mode édition
    setShowModal(true);  // Ouvrir la modal
  };

  return (
    <div>
      <Navigation/>
      <h2> <FontAwesomeIcon icon={faCar} /> Mes Véhicules</h2>

      {/* Bouton pour ouvrir la modal d'ajout */}
      <Button variant="primary" onClick={() => { setEditMode(false); setShowModal(true); }}>
        Ajouter un véhicule
      </Button>

      {/* Liste des véhicules */}
      <ul className="list-group mt-3">
        {vehicles.map((vehicle, index) => (
          <li key={index} className="list-group-item">
            {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.engineType}, {vehicle.vehicleClass} - <FontAwesomeIcon icon={faTools} />
            <Button variant="warning" className="ms-3" onClick={() => { setCurrentVehicleIndex(index); setShowRepairModal(true); }}>Ajouter une réparation</Button>
            <Button variant="success" className="ms-2" onClick={() => handleEditVehicle(index)}>Modifier</Button>  {/* Bouton pour modifier */}
            <Button variant="danger" className="ms-2" onClick={() => handleDeleteVehicle(index)}>Supprimer</Button>

            {/* Affichage de l'historique des réparations */}
            <ul className="mt-2">
              {(vehicle.repairs || []).map((repair, i) => (  // Vérifier que repairs existe, sinon tableau vide
                <li key={i}>
                  Réparation : {repair.date} - {repair.description} (Coût: {repair.cost} €)
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* Modal pour ajouter une réparation */}
      <Modal show={showRepairModal} onHide={() => setShowRepairModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une réparation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date de la réparation</Form.Label>
              <Form.Control type="date" value={repairInfo.date} onChange={(e) => setRepairInfo({ ...repairInfo, date: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" value={repairInfo.description} onChange={(e) => setRepairInfo({ ...repairInfo, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Coût</Form.Label>
              <Form.Control type="number" value={repairInfo.cost} onChange={(e) => setRepairInfo({ ...repairInfo, cost: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRepairModal(false)}>Fermer</Button>
          <Button variant="primary" onClick={handleAddRepair}>Ajouter la réparation</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal pour ajouter/modifier un véhicule */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Modifier le véhicule' : 'Ajouter un véhicule'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Sélection de la méthode d'ajout */}
            <Form.Group className="mb-3">
              <Form.Label>Méthode d'ajout</Form.Label>
              <Form.Select value={inputMethod} onChange={(e) => setInputMethod(e.target.value)}>
                <option value="manual">Entrée manuelle</option>
                <option value="vin">Utiliser le VIN</option>
                <option value="partial">Entrée partielle (Marque, Modèle, Année)</option>
              </Form.Select>
            </Form.Group>

            {/* Option 1: Entrée manuelle */}
            {inputMethod === 'manual' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Marque</Form.Label>
                  <Form.Control type="text" value={vehicleInfo.make} onChange={(e) => setVehicleInfo({ ...vehicleInfo, make: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Modèle</Form.Label>
                  <Form.Control type="text" value={vehicleInfo.model} onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Année</Form.Label>
                  <Form.Control type="text" value={vehicleInfo.year} onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })} />
                </Form.Group>
              </>
            )}

            {/* Option 2: Utilisation du VIN */}
            {inputMethod === 'vin' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Numéro VIN</Form.Label>
                  <Form.Control type="text" value={vin} onChange={(e) => setVin(e.target.value)} />
                </Form.Group>
                {/* Bouton pour récupérer les infos du véhicule via VIN */}
                <Button onClick={fetchVehicleInfoByVIN} variant="secondary" className="mb-3">
                  Récupérer les infos du véhicule
                </Button>

                {/* Affichage des infos du véhicule si elles sont récupérées */}
                {vehicleInfo.make && (
                  <div>
                    <p><strong>Marque:</strong> {vehicleInfo.make}</p>
                    <p><strong>Modèle:</strong> {vehicleInfo.model}</p>
                    <p><strong>Année:</strong> {vehicleInfo.year}</p>
                    <p><strong>Type de moteur:</strong> {vehicleInfo.engineType}</p>
                    <p><strong>Classe de véhicule:</strong> {vehicleInfo.vehicleClass}</p>
                  </div>
                )}
              </>
            )}

            {/* Option 3: Entrée partielle */}
            {inputMethod === 'partial' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Marque</Form.Label>
                  <Form.Control type="text" value={vehicleInfo.make} onChange={(e) => setVehicleInfo({ ...vehicleInfo, make: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Modèle</Form.Label>
                  <Form.Control type="text" value={vehicleInfo.model} onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Année</Form.Label>
                  <Form.Control type="text" value={vehicleInfo.year} onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })} />
                </Form.Group>

                {/* Bouton pour compléter les infos avec l'API */}
                <Button onClick={fetchVehicleInfoByMakeModelYear} variant="secondary" className="mb-3">
                  Compléter les infos
                </Button>

                {/* Affichage des infos du véhicule si elles sont récupérées */}
                {vehicleInfo.make && (
                  <div>
                    <p><strong>Marque:</strong> {vehicleInfo.make}</p>
                    <p><strong>Modèle:</strong> {vehicleInfo.model}</p>
                    <p><strong>Année:</strong> {vehicleInfo.year}</p>
                    <p><strong>Classe de véhicule:</strong> {vehicleInfo.vehicleClass}</p>
                    <p><strong>Type de moteur:</strong> {vehicleInfo.engineType}</p>
                  </div>
                )}
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
          <Button variant="primary" onClick={handleAddOrUpdateVehicle}>
            {editMode ? 'Mettre à jour le véhicule' : 'Ajouter le véhicule'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientVehicules; 