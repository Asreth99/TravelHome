const { within } = require('@testing-library/react');
const express = require('express');
const router = express.Router();
const { TravelTimeClient, } = require('traveltime-api');
const { GeocodingSearchRequest } = require('traveltime-api/target/types');
const fetch = require('node-fetch');
const simplify = require('@turf/simplify').default;

const travelTimeClient = new TravelTimeClient({
    apiKey: 'd19b8d77323ab20b2e69c8dd0aa908cb',
    applicationId: 'adc44af1',

});



let responseCities = [];


router.get("/autoCompleteSearch", async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const cityName = req.query.cityName;
        const geocodeSearch = await travelTimeClient.geocoding(cityName, { params: { "within.country": "HU" } });

        if (geocodeSearch.features.length > 0) {
            const city = geocodeSearch.features[0].properties.name;
            const cityCoordinates = geocodeSearch.features[0].geometry.coordinates.reverse();
            res.json({ city: city, cityCoordinates: cityCoordinates });
        } else {
            res.json({ city: null, cityCoordinates: null });
        }
    } catch (error) {
        res.json({ city: null, cityCoordinates: null });
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
        //level_of_detail: { scale_type: "coarse_grid", square_size: 600 },
    };





    //Isochrone timeMap search request
    const timeMapSearch = await travelTimeClient.timeMap({
        departure_searches: [departure_search1],
    });


    const shapes = timeMapSearch.results[0].shapes;
    const simplifiedShapes = shapes.map(shape => {
        const geojson = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [shape.shell.map(coord => [coord.lng, coord.lat])]
            },
            properties: {}
        };
        const options = { tolerance: 0.05 };
        //simplify(geojson, options)

        //return simplify(geojson, options);
        return geojson;
    });


    const extractCitiesPromises = simplifiedShapes.map(async i => {
        if (i.geometry.coordinates[0].length <= 50) {
            return await extractCities(i.geometry.coordinates[0]);
        } else {


            /* The maximum vertices of a polygon is 50. Can't Search with TOMTOM if the vertices greater than that, so i simplify enough to able to search */
            let tolerance = 0.01;
            while (i.geometry.coordinates[0].length > 50) {
                const options = { tolerance: tolerance };
                const simplifiedGeometry = simplify(i, options);
                i.geometry.coordinates[0] = simplifiedGeometry.geometry.coordinates[0];
                tolerance += 0.01;
            }

            return await extractCities(i.geometry.coordinates[0]);
        }

    });







    Promise.all(extractCitiesPromises)
        .then(async () => {

            const arrival_searches = responseCities.map(city => {
                return {
                    id: city.city,
                    coords: { lat: city.coordinate.lat, lng: city.coordinate.lon }
                };
            });

            if (responseCities.length !== 0) {

                
                arrival_searches.unshift({
                    id: cityName,
                    coords: { lat: coordinates[1], lng: coordinates[0] }
                });

                let arrival_location_ids = [];

                arrival_searches.forEach(i => {
                    arrival_location_ids.push(i.id);
                });
                //console.log(arrival_searches.forEach(i=>{console.log(i.id)}));

                const departure_search = {
                    id: 'forward search example',
                    departure_location_id: cityName,
                    arrival_location_ids: arrival_location_ids,
                    transportation: {
                        type: travelmode
                    },
                    departure_time: new Date().toISOString(),
                    travel_time: 1800,
                    properties: ['travel_time'],
                    range: { enabled: true, max_results: 3, width: 600 },
                };



               

                const distanceMatrix = await travelTimeClient.timeFilter({
                    locations: arrival_searches,
                    departure_searches: [departure_search]

                });

            

                distanceMatrix.results[0].locations.forEach(location => {
                    const cityIndex = responseCities.findIndex(city => city.city === location.id);

                    if (cityIndex !== -1) {
                        responseCities[cityIndex].travel_time = location.properties[0].travel_time;
                    }
                });

            }

            res.json({ allCities: responseCities, isochrone: timeMapSearch });
            responseCities = [];
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred' });
        });
});


const extractCities = async (polygon) => {
    const coordinatesString = polygon.map(coord => `${coord[1]},${coord[0]}`);

    const baseURL = 'https://api.tomtom.com/search/2/geometrySearch/{}.json';
    const apiKey = 'djiCiL5L6GxVj3Kqt0XRDqwuUJovG6NL';
    const idxSet = 'Geo';
    const geometryList = JSON.stringify([
        {
            "type": "POLYGON",
            "vertices": coordinatesString,
        },
    ]);


    const url = `${baseURL}?key=${apiKey}&geometryList=${geometryList}&idxSet=${idxSet}&limit=${100}&entityTypeSet=Municipality,MunicipalitySubdivision,MunicipalitySecondarySubdivision`;



    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                const addresses = data.results.map(result => {
                    responseCities.push({
                        city: result.address.freeformAddress,
                        coordinate: result.position
                    });
                });
                return addresses;
            } else {
                console.log("No results found.");
                return [];
            }
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });



};



module.exports = router;