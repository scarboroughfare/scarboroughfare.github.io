'use strict';

heavenApp.controller('pickerCtrl',
    [
        '$scope', '$uibModal', '$firebaseArray', 'toastr', 'heavenService','bsLoadingOverlayService',
        function ($scope, $uibModal, $firebaseArray, toastr, heavenService, bsLoadingOverlayService) {
         
            $scope.loadPickers = function () {

                $scope.pickers = [];
                if ($scope.pickers.length === 0) {
                    bsLoadingOverlayService.start();
                    heavenService.getPickers()
                        .then(function (data) {
                            $scope.pickers = data;
                            $scope.pickers.$loaded()
                                .then(function () {
                                    bsLoadingOverlayService.stop();
                                    if ($scope.pickers.length === 0) {
                                        $scope.message = 'No records found.';
                                    };
                                });
                        })
                        .catch(function (err) {
                            console.warn(err.message);
                        });
                }
            }
            $scope.loadPickers();

            $scope.savePicker = function(picker) {

                if (picker === undefined) {
                    picker = null;
                };

                $uibModal.open({
                    resolve: {
                        picker: picker
                    },
                    templateUrl: 'App/picker/picker.entry.html',
                    controller: 'modalPickerCtrl',
                    backdrop: 'static'
                }).result.then(function(picker) {


                    if (picker.$id === undefined) { 

                        $scope.pickers.$add({
                                firstName: picker.firstName,
                                lastName: picker.lastName,
                                nickName: picker.nickName
                            }).then(function() {
                                toastr.success('New Picker Added Successfully!');
                            })
                            .catch(function(err) {
                                console.warn(err.message);
                            });
                    } else {

                        var pickr = $scope.pickers.$getRecord(picker.$id);
                        pickr.firstName = picker.firstName;
                        pickr.lastName = picker.lastName;
                        pickr.nickName = picker.nickName;

                        $scope.pickers.$save(pickr).then(function() {
                                toastr.info('Picker Updated Successfully!');
                            })
                            .catch(function(err) {
                                console.warn(err.message);
                            });
                    }

                    $scope.message = '';
                });
            };

            $scope.deletePicker = function(picker) {

                $uibModal.open({
                        resolve: {
                            picker: picker
                        },
                        templateUrl: 'App/shared/delete.popup.html',
                        controller: 'modalPickerCtrl',
                        backdrop: 'static'
                }).result.then(function(picker) {
                       
                        var pickr = $scope.pickers.$getRecord(picker.$id);
                        $scope.pickers.$remove(pickr);
                        $scope.loadPickers();
                })
                    .then(function () {

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

