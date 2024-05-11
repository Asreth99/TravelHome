import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { database } from "../Services/Contexts/firebase/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Services/Contexts/authContext/index.js"

import { TrashIcon } from '@heroicons/react/24/solid';

import { Navigate } from 'react-router-dom'



const SavedProperties = () => {

    const { userLoggedIn } = useAuth();

    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    const [name, setName] = useState('');

    const [searches, setSearches] = useState([]);


    const handleDelete = async (searchId) => {
        try {
            await deleteDoc(doc(database, user.uid, searchId));
            console.log("Document successfully deleted!");
            fetchSearches(); // Frissítsd az oldalt a törlés után
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    };

    const handleSearch = (cityName, traveltime, travelmode, coords) => {
        axios.get("https://travelhome.onrender.com/geocodeSearch", {
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

        if (userLoggedIn) {
            await getDocs(collection(database, user.uid))
                .then((querySnapshot) => {
                    const newData = querySnapshot.docs
                        .map((doc) => ({ ...doc.data(), id: doc.id }));
                    setSearches(newData);
                });
        }

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

        <>
            {!userLoggedIn && (<Navigate to={'/'} replace={true} />)}
            <div className="h-screen flex items-center justify-center">

                <div className="overflow-auto h-3/4 w-fit p-4 mt-auto mb-auto">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Mentett Keresések!</h1>
                        <p className="py-6">Itt láthatod a korábban elmentett kereséseid.</p>
                    </div>
                    <div className="divider"></div>
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
                                    <td data-label="Város:">{<><strong>{search.cityName}</strong> <br /></>}</td>
                                    <td data-label="Perc:">{<><strong>{Math.round(search.travelTime / 60)}</strong> <br /></>}</td>
                                    <td data-label="Közlekedési Eszköz:">{<><strong>{search.travelMode}</strong> <br /></>}</td>
                                    <td><button className="btn bg-primary text-black w-fit" onClick={() => { handleSearch(search.cityName, search.travelTime, search.travelMode, search.coords); }}>Keresés</button></td>
                                    <td><button className="btn w-fit" onClick={()=>{handleDelete(search.id)}}><TrashIcon className="h-6 w-6 text-red-600" /></button></td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>

            </div></>
    );
};

export default SavedProperties;
