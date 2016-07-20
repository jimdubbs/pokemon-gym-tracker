(function () {
    'use strict';

    angular
        .module('main')
        .controller('MasterViewController', MasterViewController);

    MasterViewController.$inject = ['uiGmapGoogleMapApi'];
    function MasterViewController(uiGmapGoogleMapApi) {
        var vm = this;
        vm.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
        vm.map = {
            center: {
                latitude: 47.5605644,
                longitude: -52.7433038
            },
            zoom: 13
        };
        vm.map.markers = [];


        activate();

        ////////////////

        function activate() {
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