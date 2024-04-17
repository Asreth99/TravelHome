import service from "../Services/service";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Cities = () => {
  const [cities, setCities] = useState(null);

  useEffect(() => {
    const storedCities = service.getCities();
    if (storedCities) {
      setCities(storedCities.allCities);
    }
  }, []);

  const getIngatlanComURL = (city, town, district) => {
    const baseURL = "https://ingatlan.com/lista/kiado+lakas+";
    let formatDistrict = "";
  
    district.forEach(districtItem => {
      if (districtItem && districtItem !== null) {
        let formattedDistrict = districtItem
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/\./g, "");
        
  
        
        if (city.toLowerCase() === "budapest") {
          formattedDistrict = formattedDistrict.replace("kerulet", "ker");
          formatDistrict += formattedDistrict + "+";
        } else {
          const formatCity = city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          formatDistrict += formatCity + "-" + formattedDistrict + "+";
        }
      }
    });
  
    console.log("URL: " + baseURL + formatDistrict);
    window.open(baseURL + formatDistrict, '_blank');
  }

  return (
    <>
      <h1>Minden Elérhető Város:</h1>

      <Row style={{ padding: '1rem', alignItems: 'center', justifyContent: 'center' }}>
        {cities && cities.map((city, index) => (
          <Col key={index} md={4}>
            <Card style={{ margin: '2rem', width: '18rem'}} className="shadow-sm p-3 mb-5 bg-white rounded">
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
                <Button variant="primary" onClick={()=>{getIngatlanComURL(city.city, city.towns, city.districts)}}>Ingatlanok Megtekintése</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Cities;
