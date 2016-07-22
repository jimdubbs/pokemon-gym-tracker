var app = angular.module('main');

var UrlService = function ($location) {
    var service = {

        apiUrl: null,
        getUrls: getUrls

    };

    return service;

    function getUrls() {
        var host = $location.host();
        var protocol;
        
        if ($location.protocol() === 'http'){
            protocol = 'http://';
        }
        else{
            protocol = 'https://';
        }
        
        if (host.indexOf('localhost') !== -1) {
            service.apiUrl = protocol+ 'localhost:8090/';
        }

        else if (host.indexOf('172') !== -1) {
            

            service.apiUrl = protocol + '172.16.30.187:8090/';
        }

        else {
            service.apiUrl = protocol + 'poke-gym-tracker.azurewebsites.net/';
        }

    }

};

UrlService.$inject = ['$location'];
app.factory('urlService', UrlService);
