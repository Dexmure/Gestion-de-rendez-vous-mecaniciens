import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faTools } from '@fortawesome/free-solid-svg-icons';

const HomeContainer = styled(Container)`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
`;

const Heading = styled.h1`
    font-size: 3rem;
    color: #343a40;
    text-align: center;
    margin-bottom: 1rem;
`;

const Paragraph = styled.p`
    font-size: 1.2rem;
    color: #6c757d;
    text-align: center;
    margin-bottom: 2rem;
`;

const Home = () => {
    return (
        <div >
            <Navigation />
            <HomeContainer>
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <Heading> <FontAwesomeIcon icon={faTools} className="me-2" />
                                Bienvenue sur GarageApp
                            </Heading>
                            <Paragraph>
                                Que vous soyez un mécanicien cherchant à gérer vos rendez-vous, ou un client souhaitant entretenir son véhicule, GarageApp est là pour vous aider.
                            </Paragraph>
                            <div className="d-flex justify-content-center mt-4">
                                <Link to="/signup">
                                    <motion.div whileHover={{ scale: 1.1 }}>
                                        <Button variant="primary" className="me-3"> <FontAwesomeIcon icon={faUserPlus} className="me-2" />S'inscrire</Button>
                                    </motion.div>
                                </Link>
                                <Link to="/login">
                                    <motion.div whileHover={{ scale: 1.1 }}>
                                        <Button variant="secondary"><FontAwesomeIcon icon={faSignInAlt} className="me-2" />Se connecter</Button>
                                    </motion.div>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </motion.div>
            </HomeContainer>
        </div>
    );
};

export default Home;