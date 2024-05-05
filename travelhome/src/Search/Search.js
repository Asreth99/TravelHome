import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from 'react-autocomplete';


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

        localStorage.setItem("selectedCityCoords", cityCoords);
        localStorage.setItem("cityName", cityName);
        localStorage.setItem("travelTime", traveltime);
        localStorage.setItem("travelMode", travelmode);

        localStorage.setItem("allCities", JSON.stringify(response.data.allCities));
        localStorage.setItem("isochrone", JSON.stringify(response.data.isochrone));

        navigate("/cities");
      }).catch((error) => {
        console.error("Error: " + error);
      });
  }

  return (
    <>

        <div className="text-center mt-20 mb-6">
          <h1 className="text-5xl font-bold">Elérhető Ingatlanok Keresése!</h1>
          <p className="py-6">Adj meg egy helyet, hogy lásd adott időn belül, adott eszközzel hová tudsz eljutni.
            <br /> Majd tekintsd meg az ingatlanokat a kereséseddel.
            </p>
        </div>
        <div className="divider mb-10"></div>
        <div className="flex items-center justify-center">
          <div className="card bg-secondary text-primary-content shadow-xl">
            <div className="card-body">
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
                    className: 'input bg-white input-bordered text-black border-black',
                    placeholder: 'Város'
                  }}
                />

                <select className="select bg-white w-full max-w-xs mx-10 text-black border-black	" value={traveltime} onChange={handleTraveltime}>
                  <option disabled selected>Utazás Ideje</option>
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

                <select className="select  bg-white select-bordered w-full max-w-xs text-black border-black" value={travelmode} onChange={handleTravelmode}>
                  <option value="">Ezzel a közlekedési eszközzel</option>
                  <option value="cycling">Kerékpár</option>
                  <option value="driving">Autó</option>
                  <option value="public_transport">Tömegközlekedés</option>
                  <option value="walking">Séta</option>
                </select>
              </div>

              <div className="card-actions justify-center mt-5">
                <button className="btn bg-primary text-black w-60" onClick={() => {
                  handleSearch();
                }}>Keresés</button>
              </div>
            </div>
          </div>
        </div>
    </>

  );
}

export default Search;
