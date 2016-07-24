(function () {
    'use strict';

    angular
        .module('main')
        .controller('MasterViewController', MasterViewController);

    MasterViewController.$inject = ['uiGmapGoogleMapApi', 'GymService', '$interval'];
    function MasterViewController(uiGmapGoogleMapApi, gymService, $interval) {
        var vm = this;
        vm.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
        vm.gymService = gymService;
        vm.$interval = $interval;

        vm.map = {
            center: {
                latitude: 47.5605644,
                longitude: -52.7433038
            },
            events: {
                "click": function (map, event, handler) {
                    console.log('clicked the map');
                    console.log(handler[0].latLng.lat());
                    console.log(handler[0].latLng.lng());

                    vm.gymService.heartbeat(handler[0].latLng.lat(), handler[0].latLng.lng())
                        .then(function (data) {

                            data.forEach(function (gym) {
                                vm.idCounter++;
                                vm.map.markers.push({
                                    id: vm.idCounter,
                                    latitude: gym.coords.latitude,
                                    longitude: gym.coords.longitude
                                })
                            });
                        }
                        )
                }
            },
            zoom: 13
        };
        vm.map.markers = [];
        vm.gyms = [];
        vm.idCounter = 1;

        activate();

        ////////////////


        function activate() {

            vm.gymService.getGyms()
                .then(function (data) {
                    var gymCount = 0;
                    vm.$interval(function () {
                        console.log('waited 5 seconds');
                        vm.gymService.getGymData(vm.gymService.gyms[gymCount])
                            .then(function (response) {
                                vm.updateGymData(response);

                            });
                        gymCount = gymCount + 1;
                    }, 1000, vm.gymService.gyms.length)
                        .then(function (data) {
                            console.log('ALL DONE');
                        });

                    vm.gymService.gyms.forEach(function (g) {
                        vm.idCounter++;
                        vm.map.markers.push({
                            id: vm.idCounter,
                            latitude: g.coords.latitude,
                            longitude: g.coords.longitude
                        })
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

    MasterViewController.prototype.updateGymData = function (data) {
        var vm = this;
        vm.gymService.gyms.filter(function (gym) {
            if (gym.coords.latitude == data.location.lat && gym.coords.longitude == data.location.long) {
                gym.data = data;
                gym.isLoading = false;
            }
        });
    }

    MasterViewController.prototype.clickGym = function (gym) {
        var vm = this;
        //vm.uiGmapGoogleMapApi;
        console.log('clicked!');
        vm.map.center = {
            latitude: gym.coords.latitude,
            longitude: gym.coords.longitude
        };

        vm.map.zoom = 17
    }


})();