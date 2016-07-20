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
            getGymData: getGymData
            
        };

        return service;

        function getGymData(){
            console.log('trying to get gyms');
            return $http.get('http://localhost:8090/api/getGymDetails', {
                params: {}
            })
            .then(function (response) {
                console.log(response);
                var gyms = response.data;
                service.gyms = gyms;
                return gyms;
            });
        }
     
    }
})();
