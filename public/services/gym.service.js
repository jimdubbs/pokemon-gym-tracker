(function() {
    'use strict';

    angular
        .module('main')
        .factory('GymService', GymService);

    GymService.$inject = ['$http'];

    function GymService($http) {
        var service = {
            loading: false,
            gyms: [],
            getGymData: getGymData,
            getGyms: getGyms
            
        };

        return service;

        function getGyms(){
            console.log('trying to get gyms');
            return $http.get('http://172.16.30.187:8090/api/getGyms', {
                params: {}
            })
            .then(function (response) {
                var gyms = response.data;
                service.gyms = gyms;
                return gyms;
            });
        }

        function getGymData(gym){
            return $http.post('http://172.16.30.187:8090/api/getGymDetails', {
                gym:gym
            })
            .then(function (response) {

                var data = response.data;
                return data;
            });
        }
     
    }
})();
