import { useState,useEffect} from "react";
import React from "react";
import Drawer from "react-bottom-drawer";
import CitySearch from "./CitySearch";


const BottomSearhMenu = ({ isVisible, onClose, city, travelTime, travelMode, cityCoordinates, setError, setErrorMessage }) => {
    const [cityName, setCityName] = useState('');
    const [cityCoords, setCityCoords] = useState();
    const [traveltime, settraveltime] = useState('');
    const [travelmode, settravelmode] = useState('');


  useEffect(() => {
    setCityName(city || '');
    settraveltime(travelTime || '');
    settravelmode(travelMode || '');
    setCityCoords(cityCoordinates || '');

  }, [city, travelTime, travelMode]);

  

    return (
        <Drawer
            isVisible={isVisible}
            onClose={onClose}
            className="!bg-neutral"
        >
            {/* Add your drawer content here */}
            <div className="overflow-auto h-3/4 w-fit p-4 mt-auto mb-auto">

                <CitySearch city={cityName} cityCoordinates={cityCoords} travelTime={traveltime} travelMode={travelmode} setError={setError} setErrorMessage={setErrorMessage}></CitySearch>


            </div>
        </Drawer>
    );
};

export default BottomSearhMenu;
