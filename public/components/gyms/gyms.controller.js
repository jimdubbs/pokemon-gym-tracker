(function () {
    'use strict';

    angular
        .module('main')
        .controller('GymsViewController', GymsViewController);

    GymsViewController.$inject = ['GymService'];
    function GymsViewController(gymService) {
        var vm = this;
        vm.gymService = gymService;

        activate();

        ////////////////

        function activate() { 
            vm.gymService.getGymData()
                .then(function(data){
                    console.log(vm.gymService.gyms);
                });
        }
    }
})();