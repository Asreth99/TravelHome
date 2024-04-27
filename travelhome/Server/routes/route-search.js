const { within } = require('@testing-library/react');
const express = require('express');
const router = express.Router();
const { TravelTimeClient, } = require('traveltime-api');
const { GeocodingSearchRequest } = require('traveltime-api/target/types');

const travelTimeClient = new TravelTimeClient({
    apiKey: 'd19b8d77323ab20b2e69c8dd0aa908cb',
    applicationId: 'adc44af1',

});




router.get("/citySearch", async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const cityName = req.query.cityName;
        const geocodeSearch = await travelTimeClient.geocoding(cityName, { params: { "within.country": "HU" } });

        if (geocodeSearch.features.length > 0) {
            const city = geocodeSearch.features[0].properties.name;
            console.log(city);
            res.json({ city: city });
        } else {
            res.json({ city: null });
        }
    } catch (error) {
        console.error(error);
        res.json({ city: null });
    }


});



router.get("/geocodeSearch", async (req, res) => {
    const cityName = req.query.cityName;
    const traveltime = req.query.traveltime;
    const travelmode = req.query.travelmode;


    res.setHeader("Access-Control-Allow-Origin", "*")

    //Getting the city coordinates

    const geocodeSearch = await travelTimeClient.geocoding(cityName);
    const coordinates = geocodeSearch.features[0].geometry.coordinates;



    //Setting up the attributes for the timeMap search
    const departure_search1 = {
        id: 'isocrhone',
        departure_time: new Date().toISOString(),
        travel_time: parseInt(traveltime),
        coords: { lat: coordinates[1], lng: coordinates[0] },
        transportation: { type: travelmode, disable_border_crossing: true },
        level_of_detail: { scale_type: "simple", level: "medium" },
        no_holes: true,
    };


    //Isochrone timeMap search request
    const timeMapSearch = await travelTimeClient.timeMap({
        departure_searches: [departure_search1],
    });





    const allCity = await extractCities(timeMapSearch);


    const result = await fetchCities(allCity);

    /* 
        allCity.forEach(i=>{
            console.log(i);
        }) */



    res.json({ allCities: allCity, FilteredPlaces: result });
});




const extractCities = async (result) => {
    const allCoordinates = [];
    let cities = [];
    let markers = [];

    if (!result || !result.results || !Array.isArray(result.results)) {
        console.error("Invalid result format");
        return allCoordinates;
    }

    result.results.forEach(resultItem => {
        if (resultItem.shapes && Array.isArray(resultItem.shapes)) {

            resultItem.shapes.forEach(shape => {
                if (shape.shell && Array.isArray(shape.shell)) {
                    allCoordinates.push(...shape.shell);

                }


            });
        }
    });


    if (allCoordinates.length > 0) {
        const reverseGeocodePromises = allCoordinates.map(async coords => {
            try {
                const reverseGeocodeRes = await travelTimeClient.geocodingReverse({
                    lat: coords.lat,
                    lng: coords.lng,
                }, acceptLanguage = "HU");

                const coordinates = reverseGeocodeRes.features[0].geometry.coordinates;
                const placeData = reverseGeocodeRes.features[0].properties;
                const local_admin = placeData.local_admin;
                const name = placeData.name;
                const city = placeData.city;
                const town = placeData.town;
                const district = placeData.district
                const type = placeData.type;
                const country_code = placeData.country_code;
                const street = placeData.street;


                if(street && street.includes('utca')){
                    console.log(placeData);
                }

                

               /*  if (type === 'residential' || type === 'square') {
                    if (country_code === 'HUN') {
                        if (!markers.includes(name)) {
                            markers.push({
                                name: name,
                                coords: coordinates,
                            });
                        }

                    }


                } */



                if (city && city !== undefined) {
                    const existingCityIndex = cities.findIndex(item => item.city === city);

                    if (existingCityIndex === -1) {
                        cities.push({
                            local_admin: local_admin ? local_admin : "",
                            city,
                            towns: town ? [town] : [],
                            districts: district ? [district] : [],
                        });
                    } else {
                        if (!cities[existingCityIndex].towns.includes(town) && town !== undefined) {
                            cities[existingCityIndex].towns.push(town);
                        }

                        if (!cities[existingCityIndex].districts.includes(district) && district !== undefined) {
                            cities[existingCityIndex].districts.push(district);
                        }
                    }
                }

                if (town && town !== undefined && district !== undefined) {
                    const existingTownIndex = cities.findIndex(item => item.towns.includes(town));

                    if (existingTownIndex === -1) {
                        cities.push({
                            local_admin: local_admin ? local_admin : "",
                            towns: [town],
                            districts: district ? [district] : [],
                        });

                    } else {
                        if (!cities[existingTownIndex].districts.includes(district) && district !== undefined) {
                            cities[existingTownIndex].districts.push(district);

                        }
                    }
                }

            } catch (error) {
                console.error(error);
            }
        });



        await Promise.all(reverseGeocodePromises);
    }

    /* markers.map(coord => {

        const reversedCoord = coord.coords.reverse();
        return { coords: reversedCoord, name: coord.name };
    }); */


    return cities;
};



const fetchCities = async (coords) => {
    const city_coords = [];



    if (!coords || !Array.isArray(coords)) {
        console.error("Error fetching Cities");
        return city_coords;
    }

    const FilterCoordinates = coords.map(async (city) => {
        if (city.city) {
            const geocodeSearch = await travelTimeClient.geocoding(city.city, { params: { "within.country": "HU" } });
            if (geocodeSearch.features.length > 0) {
                city_coords.push({ coords: geocodeSearch.features[0].geometry.coordinates, name: geocodeSearch.features[0].properties.name });
            }

        }

        if (city.towns) {
            const filterTown = city.towns.map(async (town) => {
                const geocodeSearch = await travelTimeClient.geocoding(town, { params: { "within.country": "HU" } });
                if (geocodeSearch.features.length > 0) {
                    city_coords.push({ coords: geocodeSearch.features[0].geometry.coordinates, name: geocodeSearch.features[0].properties.name });
                }
            });

            await Promise.all(filterTown);

        }

        if (city.districts) {
            const filterDistrict = city.districts.map(async (district) => {
                const name = district + " " + city.local_admin;
                const geocodeSearch = await travelTimeClient.geocoding(name, { params: { "within.country": "HU" } });
                if (geocodeSearch.features.length > 0) {
                    city_coords.push({ coords: geocodeSearch.features[0].geometry.coordinates, name: geocodeSearch.features[0].properties.name });
                }
            });
            await Promise.all(filterDistrict);

        }

    });

    await Promise.all(FilterCoordinates);


    const reversedCoords = city_coords.map(coord => {
        const reversedCoord = coord.coords.reverse();
        return { coords: reversedCoord, name: coord.name };
    });


    return reversedCoords;

};



module.exports = router;