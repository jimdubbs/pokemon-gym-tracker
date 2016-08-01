(function() {
    'use strict';

    angular
        .module('main')
        .factory('GymService', GymService);

    GymService.$inject = ['$http','urlService'];

    function GymService($http, urlService) {
        
        urlService.getUrls();
        var service = {
            loading: false,
            gyms: [],
            getGymData: getGymData,
            updateGymData: updateGymData,
            getGyms: getGyms,
            heartbeat: heartbeat,
            getPokemon: getPokemon,
            selectedGym: {}
            
        };

        return service;

        function getGyms(){
            console.log('trying to get gyms');
            return $http.get(urlService.apiUrl+'api/getGyms', {
                params: {}
            })
            .then(function (response) {
                var gyms = response.data;
                service.gyms = gyms;
                return gyms;
            });
        }

        function updateGymData(data){
            
            var gymKeys = Object.keys(service.gyms);

            gymKeys.forEach(function(gym){
                
                if (service.gyms[gym].gym_state.fort_data.id == data.gym_state.fort_data.id){
                    console.log(service.gyms[gym]);
                    service.gyms[gym].gym_state = data.gym_state;
                    service.gyms[gym].lastUpdate = data.lastUpdate;
                }
            })
            // service.gyms.forEach(function(gym){
            //     console.log(gym);
            // })
        }

        function getGymData(gym){
            return $http.post(urlService.apiUrl+'api/updateGymDetails', {
                gym:gym
            })
            .then(function (response) {

                var data = response.data;
                return data;
            });
        }
        
        function heartbeat(lat,long){
            return $http.post(urlService.apiUrl+'api/pokeHeartbeat', {
                lat:lat, long: long
            })
            .then(function (response) {

                var data = response.data;
                console.log(data);
                return data;
            });
        }
        
        function getPokemon(id){
            return$http.get(urlService.apiUrl+'api/getPokemon/' + id, {
            })
            .then(function (response) {
                var pokemon = response.data;
                console.log(pokemon);
                return pokemon;
            });
        }
     
    }
})();
