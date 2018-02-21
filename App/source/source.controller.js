'use strict';

heavenApp.controller('sourceCtrl',
    [
        '$scope', '$uibModal', '$firebaseArray', 'toastr', 'heavenService','bsLoadingOverlayService',
        function ($scope, $uibModal, $firebaseArray, toastr, heavenService, bsLoadingOverlayService) {
         
            $scope.loadSources = function () {

                $scope.sources = [];
                if ($scope.sources.length === 0) {
                    bsLoadingOverlayService.start();
                    heavenService.getSources()
                        .then(function (data) {
                            $scope.sources = data;
                            $scope.sources.$loaded()
                                .then(function () {
                                    bsLoadingOverlayService.stop();
                                    if ($scope.sources.length === 0) {
                                        $scope.message = 'No records found.';
                                    };
                                });
                        })
                        .catch(function (err) {
                            console.warn(err.message);
                        });
                }
            }
            $scope.loadSources();

            $scope.saveSource = function(source) {

                if (source === undefined) {
                    source = null;
                };

                $uibModal.open({
                    resolve: {
                        source: source
                    },
                    templateUrl: 'App/source/source.entry.html',
                    controller: 'modalSourceCtrl',
                    backdrop: 'static'
                }).result.then(function(source) {


                    if (source.$id === undefined) { 

                        $scope.sources.$add({
                                sourceName: source.sourceName
                           
                            }).then(function() {
                                toastr.success('New Source Added Successfully!');
                            })
                            .catch(function(err) {
                                console.warn(err.message);
                            });
                    } else {

                        var src = $scope.sources.$getRecord(source.$id);
                        src.sourceName = source.sourceName;

                        $scope.sources.$save(src).then(function() {
                                toastr.info('Source Updated Successfully!');
                            })
                            .catch(function(err) {
                                console.warn(err.message);
                            });
                    }

                    $scope.message = '';
                });
            };

            $scope.deleteSource = function(source) {

                $uibModal.open({
                        resolve: {
                            source: source
                        },
                        templateUrl: 'App/shared/delete.popup.html',
                        controller: 'modalSourceCtrl',
                        backdrop: 'static'
                }).result.then(function(source) {
                       
                        var src = $scope.sources.$getRecord(source.$id);
                        $scope.sources.$remove(src);
                        $scope.loadSources();
                })
                    .then(function () {

                        toastr.error('Source Deleted Successfully!');
                })
                .catch(function(err) {
                        console.warn(err.message);
                 });

            };
        }
    ]);


heavenApp.controller('modalSourceCtrl',
    [
        '$scope', '$uibModalInstance', 'source',
        function($scope, $uibModalInstance, source) {

            $scope.source = angular.copy(source);

            if (source === null) {
                $scope.headerTitle = 'Add Source';
                $scope.headerColor = 'modal-header modal-header-success';
                $scope.buttonColor = 'btn btn-success';
                $scope.buttonName = 'Save';
            } else {
                $scope.headerTitle = 'Edit Source';
                $scope.headerColor = 'modal-header modal-header-primary';
                $scope.buttonColor = 'btn btn-primary';
                $scope.buttonName = 'Update';
            }

            $scope.save = function() {
                $uibModalInstance.close($scope.source);
            };

            $scope.delete = function() {
                $uibModalInstance.close($scope.source);
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);

