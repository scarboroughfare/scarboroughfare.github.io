'use strict';

angular.module('myApp.picker', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/picker', {
    templateUrl: 'picker/picker.html',
    controller: 'pickerCtrl'
  });
}])

    .controller('pickerCtrl', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {

        var ref = firebase.database().ref().child("Picker");

        $scope.pickers = $firebaseArray(ref);



        $scope.addPicker = function() {

            var ref = firebase.database().ref("Picker");
            $firebaseArray(ref).$add($scope.picker)
                .then(function(ref) {
                    var id = ref.key;
                    alert('Added New Picker ' + id);

                    $scope.picker.FirstName = '';
                    $scope.picker.LastName = '';
                    $scope.picker.NicktName = '';

                });
        }
         


}]);