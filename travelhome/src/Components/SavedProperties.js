import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../Services/Contexts/firebase/firebase";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { useNavigate } from "react-router-dom";





const SavedProperties = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    const [name, setName] = useState('');

    const [searches, setSearches] = useState([]);


    const handleSearch = (cityName, traveltime, travelmode, coords) => {
        axios.get("http://localhost:8080/geocodeSearch", {
            params: {
                cityName: cityName,
                traveltime: traveltime,
                travelmode: travelmode,
            },
        })
            .then((response) => {

                localStorage.setItem("selectedCityCoords", coords);
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



    const fetchSearches = async () => {

        await getDocs(collection(database, user.uid))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setSearches(newData);
            })
    }

    useEffect(() => {
        fetchSearches();
    }, [])


    useEffect(() => {
        if (user !== null) {
            setName(user.displayName);
        }
    }, [user]);

    return (
        <><div className="h-screen flex items-center justify-center">
            <div className="overflow-auto h-3/4 w-fit p-4 mt-auto mb-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Város</th>
                            <th>Perc</th>
                            <th>Közlekedési Eszköz</th>
                        </tr>
                    </thead>
                    {searches && searches.map((search, index) => (
                        <tbody>
                            <tr className="hover" key={index}>
                                <th>{index}</th>
                                <td>{<><strong>{search.cityName}</strong> <br /></>}</td>
                                <td>{<><strong>{Math.round(search.travelTime/60)}</strong> <br /></>}</td>
                                <td>{<><strong>{search.travelMode}</strong> <br /></>}</td>
                                <td><button className="btn bg-primary text-black w-fit" onClick={() => { handleSearch(search.cityName, search.travelTime, search.travelMode, search.coords); }}>Keresés</button></td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        </div><div>
                <div>

                    <h2>Szia {name}, itt láthatóak a mentett kereséseid:</h2>
                    <ul>
                        {searches.map((search, index) => (
                            <li key={index}>
                                <p>Város: {search.cityName}</p>
                                <p>Utazási idő: {search.travelTime}</p>
                                <p>Utazási mód: {search.travelMode}</p>
                                <Button onClick={() => { handleSearch(search.cityName, search.travelTime, search.travelMode, search.coords); }}>Keresés</Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div></>
    );
};

export default SavedProperties;
