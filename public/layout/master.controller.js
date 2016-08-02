(function () {
    'use strict';

    angular
        .module('main')
        .controller('MasterViewController', MasterViewController);

    MasterViewController.$inject = ['uiGmapGoogleMapApi', 'GymService', '$interval', '$mdMedia', '$mdSidenav','$state','$scope'];
    function MasterViewController(uiGmapGoogleMapApi, gymService, $interval, $mdMedia, $mdSidenav, $state,$scope) {
        var vm = this;
        vm.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
        vm.gymService = gymService;
        vm.$scope = $scope;
        vm.$interval = $interval;
        vm.$mdMedia = $mdMedia;
        vm.$mdSidenav = $mdSidenav;
        vm.$state = $state;
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

                    //         data.forEach(function (pokemon) {
                    //             vm.idCounter++;
                    //             vm.map.markers.push({
                    //                 id: vm.idCounter,
                    //                 coords: {
                    //                     latitude: pokemon.latitude,
                    //                     longitude: pokemon.longitude
                    //                 },
                    //                 options: {
                    //                     labelClass: 'marker_labels',
                    //                     labelAnchor: '12 45',
                    //                     labelContent: pokemon.pokemon_data.pokemon.name
                    //                 },
                    //                 icon: {
                    //                     url: pokemon.pokemon_data.pokemon.img,
                    //                     scaledSize: new google.maps.Size(40, 40)
                    //                 }
                    //             })
                    //         });

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
                                coords: {
                                    latitude: vm.gymService.gyms[gym].gym_state.fort_data.latitude,
                                    longitude: vm.gymService.gyms[gym].gym_state.fort_data.longitude
                                },
                                options: {
                                    icon: ''
                                }
                            })

                        }
                    }

                });


            function showPosition(position) {
                // vm.map.markers.push({
                //     id: 1,
                //     latitude: position.coords.latitude,
                //     longitude: position.coords.longitude
                // });

                vm.map.center = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
            }

            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }

    MasterViewController.prototype.updateGymData = function (gym) {
        //console.log(gym);
        var vm = this;
        vm.gymService.getGymData(gym)
            .then(function(data){
                vm.gymService.updateGymData(data);
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
        console.log(gym);
        vm.map.center = {
            latitude: gym.gym_state.fort_data.latitude,
            longitude: gym.gym_state.fort_data.longitude
        };

        vm.map.zoom = 17

        vm.gymService.selectedGym = gym;

        if (!vm.$mdMedia('gt-md')){
            vm.$state.go('gym');
        }
    }


})();