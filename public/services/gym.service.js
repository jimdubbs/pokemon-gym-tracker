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
            getGyms: getGyms,
            heartbeat: heartbeat,
            getPokemon: getPokemon
            
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

        function getGymData(gym){
            return $http.post(urlService.apiUrl+'api/getGymDetails', {
                gym:gym
            })
            .then(function (response) {

                var data = response.data;
                return data;
            });
        }
        
        function heartbeat(lat,long){
            return $http.post(urlService.apiUrl+'api/heartbeat', {
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
