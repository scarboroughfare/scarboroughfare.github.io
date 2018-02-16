'use strict';

var heavenApp = angular.module('heavenApp', ['ngRoute', 'ngCookies', 'ngAnimate', 'ngSanitize', 'firebase', 'ui.bootstrap', 'xeditable', 'ui.sortable', 'checklist-model', 'toastr', 'bsLoadingOverlay', 'bsLoadingOverlaySpinJs'])
    .run(function (bsLoadingOverlayService) {
        bsLoadingOverlayService.setGlobalConfig({
            //templateUrl: 'App/shared/spinner-template.html'
            templateUrl: 'bsLoadingOverlaySpinJs'
        });
    })
    .run([
        '$rootScope', '$location', '$cookies', '$http',
        function ($rootScope, $location, $cookies, $http) {
            // keep user logged in after page refresh

            $rootScope.globals = $cookies.getObject('globals') || {};
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            }

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in and trying to access a restricted page
                var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
                $rootScope.restrictedPage = restrictedPage;

                var loggedIn = $rootScope.globals.currentUser;
                if (restrictedPage && !loggedIn) {
                    $location.path('/login');
                }
            });

            $rootScope.location = $location;

         
        }
    ]);

