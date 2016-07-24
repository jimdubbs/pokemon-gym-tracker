(function () {
    'use strict';

    angular.module('main', ['ui.router', 'ngResource', 'ngAnimate', 'ngMaterial', 'ngStorage', 'uiGmapgoogle-maps'

    ])

        .config(function ($provide, $stateProvider, $urlRouterProvider, $locationProvider,
            $urlMatcherFactoryProvider, $httpProvider, $mdThemingProvider, nemSimpleLoggerProvider,
            uiGmapGoogleMapApiProvider) {
            $urlMatcherFactoryProvider.strictMode(false);

            $provide.decorator.apply(null, nemSimpleLoggerProvider.decorator);

            $locationProvider
                .html5Mode({
                    enabled: true,
                    requireBase: true
                });

            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyDO4yYkVmOfTFPkatJUVIgUD4yzUVQBK14',
                v: '3.20', //defaults to latest 3.X anyhow
                libraries: 'weather,geometry,visualization'
            });
            $stateProvider
                .state('main', {
                    controller: 'MasterViewController',
                    controllerAs: 'vm',
                    url: '/',
                    templateUrl: '/layout/master.html'
                })
                .state('gyms', {
                    controller: 'GymsViewController',
                    controllerAs: 'vm',
                    url: '/gyms',
                    templateUrl: '/components/gyms/gyms.html'
                });

            // $httpProvider.interceptors.push('httpInterceptor');

            var pokemonPrimaryTheme = $mdThemingProvider.extendPalette('blue', {
                '700': '#3b5ba7'
            })

            var pokemonAccentTheme = $mdThemingProvider.extendPalette('yellow', {
                '700': '#ffcb05'
            })

            $mdThemingProvider.definePalette('pokemonPrimaryTheme', pokemonPrimaryTheme);
            $mdThemingProvider.definePalette('pokemonAccentTheme', pokemonAccentTheme);

            $mdThemingProvider.theme('default')
                .primaryPalette('pokemonPrimaryTheme', {
                    'default': '700'
                })
                .accentPalette('pokemonAccentTheme', {
                    'default': '700'
                })
                .backgroundPalette('grey');

            $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
            $mdThemingProvider.theme('dark-red').backgroundPalette('red').dark();
            $mdThemingProvider.theme('dark-yellow').backgroundPalette('yellow');
        });

})();