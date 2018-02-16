'use strict';

heavenApp.controller('accountCtrl',
    ['$scope', '$rootScope', '$location', 'authService',
            function ($scope, $rootScope, $location, authService) {
                // reset login status
                authService.ClearCredentials();

                $scope.login = function (account) {
                    $scope.dataLoading = true;
                    authService.Login(account.username, account.password, function (response) {
                        if (response.success) {
                            authService.SetCredentials(account.username, account.password);
                            $location.path('/home');
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                };
            }]);