'use strict';

heavenApp.controller('pickerCtrl', ['$scope', '$uibModal', '$firebaseArray', 'toastr',
    function ($scope, $uibModal, $firebaseArray, toastr) {

        var ref = firebase.database().ref().child("Picker"); 
        $scope.pickers = $firebaseArray(ref);

        $scope.savePicker = function (picker) {

            if (picker === undefined) {
                picker = null;
            };

            $uibModal.open({
                resolve: { picker: picker },
                templateUrl: 'App/picker/picker_entry.html',
                controller: 'modalPickerCtrl',
                backdrop: 'static'
            }).result.then(function (picker) {

                var ref;

                if (picker.$id === undefined) {

                    ref = firebase.database().ref("Picker");
                    $firebaseArray(ref).$add({
                        FirstName: picker.FirstName,
                        LastName: picker.LastName,
                        NickName: picker.NickName
                    })
                    .then(function () {
                        toastr.success('New Picker Added Successfully!');
                     }),
                    function () {
                        toastr.error("Error Adding the Record!");
                    };
                }
                else {

                    ref = firebase.database().ref("Picker/" + picker.$id);
                    ref.update({
                        FirstName: picker.FirstName,
                        LastName: picker.LastName,
                        NickName: picker.NickName
                    })
                    .then(function () {
                         toastr.info('Picker Updated Successfully!');
                    }),
                    function () {
                        toastr.error("Error Updating the Record!");
                    };
                }      
            });
        };

        $scope.deletePicker = function (index) {

            $uibModal.open({
                resolve: { picker: index },
                templateUrl: 'App/shared/delete_popup.html',
                controller: 'modalPickerCtrl',
                backdrop: 'static'        
            }).result.then(function (index) {

                var picker = $scope.pickers[index];
                $scope.pickers.$remove(picker);
             })
            .then(function () {
                toastr.error('Picker Deleted Successfully!');
             }),
             function () {
                 toastr.error("Error Deleting the Record!");
             };
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

        $scope.delete = function () {
            $uibModalInstance.close($scope.picker);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);

