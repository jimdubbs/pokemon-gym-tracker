(function () {
    'use strict';

    angular
        .module('main')
        .controller('MasterViewController', MasterViewController);

    MasterViewController.$inject = ['uiGmapGoogleMapApi', 'GymService'];
    function MasterViewController(uiGmapGoogleMapApi, gymService) {
        var vm = this;
        vm.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
        vm.gymService = gymService;
        vm.map = {
            center: {
                latitude: 47.5605644,
                longitude: -52.7433038
            },
            zoom: 13
        };
        vm.map.markers = [];
        vm.gyms = [];
        vm.idCounter = 1;

        activate();

        ////////////////


        function activate() {

            vm.gymService.getGymData()
                .then(function (response) {
                    response.forEach(function (gym) {
                        vm.idCounter++;
                        vm.map.markers.push({
                            id: vm.idCounter,
                            latitude: gym.coords.latitude,
                            longitude: gym.coords.longitude
                        })

                        vm.gyms.push(gym);
                    })
                });

            function showPosition(position) {
                vm.map.markers.push({
                    id: 1,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                vm.map.center = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
            }

            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }
})();