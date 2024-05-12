import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from 'react-autocomplete';
import Alert from "../Components/AlertMessage";
import "../StyleSheet/Search.css"


const Search = () => {
  const [cityName, setCityName] = useState('');
  const [cityCoords, setCityCoords] = useState([]);
  const [traveltime, settraveltime] = useState();
  const [travelmode, settravelmode] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [buyOrRent, setBuyOrRent] = useState('kiado');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceLabel, setPriceLabel] = useState('ezer Ft/hó');
  const [propertyType, setPropertyType] = useState('lakas');

  const [showError, setShowError] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  localStorage.removeItem('allCities');


  useEffect(() => {

    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }, [showError]);


  const handleTraveltime = (e) => {
    settraveltime(e.target.value)
  }

  const handleTravelmode = (e) => {
    settravelmode(e.target.value);
  }

  const fetchSuggestions = async (inputValue) => {
    try {
      await axios.get("https://travelhome.onrender.com/autoCompleteSearch", {
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
    axios.get("https://travelhome.onrender.com/geocodeSearch", {
      params: {
        cityName: cityName,
        traveltime: traveltime,
        travelmode: travelmode,
      },
    })
      .then((response) => {
        if (response.data.error) {
          setShowError(true);
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

          navigate("/cities");
        }
      });
  }

  return (
    <>


      <div className="text-center mt-20 mb-6 ">
        {showError &&
          <Alert error={showError} message={ErrorMessage} />

        }

        <h1 className="text-5xl font-bold">Elérhető Ingatlanok Keresése!</h1>
        <p className="py-6">Adj meg egy helyet, hogy lásd adott időn belül, adott eszközzel hová tudsz eljutni.
          <br /> Majd tekintsd meg az ingatlanokat a kereséseddel.
        </p>
      </div>
      <div className="divider mb-10"></div>
      <div className="flex items-center justify-center ">
        <div className="card search-card bg-neutral-content text-primary-content shadow-xl">
          <div className="card-body search-card-body">
            <h2 className="card-title text-Black">Keresés</h2>
            <div className="divider divider-neutral"></div>
            <div className="flex-row search-flex-row flex items-center justify-center">


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
                  className: 'input bg-white input-bordered text-black border-black autocomplete-input',
                  placeholder: 'Város'
                }}
              />





              <select className="select bg-white w-full max-w-xs mx-5 text-black border-black	" value={traveltime} onChange={handleTraveltime}>
                <option disabled selected>Utazás Ideje</option>
                <option value={300}>5 perc</option>
                <option value={600}>10 perc</option>
                <option value={900}>15 perc</option>
                <option value={1200}>20 perc</option>
                <option value={1500}>25 perc</option>
                <option value={1800}>30 perc</option>
                <option value={2100}>35 perc</option>
                <option value={2400}>40 perc</option>
                <option value={2700}>45 perc</option>
                <option value={3000}>50 perc</option>
                <option value={3300}>55 perc</option>
                <option value={3600}>1 óra </option>
                <option value={3900}>1 óra 5 perc</option>
              </select>


              <select className="select  bg-white select-bordered w-full max-w-xs text-black border-black" value={travelmode} onChange={handleTravelmode}>
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
                <label className="label search-label cursor-pointer">
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio checked:bg-black-500 border-white size-5"
                    value="elado"
                    checked={buyOrRent === "elado"}
                    onChange={(e) => { 
                      setBuyOrRent(e.target.value);
                      setPriceLabel("millió Forint");
                    }}
                  />
                  <span className="label-text text-white ml-3"><strong>Eladó</strong></span>
                </label>

                <label className="label search-label cursor-pointer">
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio border-white size-5"
                    value="kiado"
                    checked={buyOrRent === "kiado"}

                    onChange={(e) => { 
                      setBuyOrRent(e.target.value);
                      setPriceLabel("ezer Ft/hó");

                     }}
                  />
                  <span className="label-text text-white ml-3"><strong>Kiadó</strong></span>
                </label>
              </div>
              <div className="flex items-center w-50 ml-4">
                <div className="form-control ">
                <input type="text" maxLength={4} pattern="[0-9]{4}" placeholder="Min" className="input search-input input-bordered bg-white w-20" onChange={(e) => { setMinPrice(e.target.value) }} />
                </div>


                <span className="label-text search-label-text text-black mx-5"><strong>-</strong></span>



                <div className="form-control">
                <input type="text" maxLength={4} pattern="[0-9]{4}" placeholder="Max" className="input search-input input-bordered bg-white w-20" onChange={(e) => { setMaxPrice(e.target.value) }} />
                </div>
                <span className="label label-text search-label-text text-black"><strong>{priceLabel}</strong></span>
              </div>

              <select className="select bg-white mx-5 max-w-xs text-black border-black" value={propertyType} onChange={(e) => { setPropertyType(e.target.value) }}>
                <option value={"lakas"}>Lakás</option>
                <option value={"haz"}>Ház</option>
                <option value={"telek"}>Telek</option>
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
