'use strict';

heavenApp.controller('pickPlanCtrl',
    [
        '$scope', '$uibModal', '$firebaseArray', 'toastr', 'heavenService','bsLoadingOverlayService',
        function ($scope, $uibModal, $firebaseArray, toastr, heavenService, bsLoadingOverlayService) {

            $scope.isShowDatePlan = true;

            $scope.pickPlan = {
                id: null,
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

            heavenService.getPickPlanDetails()
                .then(function (data) {
                    $scope.pickPlanDetails = data;
                });


            $scope.addPickPlan = function() {
            
                $scope.pickPlan.id = null;
                $scope.pickPlan.planDate = null;
                $scope.isShowDatePlan = false;
            };

            $scope.editPickPlan = function (pickPlan) {

                $scope.pickPlan.id = pickPlan.$id;
                $scope.pickPlan.planDate = new Date(pickPlan.planDate);
                $scope.isShowDatePlan = false;
            };

            $scope.cancelPickPlan = function () {

                $scope.pickPlan.id = null;
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
  

                        //var pickPlanDetail = $scope.pickDetails.$getRecord(pickPlan.$id);
                        //$scope.pickDetails.$remove(pickPlanDetail);

                        var pckPlan = $scope.pickPlans.$getRecord(pickPlan.$id);
                        $scope.pickPlans.$remove(pckPlan);

                        //angular.forEach($scope.pickPlanDetails,
                        //    function (pickDetails) {
                        //        if (pickDetails.id === pickPlan.$id) {
                        //            alert("asdasd");
                        //            var pckPlanDetail = $scope.pickPlanDetails.$getRecord(pickDetails.id);
                        //            $scope.pickDetails.$remove(pckPlanDetail);
                        //        }
                                
                        //    });

                        $scope.loadPickPlans();
                })
                    .then(function () {

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



            var isExist = false;
            $scope.saveDatePlan = function (pickPlan) {
                debugger;
                var data = {
                    id: $scope.pickPlan.id,
                    planDate: $scope.pickPlan.planDate.toDateString()
                }

                angular.forEach($scope.pickPlans,
                    function (pickDate) {

                        if (pickDate.planDate === data.planDate && pickDate.id === data.id) {
                            isExist = true;
                        }
                        else if (pickDate.planDate === data.planDate && pickDate.id !== data.id) {
                            isExist = true;
                        }
                    });



                if (!isExist) {
                    if ($scope.pickPlan.id === null) {


                        $scope.pickPlans.$add({
                            planDate: pickPlan.planDate.toDateString()
                        }).then(function (ref) {
                            $scope.pickPlan.id = ref.key;
                            $scope.dateTemp = angular.copy($scope.pickPlan.planDate.toDateString());
                            console.log('Date Added');
                        }).catch(function (err) {
                            console.warn(err.message);
                        });
                    } else {

                        var pckPlan = $scope.pickPlans.$getRecord($scope.pickPlan.id);
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
                            id: $scope.pickPlan.id,
                            task: pickPlanDetail.task,
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
                        pckPlanDetail.task = pickPlanDetail.task;
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

            if (pickPlanDetail === null) {
                $scope.headerTitle = 'Add New Row';
                $scope.headerColor = 'modal-header modal-header-success';
                $scope.buttonColor = 'btn btn-success';
                $scope.buttonName = 'Save';
            } else {
                $scope.headerTitle = 'Edit Row';
                $scope.headerColor = 'modal-header modal-header-primary';
                $scope.buttonColor = 'btn btn-primary';
                $scope.buttonName = 'Update';
            }

            heavenService.getPickers()
                .then(function (data) {
                    $scope.pickers = data;
                });

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

