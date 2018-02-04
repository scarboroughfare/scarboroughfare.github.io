'use strict';

heavenApp.controller('pickerCtrl',
    [ '$scope', '$uibModal', '$firebaseArray', 'toastr',
        function($scope, $uibModal, $firebaseArray, toastr) {

            var ref = firebase.database().ref("pickers");
            $scope.pickers = $firebaseArray(ref);
            $scope.pickers.$loaded()
                .then(function() {
                    console.log('picker list loaded');
                })
                .catch(function(err) {
                    console.warn(err.message);
                });


            $scope.savePicker = function(picker) {

                if (picker === undefined) {
                    picker = null;
                };

                $uibModal.open({
                    resolve: {
                        picker: picker
                    },
                    templateUrl: 'App/picker/picker_entry.html',
                    controller: 'modalPickerCtrl',
                    backdrop: 'static'
                }).result.then(function(picker) {


                    if (picker.$id === undefined) {

                        $scope.pickers.$add({
                                firstName: picker.firstName,
                                lastName: picker.lastName,
                                nickName: picker.nickName
                            }).then(function(ref) {
                                console.log(ref.key);
                                toastr.success('New Picker Added Successfully!');
                            })
                            .catch(function(err) {
                                console.warn(err.message);
                            });
                    } else {

                        var pickerData = firebase.database().ref("pickers/" + picker.$id);
                        pickerData.update({
                                firstName: picker.firstName,
                                lastName: picker.lastName,
                                nickName: picker.nickName
                            })
                            .then(function() {
                                toastr.info('Picker Updated Successfully!');
                            })
                            .catch(function(err) {
                                console.warn(err.message);
                            });
                    }
                });
            };

            $scope.deletePicker = function(index) {

                $uibModal.open({
                        resolve: {
                             picker: index
                        },
                        templateUrl: 'App/shared/delete_popup.html',
                        controller: 'modalPickerCtrl',
                        backdrop: 'static'
                    }).result.then(function(index) {

                        var picker = $scope.pickers[index];
                        $scope.pickers.$remove(picker);
                    })
                    .then(function() {
                        toastr.error('Picker Deleted Successfully!');
                    })
                    .catch(function(err) {
                        console.warn(err.message);
                    });
            };
        }
    ]);


heavenApp.controller('modalPickerCtrl',
    [
        '$scope', '$uibModalInstance', 'picker',
        function($scope, $uibModalInstance, picker) {

            $scope.picker = angular.copy(picker);

            if (picker === null) {
                $scope.headerTitle = 'Add Picker';
                $scope.headerColor = 'modal-header modal-header-success';
                $scope.buttonColor = 'btn btn-success';
                $scope.buttonName = 'Save';
            } else {
                $scope.headerTitle = 'Edit Picker';
                $scope.headerColor = 'modal-header modal-header-primary';
                $scope.buttonColor = 'btn btn-primary';
                $scope.buttonName = 'Update';
            }

            $scope.save = function() {
                $uibModalInstance.close($scope.picker);
            };

            $scope.delete = function() {
                $uibModalInstance.close($scope.picker);
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }
    ]);

