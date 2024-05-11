import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from 'react-autocomplete';
import Alert from "../Components/AlertMessage";
import "../StyleSheet/CitySearch.css";

import { database } from "../Services/Contexts/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../Services/Contexts/authContext/index.js";

const CitySearch = ({ city, travelTime, travelMode, cityCoordinates, setError, setErrorMessage, setFdbck, setFeedbackMsg  }) => {
  const [cityName, setCityName] = useState('');
  const [cityCoords, setCityCoords] = useState();
  const [traveltime, settraveltime] = useState('');
  const [travelmode, settravelmode] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [buyOrRent, setBuyOrRent] = useState('kiado');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('lakas');

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  localStorage.removeItem('allCities');

  const saveSearch = async (cityName, travelTime, travelMode) => {
    try {

      const userID = currentUser.uid
      const docRef = await addDoc(collection(database, userID), {
        cityName: cityName,
        coords: cityCoords,
        travelTime: travelTime,
        travelMode: travelMode
      }).then(()=>{
        setFdbck(true);
        setFeedbackMsg("Sikeres Mentés!")
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  };


  useEffect(() => {
    setCityName(city || '');
    settraveltime(travelTime || '');
    settravelmode(travelMode || '');
    setCityCoords(cityCoordinates || '');

  }, [city, travelTime, travelMode]);

  useEffect(() => {
    const buyOrRent = localStorage.getItem('buyOrRent');
    const minPrice = localStorage.getItem('minPrice');
    const maxPrice = localStorage.getItem('maxPrice');
    const propertyType = localStorage.getItem('propertyType');


    if (minPrice) {
      setMinPrice(minPrice);
    }

    if (maxPrice) {
      setMaxPrice(maxPrice);
    }
    if (buyOrRent && propertyType) {
      setBuyOrRent(buyOrRent);
      setPropertyType(propertyType);

    }

  }, []);

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
    console.log("cityname: " + cityName + " travelTime: " + traveltime + " travelmode: " + travelmode);
    axios.get("http://localhost:8080/geocodeSearch", {
      params: {
        cityName: cityName,
        traveltime: traveltime,
        travelmode: travelmode,
      },
    })
      .then((response) => {
        if (response.data.error) {
          setError(true);
          setErrorMessage("Minden mezőt ki kell tölteni!");
        } else {


          localStorage.setItem("selectedCityCoords", cityCoords);
          localStorage.setItem("cityName", cityName);
          localStorage.setItem("travelTime", traveltime);
          localStorage.setItem("travelMode", travelmode);

          localStorage.setItem("buyOrRent", buyOrRent);
          localStorage.setItem("minPrice", minPrice);
          localStorage.setItem("maxPrice", maxPrice);
          localStorage.setItem("propertyType", propertyType);

          localStorage.setItem("allCities2", JSON.stringify(response.data.allCities));
          localStorage.setItem("isochrone", JSON.stringify(response.data.isochrone));

          window.location.reload();
        }
      });
  }

  return (
    <>



      <div className="flex citySearch-flex items-center justify-center mt-20 ml-5">

        <div className="card citySearch-card text-primary-content border">
          <div className="card-body citySearch-card-body">
            <h2 className="card-title text-white">Keresés</h2>
            <div className="divider divider-neutral mt-auto"></div>
            <div className="flex flex-grow-1">
              <Autocomplete
                items={suggestions}
                getItemValue={(item) => item}
                renderItem={(item, isHighlighted) => (
                  <div
                    className={`p-2 ${isHighlighted ? 'bg-gray-400 text-black' : 'bg-white text-black'}`}
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
                onSelect={(val) => { setCityName(val); }}
                inputProps={{
                  className: 'input bg-white input-bordered text-black border-black autocomplete',
                  placeholder: 'Város'
                }}
              />

              <select className="select bg-white w-full max-w-xs mx-10 text-black border-black" value={traveltime} onChange={(e) => { settraveltime(e.target.value) }}
              > <option disabled selected>Utazás Ideje</option>
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
              </select>

              <select className="select  bg-white select-bordered w-full max-w-xs text-black border-black" value={travelmode} onChange={(e) => { settravelmode(e.target.value) }}>
                <option value="">Ezzel a közlekedési eszközzel</option>
                <option value="cycling">Kerékpár</option>
                <option value="driving">Autó</option>
                <option value="public_transport">Tömegközlekedés</option>
                <option value="walking">Séta</option>
              </select>


            </div>
            <div className="divider divider-neutral"></div>

            <div className="flex flex-grow-1 flex items-center justify-center">
              <div className="flex-col search-flex-col mr-3 flex items-center justify-center">
                <label className="label citySearch-label cursor-pointer">
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio checked:bg-black-500 border-white size-5"
                    value="elado"
                    checked={buyOrRent === "elado"}
                    onChange={(e) => { setBuyOrRent(e.target.value) }}
                  />
                  <span className="label-text text-white ml-3"><strong>Eladó</strong></span>
                </label>

                <label className="label citySearch-label cursor-pointer">
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio border-white size-5"
                    value="kiado"
                    checked={buyOrRent === "kiado"}
                    onChange={(e) => { setBuyOrRent(e.target.value) }}
                  />
                  <span className="label-text text-white ml-3"><strong>Kiadó</strong></span>
                </label>
              </div>
              <div className="flex items-center w-50 h-max">
                <div className="form-control flex items-center">
                  <input type="text" maxLength={4} pattern="[0-9]{4}" placeholder="Min" className="input search-input input-bordered bg-white w-20" value={minPrice} onChange={(e) => { setMinPrice(e.target.value) }} />
                </div>

                <div className="mx-5 flex items-center">
                  <span className="label-text citySearch-label text-white"><strong>-</strong></span>
                </div>

                <div className="form-control flex items-center">
                  <input type="text" maxLength={4} pattern="[0-9]{4}" placeholder="Max" className="input search-input input-bordered bg-white w-20" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value) }} />
                </div>
              </div>




              <select className="select bg-white mx-5 max-w-xs text-black border-black" value={propertyType} onChange={(e) => { setPropertyType(e.target.value) }}>
                <option value={"lakas"}>Lakás</option>
                <option value={"haz"}>Ház</option>
                <option value={"telek"}>Telek</option>
              </select>
            </div>
            <div className="flex items-center justify-center mt-5">
              <button className="btn citySearch-btn bg-primary text-black w-60" onClick={() => { handleSearch(); }}>Keresés</button>
              {currentUser &&
                <div className="flex ml-4">
                  <button className="btn" onClick={() => { saveSearch(cityName, traveltime, travelmode) }}>
                    Mentés
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                </div>
              }

            </div>
          </div>
        </div>
      </div>

    </>

  );
}

export default CitySearch;
