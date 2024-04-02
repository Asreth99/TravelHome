import { Container, Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";

const Search = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <Card className="bg-secondary">
            <Card.Header style={{color: 'white', fontWeight: 'bold' }}>
                Keresés
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroup.Text id="basic-addon1">Város</InputGroup.Text>
                    <Form.Control
                      placeholder="Város"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                </Col>
              
                <Col>
                  <Form.Select aria-label="Default select example">
                    <option>Ebben az időintervallumban</option>
                    <option value="1">0h 5min</option>
                    <option value="2">0h 10min</option>
                    <option value="4">0h 15min</option>
                    <option value="5">0h 20min</option>
                    <option value="6">0h 25min</option>
                    <option value="7">0h 30min</option>
                    <option value="8">0h 35min</option>
                    <option value="9">0h 40min</option>
                    <option value="10">0h 45min</option>
                    <option value="11">0h 50min</option>
                    <option value="12">0h 55min</option>
                    <option value="13">1h 0min</option>
                    <option value="14">1h 5min</option>
                  </Form.Select>
                </Col>
              
                <Col>
                  <Form.Select aria-label="Default select example">
                    <option>Ezzel a közlekedési eszközzel</option>
                    <option value="1">Kerékpár</option>
                    <option value="2">Autó</option>
                    <option value="3">Tömegközlekedés</option>
                    <option value="4">Séta</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                <Button variant="warning" size="lg">Keresés</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
    </Container>
  );
}

export default Search;
