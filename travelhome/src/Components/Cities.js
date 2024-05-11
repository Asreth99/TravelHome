import React, { useEffect, useState } from "react";
import MarkerClusterGroup from 'react-leaflet-cluster';

import "leaflet/dist/leaflet.css";
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';


import { useAuth } from "../Services/Contexts/authContext/index.js";
import Alert from "../Components/AlertMessage";
import CitySearch from "./CitySearch.js";
import BottomMenu from "./BottomMenu.js";
import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';
import BottomSearhMenu from "./BottomSearchMenu.js";
import Toast from "./ToastMessage.js";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);


  }, [query]);

  return matches;
};

const Cities = () => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearhMenuVisible, setIsSearhMenuVisible] = useState(false);

  const [cities, setCities] = useState(null);
  const [selectedCityCoords, setSelectedCityCoords] = useState(null);
  const [timeMapSearch, setTimeMapSearch] = useState(null);

  const [searchedCityName, setSearchedCityName] = useState('');
  const [travelTime, settravelTime] = useState(null);
  const [travelMode, settravelMode] = useState('');


  const [showFeedback, setShowFeedback] = useState(false);
  const [FeedbackMessage, setFeedbackMessage] = useState('');

  
  const [showError, setShowError] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState('');



  const { currentUser } = useAuth();

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }, [showError]);



  useEffect(() => {
    const timeMapSearchData = JSON.parse(localStorage.getItem('isochrone'));
    const selectedCityCoords = localStorage.getItem("selectedCityCoords");
    const storedCities = JSON.parse(localStorage.getItem('allCities'));;
    const storedCities2 = JSON.parse(localStorage.getItem('allCities2'));;

    const cityName = localStorage.getItem("cityName");
    const travelTime = localStorage.getItem("travelTime");
    const travelMode = localStorage.getItem("travelMode");



    if (cityName && travelTime && travelMode) {
      setSearchedCityName(cityName);
      settravelTime(travelTime);
      settravelMode(travelMode);
    }

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

        return geojson;
      });
      setTimeMapSearch(simplifiedShapes);
    }

    if (selectedCityCoords) {
      const coords = selectedCityCoords.split(',').map(parseFloat);
      setSelectedCityCoords(coords);
    }

    if (storedCities2) {
      const sortedCities = storedCities2.sort((a, b) => a.travel_time - b.travel_time);
      setCities(sortedCities);

    }
    if (storedCities) {
      const sortedCities = storedCities.sort((a, b) => a.travel_time - b.travel_time);
      setCities(sortedCities);

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
    if (formattedCityName.length >= 2) {
      formattedCity = formattedCityName.map(namePart => {
        let parts = namePart.trim().split(/[\s-]+/);
        if (parts[1] === 'kertek') {
          parts = [parts[0] + parts[1], ...parts.slice(2)];
        }
        console.log(parts);
        return parts.join('-');
      });
      formattedCity = `${formattedCity[1]}-${formattedCity[0]}`;
    }
    const ingatlanURL = `https://ingatlan.com/lista/kiado+lakas+${formattedCity}`;
    window.open(ingatlanURL, '_blank');
  };

  const getOtpOtthonURL = (city) => {
    const cityNameWithoutAccents = removeAccents(city.city.toLowerCase());
    const formattedCityName = cityNameWithoutAccents.split(',');
    let formattedCity = formattedCityName;
    if (formattedCityName.length >= 2) {
      formattedCity = formattedCityName.map(namePart => {
        let parts = namePart.trim().split(/[\s-]+/);
        if (parts[1] === 'kertek') {
          parts = [parts[0] + parts[1], ...parts.slice(2)];
        }
        return parts.join('-');
      });
      formattedCity = `${formattedCity[1]}-${formattedCity[0]}`;
    }

    const URL = `https://www.otpotthon.hu/${formattedCity}+kiado+lakas`;

    window.open(URL, '_blank');
  }

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  if (showError) {
    console.log(showError);
  }


  /* if (minPrice) {
    console.log(minPrice);
  } */

  return (
    <>
      {showError &&
        <Alert error={showError} message={ErrorMessage} />
      }

      {showFeedback &&
        <Toast feedback={showFeedback} message={FeedbackMessage}/>
      }
      <div className="flex items-center justify-center h-screen z-0 ">

        <div className="h-screen flex flex-col items-center justify-center">
          {searchedCityName && !isMobile &&
            <CitySearch
              city={searchedCityName}
              travelTime={travelTime}
              travelMode={travelMode}
              cityCoordinates={selectedCityCoords}
              setFdbck={setShowFeedback}
              setFeedbackMsg={setFeedbackMessage}
              setError={setShowError}
              setErrorMessage={setErrorMessage}
            />
          }

          {!isMobile &&
            <div className="overflow-auto h-3/4 w-fit p-4 mt-auto mb-auto">
              <table className="table">
                {cities && cities.map((city, index) => (
                  <tr className="hover" key={index}>
                    <th>{index}</th>
                    <td>{city.city && <><strong>{city.city}</strong> <br /></>}</td>
                    <td><button className="btn bg-primary text-black w-fit" onClick={() => { getIngatlanURL(city); }}>Ingatlan.com</button></td>
                    <td><button className="btn bg-primary text-black w-fit" onClick={() => { getOtpOtthonURL(city); }}>otpotthon.hu</button></td>
                    <td className="flex w-fit mt-auto "><span className="badge badge-secondary w-24"><strong>{Math.round(city.travel_time / 60)}  perc</strong></span></td>
                  </tr>
                ))}
              </table>
            </div>
          }

        </div>
        {/* SHOWING MAP BESIDE MARKERS */}

        <div className="flex-1">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" />
          <div className="App">
            {selectedCityCoords && (
              <MapContainer center={selectedCityCoords} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Cities markers */}

                <Marker position={selectedCityCoords} icon={centerIcon}>
                  <Popup>{searchedCityName}</Popup>
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
                      color: 'black',
                      fillColor: 'black',
                      fillOpacity: 0.1
                    })} />
                ))}

              </MapContainer>
            )}
          </div>
        </div>
        {isMobile && cities &&

          <ul className="fixed bottom-1 menu menu-horizontal lg:menu-horizontal w-screen flex justify-center items-center rounded-box">
            <li><a onClick={() => setIsSearhMenuVisible(true)}><MagnifyingGlassCircleIcon className="h-6 w-6 text-white" /></a></li>
            <li><a onClick={() => setIsMenuVisible(true)}><ChevronDoubleUpIcon className="h-6 w-6 text-white" /></a></li>
          </ul>
        }
      </div>

      {isMobile && cities &&
        <>
          <BottomMenu cities={cities} isVisible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
          <BottomSearhMenu isVisible={isSearhMenuVisible} onClose={() => setIsSearhMenuVisible(false)} city={searchedCityName} travelTime={travelTime} travelMode={travelMode} cityCoordinates={selectedCityCoords} setError={setShowError} setErrorMessage={setErrorMessage} />
        </>
      }
    </>
  );

}

export default Cities;
