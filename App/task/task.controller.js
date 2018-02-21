'use strict';

heavenApp.controller('taskCtrl',
    [
        '$scope', '$uibModal', '$firebaseArray', 'toastr', 'heavenService','bsLoadingOverlayService',
        function ($scope, $uibModal, $firebaseArray, toastr, heavenService, bsLoadingOverlayService) {
         
            $scope.loadTasks = function () {

                $scope.tasks = [];
                if ($scope.tasks.length === 0) {
                    bsLoadingOverlayService.start();
                    heavenService.getTasks()
                        .then(function (data) {
                            $scope.tasks = data;
                            $scope.tasks.$loaded()
                                .then(function () {
                                    bsLoadingOverlayService.stop();
                                    if ($scope.tasks.length === 0) {
                                        $scope.message = 'No records found.';
                                    };
                                });
                        })
                        .catch(function (err) {
                            console.warn(err.message);
                        });
                }
            }
            $scope.loadTasks();

            $scope.saveTask = function(task) {

                if (task === undefined) {
                    task = null;
                };

                $uibModal.open({
                    resolve: {
                        task: task
                    },
                    templateUrl: 'App/task/task.entry.html',
                    controller: 'modalTaskCtrl',
                    backdrop: 'static'
                }).result.then(function(task) {


                    if (task.$id === undefined) { 

                        $scope.tasks.$add({
                                taskName: task.taskName,
                                pickRate: task.pickRate || null                              
                            }).then(function() {
                                toastr.success('New Task Added Successfully!');
                            })
                            .catch(function(err) {
                                console.warn(err.message);
                            });
                    } else {

                        var tsk = $scope.tasks.$getRecord(task.$id);
                        tsk.taskName = task.taskName;
                        tsk.pickRate = task.pickRate || null;

                        $scope.tasks.$save(tsk).then(function() {
                                toastr.info('Task Updated Successfully!');
                            })
                            .catch(function(err) {
                                console.warn(err.message);
                            });
                    }

                    $scope.message = '';
                });
            };

            $scope.deleteTask = function(task) {

                $uibModal.open({
                        resolve: {
                            task: task
                        },
                        templateUrl: 'App/shared/delete.popup.html',
                        controller: 'modalTaskCtrl',
                        backdrop: 'static'
                }).result.then(function(task) {
                       
                        var tsk = $scope.tasks.$getRecord(task.$id);
                        $scope.tasks.$remove(tsk);
                        $scope.loadTasks();
                })
                    .then(function () {

                        toastr.error('Task Deleted Successfully!');
                })
                .catch(function(err) {
                        console.warn(err.message);
                 });

            };
        }
    ]);


heavenApp.controller('modalTaskCtrl',
    [
        '$scope', '$uibModalInstance', 'task',
        function($scope, $uibModalInstance, task) {

            $scope.task = angular.copy(task);

            if (task === null) {
                $scope.headerTitle = 'Add Task';
                $scope.headerColor = 'modal-header modal-header-success';
                $scope.buttonColor = 'btn btn-success';
                $scope.buttonName = 'Save';
            } else {
                $scope.headerTitle = 'Edit Task';
                $scope.headerColor = 'modal-header modal-header-primary';
                $scope.buttonColor = 'btn btn-primary';
                $scope.buttonName = 'Update';
            }

            $scope.save = function() {
                $uibModalInstance.close($scope.task);
            };

            $scope.delete = function() {
                $uibModalInstance.close($scope.task);
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);

