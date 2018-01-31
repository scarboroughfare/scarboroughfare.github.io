'use strict';

heavenApp.controller('pickerCtrl', ['$scope', '$uibModal', '$firebaseArray',
    function ($scope, $uibModal, $firebaseArray) {

        var ref = firebase.database().ref().child("Picker");

        $scope.pickers = $firebaseArray(ref);


        $scope.addPicker = function () {
            $uibModal.open({
                resolve: { picker: null },
                templateUrl: '/picker/picker_entry.html',
                controller: 'modalPickerCtrl',
                backdrop: 'static'
            }).result.then(function (picker) {

                var ref = firebase.database().ref("Picker");

                $firebaseArray(ref).$add({
                    FirstName: picker.FirstName,
                    LastName: picker.LastName,
                    NickName: picker.NickName
                }).then(function (ref) {
                    var id = ref.key;
                    console.log('Added New Picker ' + id);
                });

                //$firebaseArray(ref).$add(picker)
                //    .then(function (ref) {
                //        var id = ref.key;
                //        alert('Added New Picker ' + id);

                //});

            });
        };


        $scope.editPicker = function (picker) {
            $uibModal.open({
                resolve: { picker: picker },
                templateUrl: '/picker/picker_entry.html',
                controller: 'modalPickerCtrl',
                backdrop: 'static'
            }).result.then(function (picker) {

                var ref = firebase.database().ref("Picker/" + picker.$id);

                ref.update({
                    FirstName: picker.FirstName,
                    LastName: picker.LastName,
                    NickName: picker.NickName
                }).then(function () {
                    console.log('Picker Updated ' + picker.$id);
                });
            });
        };


}]);



heavenApp.controller('modalPickerCtrl', ['$scope', '$uibModalInstance', 'picker',
    function ($scope, $uibModalInstance, picker) {

        $scope.picker = angular.copy(picker);

        if (picker === null) {
            $scope.headerTitle = 'Add Picker';
            $scope.headerColor = 'modal-header modal-header-success';
            $scope.buttonColor = 'btn btn-success';
            $scope.buttonName = 'Save';
        }
        else {
            $scope.headerTitle = 'Edit Picker';
            $scope.headerColor = 'modal-header modal-header-primary';
            $scope.buttonColor = 'btn btn-primary';
            $scope.buttonName = 'Update';
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