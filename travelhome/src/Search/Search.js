import axios from "axios";
import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Autocomplete from 'react-autocomplete'


const Search = () => {
  const [cityName, setCityName] = useState('evosoft, 5, Horváth Mihály utca, Belváros, Szeged, Szegedi járás, Csongrád-Csanád, South Great Plain, Great Plain and North, 6720, Hungary');
  const [cityCoords, setCityCoords] = useState([46.2552141, 20.1513543]);
  const [traveltime, settraveltime] = useState(600);
  const [travelmode, settravelmode] = useState('driving');
  const [suggestions, setSuggestions] = useState([]);


  const navigate = useNavigate();
  localStorage.removeItem('allCities');



  const handleTraveltime = (e) => {
    settraveltime(e.target.value)
  }

  const handleTravelmode = (e) => {
    settravelmode(e.target.value);
  }

  const fetchSuggestions = async (inputValue) => {
    try {
      await axios.get("http://localhost:8080/autoCompleteSearch", {
        params: {
          cityName: inputValue,
        },
      }).then((response) => {
        const cities = response.data.city;
        const cityCoords = response.data.cityCoordinates
        if (cities && cities.length > 0) {
          setSuggestions([cities]);
          setCityCoords([cityCoords]);

        } else {

          setSuggestions([]);
        }

      });

    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };



  const handleSearch = () => {
    axios.get("http://localhost:8080/geocodeSearch", {
      params: {
        cityName: cityName,
        traveltime: traveltime,
        travelmode: travelmode,
      },
    })
      .then((response) => {

        localStorage.setItem("selectedCityCoords",cityCoords);
        localStorage.setItem("cityName",cityName);
        localStorage.setItem("travelTime",traveltime);
        localStorage.setItem("travelMode",travelmode);

        localStorage.setItem("allCities", JSON.stringify(response.data.allCities));
        localStorage.setItem("isochrone", JSON.stringify(response.data.isochrone));

        navigate("/cities");
      }).catch((error) => {
        console.error("Error: " + error);
      });
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="bg-secondary">
        <Card.Header style={{ color: 'white', fontWeight: 'bold' }}>
          Keresés
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Autocomplete
                items={suggestions}
                getItemValue={(item) => item}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? '#bcf5bc' : 'white'
                    }}
                    key={item.id}
                  >
                    {item}
                  </div>
                )}
                value={cityName}
                onChange={(e) => {
                  setCityName(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                onSelect={(val) => {setCityName(val)}}
                inputProps={{
                  style: {
                    width: '300px',
                    height: '40px',
                    background: '#e4f3f7',
                    border: '2px outset lightgray'
                  },
                  placeholder: 'Város'
                }}
              />
            </Col>

            <Col>
              <Form.Select value={traveltime} onChange={handleTraveltime}>
                <option value={300}>0h 5min</option>
                <option value={600}>0h 10min</option>
                <option value={900}>0h 15min</option>
                <option value={1200}>0h 20min</option>
                <option value={1500}>0h 25min</option>
                <option value={1800}>0h 30min</option>
                <option value={2100}>0h 35min</option>
                <option value={2400}>0h 40min</option>
                <option value={2700}>0h 45min</option>
                <option value={3000}>0h 50min</option>
                <option value={3300}>0h 55min</option>
                <option value={3600}>1h 0min</option>
                <option value={3900}>1h 5min</option>
              </Form.Select>
            </Col>

            <Col>
              <Form.Select aria-label="Default select example" value={travelmode} onChange={handleTravelmode}>
                <option value="">Ezzel a közlekedési eszközzel</option>
                <option value="cycling">Kerékpár</option>
                <option value="driving">Autó</option>
                <option value="public_transport">Tömegközlekedés</option>
                <option value="walking">Séta</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Button variant="warning" size="lg" onClick={() => {
                handleSearch();
              }}>Keresés</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Search;
