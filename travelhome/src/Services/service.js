class Service{

    getCities(){

        return JSON.parse(localStorage.getItem('allCities'));
    }

    
}

const service = new Service();

export default service;