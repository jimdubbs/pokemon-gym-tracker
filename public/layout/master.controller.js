(function () {
    'use strict';

    angular
        .module('main')
        .controller('MasterViewController', MasterViewController);

    MasterViewController.$inject = [];
    function MasterViewController() {
        var vm = this;


        activate();

        ////////////////

        function activate() { }
    }
})();