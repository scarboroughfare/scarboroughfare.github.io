'use strict';

angular.module('myApp.picker', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/picker', {
    templateUrl: 'picker/picker.html',
    controller: 'pickerCtrl'
  });
}])

    .controller('pickerCtrl', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {

        //// Initialize Firebase
        //var config = {
        //    apiKey: "AIzaSyDDR0N4N6hKb4X_r7-BvGVRtPgTMaFvbUg",
        //    authDomain: "heaven-dev-db.firebaseapp.com",
        //    databaseURL: "https://heaven-dev-db.firebaseio.com",
        //    projectId: "heaven-dev-db",
        //    storageBucket: "heaven-dev-db.appspot.com",
        //    messagingSenderId: "917810951004"
        //};
        //firebase.initializeApp(config);

        $scope.addPicker = function() {

            var ref = firebase.database().ref("pickers");
            $firebaseArray(ref).$add($scope.picker)
                .then(function(ref) {
                    var id = ref.key;
                    console.log('Added New Picker ' + id);

                    $scope.picker.FirstName = '';
                    $scope.picker.LastName = '';
                    $scope.picker.NicktName = '';

                });
        }

        //var ref = firebase.database().ref().child("pickers");
        //$scope.pickers = $firebaseArray(ref);

        //$scope.addPicker = function() {


        //    $scope.pickers.$add({

        //        FirstName: $scope.firstName,
        //        LastName: $scope.lastName,
        //        NicktName: $scope.nicktName

        //    }).then(function(ref) {
        //        var id = ref.key;
        //        console.log('Addes Picker ' + id);

        //        $scope.firstName = '';
        //        $scope.lastName = '';
        //        $scope.nicktName = '';

        //    });
    

}]);