'use strict';

heavenApp.controller('pickPlanCtrl',
    [
        '$scope', '$uibModal', '$firebaseArray', 'toastr', 'heavenService','bsLoadingOverlayService',
        function ($scope, $uibModal, $firebaseArray, toastr, heavenService, bsLoadingOverlayService) {

            $scope.isShowDatePlan = true;

            $scope.pickPlan = {
                pickPlanId: null,
                planDate: null
            };


            $scope.loadPickPlans = function () {

                $scope.pickPlans = [];
                if ($scope.pickPlans.length === 0) {
                    bsLoadingOverlayService.start();
                    heavenService.getPickPlans()
                        .then(function (data) {
                            $scope.pickPlans = data;
                            $scope.pickPlans.$loaded()
                                .then(function () {
                                    bsLoadingOverlayService.stop();
                                    if ($scope.pickPlans.length === 0) {
                                        $scope.message = 'No records found.';
                                    };
                                });
                        })
                        .catch(function (err) {
                            console.warn(err.message);
                        });
                }
            }
            $scope.loadPickPlans();


            $scope.loadPickPlanDetails = function () {

                $scope.pickPlanDetails = [];
                if ($scope.pickPlanDetails.length === 0) {
                    bsLoadingOverlayService.start();
                    heavenService.getPickPlanDetails()
                        .then(function (data) {
                            $scope.pickPlanDetails = data;
                            $scope.pickPlanDetails.$loaded()
                                .then(function () {
                                    bsLoadingOverlayService.stop();
                                });
                        })
                        .catch(function (err) {
                            console.warn(err.message);
                        });
                }
            }
            $scope.loadPickPlanDetails();


            $scope.addPickPlan = function() {
            
                $scope.pickPlan.pickPlanId = null;
                $scope.pickPlan.planDate = null;
                $scope.isShowDatePlan = false;
            };

            $scope.editPickPlan = function (pickPlan) {

                $scope.pickPlan.pickPlanId = pickPlan.$id;
                $scope.pickPlan.planDate = new Date(pickPlan.planDate);
                $scope.isShowDatePlan = false;
            };

            $scope.cancelPickPlan = function () {

                $scope.pickPlan.pickPlanId = null;
                $scope.pickPlan.planDate = null;
                $scope.isShowDatePlan = true;
            };


            $scope.deletePickPlan = function(pickPlan) {

                $uibModal.open({
                        resolve: {
                            pickPlan: pickPlan
                        },
                        templateUrl: 'App/shared/delete-popup.html',
                        controller: 'modalPickPlanCtrl',
                        backdrop: 'static'
                }).result.then(function(pickPlan) {

                        var pckPlan = $scope.pickPlans.$getRecord(pickPlan.$id);
                        $scope.pickPlans.$remove(pckPlan);


                        $scope.selectedPickPlanDetails = $scope.pickPlanDetails.filter(function(pickPlanDetail) {
                            return (pickPlanDetail.pickPlanId === pickPlan.$id);
                        });

                        for (var i = $scope.selectedPickPlanDetails.length - 1; i >= 0; i--) {

                            var pckPlanDetail = $scope.selectedPickPlanDetails[i];
                            $scope.pickPlanDetails.$remove(pckPlanDetail);
                        }

                        $scope.loadPickPlans();
                 })
                .then(function() {

                        toastr.error('PickPlan Deleted Successfully!');
                 })
                 .catch(function(err) {
                        console.warn(err.message);
                 });

            };


     // PickPlanView ----------------------->

            $scope.print = function () {
                window.print();
            }

            $scope.openCalendar = function () {
                $scope.status.opened = true;
            };
            $scope.status = {
                opened: false
            };

            heavenService.getPickers()
                .then(function (data) {
                    $scope.pickers = data;
                });



            $scope.showPickers = function (pickerList) {
                if (pickerList === undefined) {
                    return ' ';
                } else {
                    var selected = [];
                    angular.forEach($scope.pickers, function (picker) {

                        if (pickerList.indexOf(picker.$id) >= 0) {
                            selected.push(picker.nickName);
                        }
                    });
                    return selected.join(', ');
                }
            };

            var isExist = false;
            $scope.saveDatePlan = function (pickPlan) {
                debugger;
                var data = {
                    pickPlanId: $scope.pickPlan.pickPlanId,
                    planDate: $scope.pickPlan.planDate.toDateString()
                }

                angular.forEach($scope.pickPlans,
                    function (pickDate) {

                        if (pickDate.planDate === data.planDate && pickDate.pickPlanId === data.pickPlanId) {
                            isExist = true;
                        }
                        else if (pickDate.planDate === data.planDate && pickDate.pickPlanId !== data.pickPlanId) {
                            isExist = true;
                        }
                    });



                if (!isExist) {
                    if ($scope.pickPlan.pickPlanId === null) {


                        $scope.pickPlans.$add({
                            planDate: pickPlan.planDate.toDateString()
                        }).then(function (ref) {
                            $scope.pickPlan.pickPlanId = ref.key;
                            $scope.dateTemp = angular.copy($scope.pickPlan.planDate.toDateString());
                            console.log('Date Added');
                        }).catch(function (err) {
                            console.warn(err.message);
                        });
                    } else {

                        var pckPlan = $scope.pickPlans.$getRecord($scope.pickPlan.pickPlanId);
                        pckPlan.planDate = pickPlan.planDate.toDateString();

                        $scope.pickPlans.$save(pckPlan)
                            .then(function () {
                                console.log('Date Updated');
                            }).catch(function (err) {
                                console.warn(err.message);
                            });
                    }
                } else {
                    alert("Date already exists!");
                    $scope.pickPlan.planDate = new Date(Date.parse($scope.dateTemp));
                    console.log($scope.dateTemp);
                }
                return isExist = false;
            };





            $scope.savePickPlanDetail = function (pickPlanDetail) {

                if (pickPlanDetail === undefined) {
                    pickPlanDetail = null;
                };

                $uibModal.open({
                    resolve: {
                        pickPlanDetail: pickPlanDetail
                    },
                    templateUrl: 'App/pickplan/pickplan-entry.html',
                    controller: 'modalPickPlanViewCtrl',
                    backdrop: 'static'
                }).result.then(function (pickPlanDetail) {

                    console.log(pickPlanDetail);


                    if (pickPlanDetail.$id === undefined) {

                        $scope.pickPlanDetails.$add({
                            pickPlanId: $scope.pickPlan.pickPlanId,
                            task: pickPlanDetail.task.taskName || pickPlanDetail.task,
                            kgTarget: pickPlanDetail.kgTarget,
                            kgPerHour: pickPlanDetail.kgPerHour,
                            source: pickPlanDetail.source,
                            startTime: pickPlanDetail.startTime,
                            finishTime: pickPlanDetail.finishTime,
                            pickers: pickPlanDetail.pickers,
                            notes: pickPlanDetail.notes || null

                        }).then(function () {
                            toastr.success('New Row Added Successfully!');
                        })
                            .catch(function (err) {
                                console.warn(err.message);
                            });
                    } else {

                        var pckPlanDetail = $scope.pickPlanDetails.$getRecord(pickPlanDetail.$id);
                        pckPlanDetail.task = pickPlanDetail.task.taskName || pickPlanDetail.task;
                        pckPlanDetail.kgTarget = pickPlanDetail.kgTarget;
                        pckPlanDetail.kgPerHour = pickPlanDetail.kgPerHour;
                        pckPlanDetail.source = pickPlanDetail.source;
                        pckPlanDetail.startTime = pickPlanDetail.startTime;
                        pckPlanDetail.finishTime = pickPlanDetail.finishTime;
                        pckPlanDetail.pickers = pickPlanDetail.pickers;
                        pckPlanDetail.notes = pickPlanDetail.notes || null;

                        $scope.pickPlanDetails.$save(pckPlanDetail).then(function () {
                            toastr.info('Row Updated Successfully!');
                        })
                            .catch(function (err) {
                                console.warn(err.message);
                            });
                    }

                    $scope.message = '';
                });
            };

            $scope.deletePickPlanDetail = function (pickPlanDetail) {

                $uibModal.open({
                    resolve: {
                        pickPlanDetail: pickPlanDetail
                    },
                    templateUrl: 'App/shared/delete-popup.html',
                    controller: 'modalPickPlanViewCtrl',
                    backdrop: 'static'
                }).result.then(function (pickPlanDetail) {

                    var pckPlanDetail = $scope.pickPlanDetails.$getRecord(pickPlanDetail.$id);
                    $scope.pickPlanDetails.$remove(pckPlanDetail);
                    $scope.loadPickPlans();
                })
                    .then(function () {

                        toastr.error('Row Deleted Successfully!');
                    })
                    .catch(function (err) {
                        console.warn(err.message);
                    });

            };


        }
    ]);


heavenApp.controller('modalPickPlanCtrl',
    [
        '$scope', '$uibModalInstance', 'pickPlan',
        function($scope, $uibModalInstance, pickPlan) {

            $scope.pickPlan = angular.copy(pickPlan);

            if (pickPlan === null) {
                $scope.headerTitle = 'Add PickPlan';
                $scope.headerColor = 'modal-header modal-header-success';
                $scope.buttonColor = 'btn btn-success';
                $scope.buttonName = 'Save';
            } else {
                $scope.headerTitle = 'Edit PickPlan';
                $scope.headerColor = 'modal-header modal-header-primary';
                $scope.buttonColor = 'btn btn-primary';
                $scope.buttonName = 'Update';
            }

            $scope.save = function() {
                $uibModalInstance.close($scope.pickPlan);
            };

            $scope.delete = function() {
                $uibModalInstance.close($scope.pickPlan);
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);


heavenApp.controller('modalPickPlanViewCtrl',
    [
        '$scope', '$uibModalInstance', 'pickPlanDetail','heavenService',
        function ($scope, $uibModalInstance, pickPlanDetail, heavenService) {

            $scope.pickPlanDetail = angular.copy(pickPlanDetail);
            $scope.pickers = [];
            heavenService.getPickers()
                .then(function (data) {
                    $scope.pickers = data;

                });

            heavenService.getTasks()
                .then(function (data) {
                    $scope.tasks = data;
                });

            if (pickPlanDetail === null) {
                $scope.headerTitle = 'Add New Row';
                $scope.headerColor = 'modal-header modal-header-success';
                $scope.buttonColor = 'btn btn-success';
                $scope.buttonName = 'Save';
                $scope.pickPlanDetail = [];
                $scope.pickPlanDetail.pickers = [];
            } else {
                $scope.headerTitle = 'Edit Row';
                $scope.headerColor = 'modal-header modal-header-primary';
                $scope.buttonColor = 'btn btn-primary';
                $scope.buttonName = 'Update';
                                    
            }

          
            $scope.checkAll = function () {
                debugger;
                if ($scope.pickPlanDetail.pickers.length !== $scope.pickers.length) {
                    $scope.pickPlanDetail.pickers = $scope.pickers.map(function(picker) { return picker.$id; });
                   
                } else {
                    $scope.pickPlanDetail.pickers = []; 
                 
                }            
            };


            $scope.save = function () {
                $uibModalInstance.close($scope.pickPlanDetail);
            };

            $scope.delete = function () {
                $uibModalInstance.close($scope.pickPlanDetail);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);

