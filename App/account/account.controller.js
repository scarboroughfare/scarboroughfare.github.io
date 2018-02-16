'use strict';

heavenApp.controller('accountCtrl',
        ['$scope', '$rootScope', '$location', 'AuthenticationService',
            function ($scope, $rootScope, $location, AuthenticationService) {
                // reset login status
                AuthenticationService.ClearCredentials();

                $scope.login = function (account) {
                    $scope.dataLoading = true;
                    AuthenticationService.Login(account.username, account.password, function (response) {
                        if (response.success) {
                            AuthenticationService.SetCredentials(account.username, account.password);
                            $location.path('/home');
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                };
            }]);