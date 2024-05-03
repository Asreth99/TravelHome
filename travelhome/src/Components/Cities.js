import service from "../Services/service";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MarkerClusterGroup from 'react-leaflet-cluster';

import "leaflet/dist/leaflet.css";
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'

const Cities = () => {
  const simplify = require('@turf/simplify').default;
  const [cities, setCities] = useState(null);
  const [selectedCityCoords, setSelectedCityCoords] = useState(null);
  const [timeMapSearch, setTimeMapSearch] = useState(null);

  //const [coords, setCoords] = useState(null);





  useEffect(() => {
    const timeMapSearchData = JSON.parse(localStorage.getItem('isochrone'));
    const selectedCity = localStorage.getItem("selectedCityCoords");
    const storedCities = service.getCities();

    if (timeMapSearchData) {
      const shapes = timeMapSearchData.results[0].shapes;
      const simplifiedShapes = shapes.map(shape => {
        const geojson = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [shape.shell.map(coord => [coord.lng, coord.lat])]
          },
          properties: {}
        };
        const options = { tolerance: 0.05, highQuality: false };
        //simplify(geojson, options)
        //return simplify(geojson, options);
        return geojson;
      });
      setTimeMapSearch(simplifiedShapes);
    }

    if (selectedCity) {
      const coords = selectedCity.split(',').map(parseFloat);
      setSelectedCityCoords(coords);
    }

    if (storedCities) {
      setCities(storedCities);
    }


  }, []);






  /* Marker Icons */
  const customIcon = new Icon({
    iconUrl: require('../Icon/location-pin.png'),
    iconSize: [50, 50],
    iconAnchor: [24, 47]
  });

  const centerIcon = new Icon({
    iconUrl: require('../Icon/searched_location_pin.png'),
    iconSize: [60, 60],
    iconAnchor: [30, 58]
  });


  const getIngatlanURL = (city) => {
    const cityNameWithoutAccents = removeAccents(city.city.toLowerCase());
    const formattedCityName = cityNameWithoutAccents.split(',');
    let formattedCity = formattedCityName;
    if(formattedCityName.length >= 2){
      formattedCity =`${formattedCityName[1].trim()}-${formattedCityName[0].trim()}`
    }
    const ingatlanURL =`https://ingatlan.com/lista/kiado+lakas+${formattedCity}`;
    console.log(ingatlanURL);
    window.open(ingatlanURL, '_blank');
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  //[47.5422594, 21.6070813]
  return (
    <>
      <h1>Minden Elérhető Város:</h1>

      {/* REACHABLE CITIES IN CARDS */}

      <Row>
        <Col>
          <div style={{ overflowY: 'auto', maxHeight: '80vh' }}>
            {cities && cities.map((city, index) => (
              <Card key={index} style={{ marginLeft: '5rem', marginRight: 'auto', marginBottom: '2rem', width: '18rem' }} className="shadow-sm p- bg-white rounded">
                <Card.Body>
                  <Card.Text>
                    {city.city && <><strong>Város:</strong> {city.city} <br /></>}
                    {city.towns && city.towns.length > 0 && <><strong>Kisváros:</strong> {city.towns.join(", ")} <br /></>}
                    {city.districts && city.districts.filter(Boolean).length > 0 && (
                      <>
                        <strong>Körzet:</strong> {city.districts.join(", ")} <br /><br />
                      </>
                    )}
                  </Card.Text>
                  <Button variant="primary" onClick={() => { getIngatlanURL(city); }}>Ingatlanok Megtekintése</Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>


        {/* SHOWING MAP BESIDE MARKERS */}
        <Col>
          <><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" /><div className="App">
              {selectedCityCoords && (
                <MapContainer center={selectedCityCoords} zoom={13} scrollWheelZoom={true}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* Cities markers */}

                  <Marker position={selectedCityCoords} icon={centerIcon}>
                    <Popup>This is Your Search</Popup>
                  </Marker>

                  <MarkerClusterGroup>
                    {cities && cities.map((city, index) => (
                      <Marker key={index} position={city.coordinate} icon={customIcon}>
                        <Popup>{city.city}</Popup>
                      </Marker>
                    ))}
                  </MarkerClusterGroup>

                  {/* Isochrone Polygon */}
                  {timeMapSearch && timeMapSearch.map((data, index) => (
                    <GeoJSON
                      key={index}
                      data={data}
                      style={() => ({
                        color: 'red',
                        fillColor: 'black',
                        fillOpacity: 0.1
                      })}
                    />
                  ))}

                </MapContainer>
              )}
            </div></>
        </Col>



      </Row>



    </>
  );
}

export default Cities;
