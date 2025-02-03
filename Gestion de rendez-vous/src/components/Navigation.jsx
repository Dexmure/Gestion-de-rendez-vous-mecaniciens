// Navigation.js
import React, {useContext} from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faHome, faSignInAlt, faUserPlus, faUser } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
    const user = useSelector((state) => state.user.user);
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">GarageApp</Navbar.Brand>
                <Button onClick={toggleTheme} variant={theme === 'light' ? 'secondary' : 'light'}>
                    <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="me-2" />
                    {theme === 'light' ? 'Thème Sombre' : 'Thème Clair'}
                </Button>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/"> <FontAwesomeIcon icon={faHome} className="me-2" /> Home</Nav.Link>
                        {!user ? (
                            <>
                                <Nav.Link as={Link} to="/login"> <FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Login</Nav.Link>
                                <Nav.Link as={Link} to="/signup"> <FontAwesomeIcon icon={faUserPlus} className="me-2" /> Signup</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/profile"> <FontAwesomeIcon icon={faUser} className="me-2" /> Profile</Nav.Link>
                                {user.role === 'client' && (
                                    <>
                                        <Nav.Link as={Link} to="/mes-vehicules">Mes Véhicules</Nav.Link>
                                        <Nav.Link as={Link} to="/mes-rendez-vous">Mes Rendez-vous</Nav.Link>
                                        <Nav.Link as={Link} to="/ajouter-paiement">Mes Méthode de Paiement</Nav.Link>
                                    </>
                                )}
                                {user.role === 'mecanicien' && (
                                    <Nav.Link as={Link} to="/rendez-vous-a-traiter">Rendez-vous à Traiter</Nav.Link>
                                )}
                                <Nav.Link as={Link} to="/annuaire-mecaniciens">Annuaire des Mécaniciens</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;