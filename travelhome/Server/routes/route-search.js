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
        res.setHeader("Access-Control-Allow-Origin", "*")
        const cityName = req.query.cityName;
        const geocodeSearch = await travelTimeClient.geocoding(cityName,{params: {"within.country":"HU"}});

        if (geocodeSearch.features.length > 0) {
            const city = geocodeSearch.features[0].properties.name;
            res.json({ city: city });
        } else {
            res.json({ city: null });
        }
    } catch (error) {
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
        no_holes: true,


    };


    //timeMap search request
    const result = await travelTimeClient.timeMap({
        departure_searches: [departure_search1],
    })

    const allCity = await extractCities(result);


    console.log(allCity.length);
    res.json({ allCities: allCity });
});


const extractCities = async (result) => {
    const allCoordinates = [];
    const cities = [];

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

                const placeData = reverseGeocodeRes.features[0].properties;
                const city = placeData.city;
                const town = placeData.town;
                const district = placeData.district;


                if (city && city !== 'undefined') {
                    const existingCityIndex = cities.findIndex(item => item.city === city);

                    if (existingCityIndex === -1) {
                        cities.push({
                            city,
                            towns: [town],
                            districts: [district],
                        });
                    } else {
                        if (!cities[existingCityIndex].towns.includes(town)) {
                            cities[existingCityIndex].towns.push(town);
                        }

                        if (!cities[existingCityIndex].districts.includes(district)) {
                            cities[existingCityIndex].districts.push(district);
                        }
                    }
                }

                if (town && town !== 'undefined') {

                    const existingTownIndex = cities.findIndex(item => item.towns.includes(town));

                    if (existingTownIndex === -1) {
                        cities.push({
                            towns: [town],
                            districts: [district],
                        });
                    } else {
                        if (!cities[existingTownIndex].districts.includes(district)) {
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




    return cities;
};


module.exports = router;