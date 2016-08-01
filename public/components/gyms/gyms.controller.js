(function () {
    'use strict';

    angular
        .module('main')
        .controller('GymsViewController', GymsViewController);

    GymsViewController.$inject = ['GymService','$state'];
    function GymsViewController(gymService,$state) {
        var vm = this;
        vm.gymService = gymService;
        vm.$state = $state;
        activate();

        ////////////////

        function activate() { 
           
        }
    }

    GymsViewController.prototype.back = function(){
        var vm = this;
        vm.$state.go('main');
    }
})();