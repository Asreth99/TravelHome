import { useState, useEffect } from "react";
import React from "react";
import Drawer from "react-bottom-drawer";

const BottomMenu = ({ isVisible, onClose, cities }) => {

    const [buyOrRent, setBuyOrRent] = useState('kiado');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [propertyType, setPropertyType] = useState('lakas');

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
                return parts.join('-');
            });
            formattedCity = `${formattedCity[1]}-${formattedCity[0]}`;
        }

        let priceSegment = '';
        if (minPrice || maxPrice) {
            if (buyOrRent === 'kiado') {
                priceSegment = minPrice && maxPrice ? `havi-${minPrice}-${maxPrice}-ezer-Ft` : minPrice ? `havi-${minPrice}-ezer-Ft-tol` : `havi-${maxPrice}-ezer-Ft-ig`;
            }

            if (buyOrRent == 'elado') {
                priceSegment = minPrice && maxPrice ? `${minPrice}-${maxPrice}-mFt` : minPrice ? `${minPrice}-mFt-tol` : `${maxPrice}-mFt-ig`;
            }

        }

        const ingatlanURL = `https://ingatlan.com/lista/${buyOrRent}+${propertyType}+${formattedCity}${priceSegment ? '+' + priceSegment : ''}`;


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

        let priceSegment = '';
        if(buyOrRent == "kiado"){
            if (minPrice && maxPrice) {
                priceSegment = `ar-${Math.floor(minPrice * 1000)}-${Math.floor(maxPrice * 1000)}`;
            } else if (minPrice) {
                priceSegment = `ar-${Math.floor(minPrice * 1000)}-`;
            } else if (maxPrice) {
                priceSegment = `ar--${Math.floor(maxPrice * 1000)}`;
            }
        }

        if(buyOrRent == "elado"){
            if (minPrice && maxPrice) {
                priceSegment = `ar-${Math.floor(minPrice * 10000)}-${Math.floor(maxPrice * 10000)}`;
            } else if (minPrice) {
                priceSegment = `ar-${Math.floor(minPrice * 10000)}-`;
            } else if (maxPrice) {
                priceSegment = `ar--${Math.floor(maxPrice * 10000)}`;
            }
        }
        

        const URL = `https://www.otpotthon.hu/${formattedCity}+${buyOrRent}+${propertyType}+${priceSegment}`;

        console.log(URL);
        //window.open(URL, '_blank');
    }
    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
    return (
        <Drawer
            isVisible={isVisible}
            onClose={onClose}
            className="!bg-neutral"
        >
            {/* Add your drawer content here */}
            <div className="overflow-auto h-3/4 w-fit p-4 mt-auto mb-auto">

                <table className="table">
                    {cities && cities.map((city, index) => (
                        <><tr className="hover" key={index}>
                            <td className="flex flex-row">
                                {city.city && <><strong>{city.city}</strong> <br /></>}
                            </td>
                            <td className="flex flex-row">
                                <button className="btn bg-primary text-black w-fit mr-3" onClick={() => { getIngatlanURL(city); }}>Ingatlan.com</button>
                                <button className="btn bg-primary text-black w-fit mr-3" onClick={() => { getOtpOtthonURL(city); }}>otpotthon.hu</button>
                                <span className="badge badge-secondary w-max m-auto"><strong>{Math.round(city.travel_time / 60)}  perc</strong></span>
                            </td>
                        </tr><div className="divider"></div></>
                    ))}
                </table>


            </div>
        </Drawer>
    );
};

export default BottomMenu;
