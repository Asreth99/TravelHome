class Service{

    getCities(){

        return JSON.parse(localStorage.getItem('allCities'));
    }

    getFileteredPlaces(){
        return JSON.parse(localStorage.getItem('FilteredPlaces'));
    }

    
}

const service = new Service();

export default service;