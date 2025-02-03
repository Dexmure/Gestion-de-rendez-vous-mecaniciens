import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPaymentOption } from '../redux/userSlice';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const PaymentForm = () => {
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const dispatch = useDispatch();
  const paymentOptions = useSelector((state) => state.user.paymentOptions);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardInfo({ ...cardInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isCardExists = paymentOptions.some(
      (option) => option.cardNumber === cardInfo.cardNumber
    );

    if (!isCardExists) {
      dispatch(addPaymentOption(cardInfo));
      setCardInfo({ cardNumber: '', expirationDate: '', cvv: '' });
    } else {
      alert("Cette carte est déjà ajoutée.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Numéro de carte</Form.Label>
              <Form.Control
                type="text"
                name="cardNumber"
                value={cardInfo.cardNumber}
                onChange={handleChange}
                placeholder="Numéro de carte"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date d'expiration</Form.Label>
              <Form.Control
                type="text"
                name="expirationDate"
                value={cardInfo.expirationDate}
                onChange={handleChange}
                placeholder="MM/AA"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="text"
                name="cvv"
                value={cardInfo.cvv}
                onChange={handleChange}
                placeholder="CVV"
              />
            </Form.Group>

            <Button type="submit" className="w-100">
              Ajouter la carte
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentForm;
