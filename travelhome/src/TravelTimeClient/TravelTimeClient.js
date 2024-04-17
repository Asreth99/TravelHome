import { TravelTimeClient } from 'traveltime-api';
import {TimeMapRequestArrivalSearch} from 'traveltime-api';

const travelTimeClient = new TravelTimeClient({
  apiKey: 'd19b8d77323ab20b2e69c8dd0aa908cb',
  applicationId: 'adc44af1',
});



const arrival_search = {
    id: 'public transport to Trafalgar Square',
    arrival_time: new Date().toISOString(),
    travel_time: 900,
    coords: { lat: 51.507609, lng: -0.128315 },
    transportation: { type: 'driving' },
    range: { enabled: false },
  };
  

  travelTimeClient.timeMap({
    arrival_searches: [arrival_search],
  }).then((data) => console.log(data))
    .catch((e) => console.error(e));