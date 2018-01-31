'use strict';

heavenApp.controller('pickerCtrl', ['$scope', '$uibModal', '$firebaseArray', '$firebaseObject', '$routeParams',
    function ($scope, $uibModal, $firebaseArray, $firebaseObject, $routeParams) {

        var ref = firebase.database().ref().child("Picker");

        $scope.pickers = $firebaseArray(ref);


        $scope.addPicker = function () {
            $uibModal.open({
                resolve: { picker: null },
                templateUrl: '/picker/pickerEntry.html',
                controller: 'modalPickerCtrl',
                backdrop: 'static'
            }).result.then(function (data) {

                $scope.savePicker(data);
            });
        };


        $scope.editPicker = function (picker) {
            $uibModal.open({
                resolve: { picker: picker },
                templateUrl: '/picker/pickerEntry.html',
                controller: 'modalPickerCtrl',
                backdrop: 'static'
            }).result.then(function (data) {

                $scope.updatePicker(data);
            });
        };


        $scope.savePicker = function(picker) {

            var ref = firebase.database().ref("Picker");
            $firebaseArray(ref).$add(picker)
                .then(function(ref) {
                    var id = ref.key;
                    alert('Added New Picker ' + id);

                });
        }



        $scope.updatePicker = function (picker) {

            var ref = firebase.database().ref("Picker");
            $firebaseArray(ref).$save(picker)
                .then(function (ref) {
                    var id = ref.key;
                    alert('Added New Picker ' + id);

                });
        }
         


}]);



heavenApp.controller('modalPickerCtrl', ['$scope', '$uibModalInstance', 'picker',
    function ($scope, $uibModalInstance, picker) {

        $scope.picker = angular.copy(picker);

        if (picker === null) {
            $scope.headerTitle = 'Add Picker';
            $scope.headerColor = 'modal-header modal-header-success';
            $scope.operation = 0;
        }
        else {
            $scope.headerTitle = 'Edit Picker';
            $scope.headerColor = 'modal-header modal-header-primary';
            $scope.operation = 1;
        }

        $scope.save = function () {

            $uibModalInstance.close($scope.picker);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.deleteRecord = function () {
            $uibModalInstance.close($scope.picker);
        };
    }]);