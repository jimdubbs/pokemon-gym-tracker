(function () {
    'use strict';

    angular
        .module('main')
        .controller('MasterViewController', MasterViewController);

    MasterViewController.$inject = ['uiGmapGoogleMapApi', 'GymService', '$interval','$mdMedia','$mdSidenav'];
    function MasterViewController(uiGmapGoogleMapApi, gymService, $interval,$mdMedia,$mdSidenav) {
        var vm = this;
        vm.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
        vm.gymService = gymService;
        vm.$interval = $interval;
        vm.$mdMedia = $mdMedia;
        vm.$mdSidenav = $mdSidenav;
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

                    // vm.gymService.heartbeat(handler[0].latLng.lat(), handler[0].latLng.lng())
                    //     .then(function (data) {

                    //     }
                    //     );
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
                    console.log(vm.gymService.gyms);
                    for (var gym in vm.gymService.gyms) {
                        if (vm.gymService.gyms.hasOwnProperty(gym)) {
                            vm.idCounter++;
                            vm.map.markers.push({
                                id: vm.idCounter,
                                latitude: vm.gymService.gyms[gym].gym_state.fort_data.latitude,
                                longitude: vm.gymService.gyms[gym].gym_state.fort_data.longitude
                            })


                            //vm.gymService.gyms[gym].gym_state.fort_data.guardPokemon =
                                // vm.gymService.getPokemon(vm.gymService.gyms[gym].gym_state.fort_data.guard_pokemon_id)
                                //     .then(function(data){
                                //         vm.gymService.gyms[gym].gym_state.fort_data.guardPokemon = data.data;
                                //     });


                        }
                    }

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
    
    MasterViewController.prototype.toggleSideNav = function () {
        var vm = this;
        vm.$mdSidenav('left').toggle();
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