'use strict';

heavenApp.controller('pickPlanCtrl', ['$scope', '$uibModal', '$firebaseArray', 'toastr','heavenService',
    function ($scope, $uibModal, $firebaseArray, toastr, heavenService) {


        heavenService.getPickPlans().then(function (data) {
            $scope.pickPlans = data;
            if ($scope.pickPlans.length === 0) {
                $scope.message = 'No records found.';
            }
        }).catch(function (err) {
            console.warn(err.message);
        });
 
        //$scope.pickPlans = [
        //    {
        //        id: 1,
        //        planDate: 'Feb 7 2018',
        //        pickPlanDetails: [
        //            {
        //                task: 'Mint',
        //                kgTarget: 20,
        //                kgPerHour: 5,
        //                startTime: '6:30',
        //                finishTime: '7:30',
        //                source: 'PH',
        //                pickers: 'JT, Jo, Dave',
        //                notes:'Test'
        //            }]
        //    }
        //];



        $scope.editPickPlan = function (pickPlan) {


            console.log(pickPlan);

            var date = 'Feb 6 2018';


            $scope.isShowDatePlan = false;

            $scope.plan.planDate = new Date(Date.parse(date));


        }


        $scope.openCalendar = function () {
            $scope.status.opened = true;
        };
        $scope.status = {
            opened: false
        };

        var isExist = false;
        $scope.saveDatePlan = function (pickPlan) {

            var ref;

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
                if (pickPlan.$id === undefined) {

                   
                    $scope.pickPlans.$add({
                        planDate: pickPlan.planDate.toDateString()
                }).then(function (ref) {
                         $scope.pickPlan.id = ref.key;
                         $scope.dateTemp = angular.copy($scope.pickPlan.planDate.toDateString());
                         toastr.success('New pickPlan Added Successfully!');
                            console.log($scope.dateTemp);

                        }),
                        function() {
                            toastr.error("Error Adding the Record!");
                        };
                } else {

                    var pckPlan = $scope.pickers.$getRecord(pickPlan.$id);
                    pckPlan.lastName = pickPlan.planDate.toDateString();
                  
                    $scope.pickers.$save(pckPlan).then(function () {
                                toastr.info('pickPlan Updated Successfully!');
                            }),
                        function() {
                            toastr.error("Error Updating the Record!");
                        };
                }
            } else {
                alert("Date already exists!");
                $scope.pickPlan.planDate = new Date(Date.parse($scope.dateTemp));
                console.log($scope.dateTemp);
            }
            return isExist = false;           
        };


        $scope.addRow = function (pickPlan) {



            if (pickPlan === undefined) {
                pickPlan = null;
            };

            $uibModal.open({
                resolve: {
                    pickPlan: pickPlan
                },
                templateUrl: 'App/pick-plan/pick-plan_entry.html',
                controller: 'modalPickPlanCtrl',
                backdrop: 'static'
            }).result.then(function (pickPlanDetail) {

                var ref = firebase.database().ref("pickPlans").child("pickPlanDetails");
                $scope.pickPlanDetails = $firebaseArray(ref);
                $scope.pickPlanDetails.$add({                         
                            task: pickPlanDetail.task,
                            kgTarget: pickPlanDetail.kgTarget,
                            kgPerHour: pickPlanDetail.kgPerHour,
                            source: pickPlanDetail.source,
                            startTime: pickPlanDetail.startTime,
                            finshTime: pickPlanDetail.finshTime,
                            pickers: pickPlanDetail.pickers,
                            notes: pickPlanDetail.notes
                        }).then(function () {
                            toastr.success('New Picker Added Successfully!');
                        })
                        .catch(function (err) {
                            console.warn(err.message);
                        });

            });
        };


        $scope.deletePickPlan = function (pickPlan) {

            $uibModal.open({
                    resolve: {
                        pickPlan: pickPlan
                    },
                    templateUrl: 'App/shared/delete_popup.html',
                    controller: 'modalPickPlanCtrl',
                    backdrop: 'static'
            }).result.then(function (pickPlan) {

                var pckPlan = $scope.pickPlans.$getRecord(pickPlan.$id);
                $scope.pickPlans.$remove(pckPlan);
                })
                .then(function () {
                    toastr.error('PickingPlan Deleted Successfully!');
                })
                .catch(function (err) {
                    console.warn(err.message);
                });
        };
}]);


heavenApp.controller('pickPlanViewCtrl', ['$scope', '$uibModal', '$firebaseArray', 'toastr',
    function ($scope, $uibModal, $firebaseArray, toastr) {




        $scope.pickPlans = [
            {
                id: 1,
                planDate: 'Feb 7 2018',
                pickPlanDetails: [
                    {
                        task: 'Mint',
                        kgTarget: 20,
                        kgPerHour: 5,
                        startTime: '6:30',
                        finishTime: '7:30',
                        source: 'PH',
                        pickers: 'JT, Jo, Dave',
                        notes: 'Test'
                    }]
            }
        ];


 

        $scope.openCalendar = function () {
            $scope.status.opened = true;
        };
        $scope.status = {
            opened: false
        };


    }]);



heavenApp.controller('modalPickPlanCtrl', ['$scope', '$uibModalInstance', 'pickPlan',
    function ($scope, $uibModalInstance, pickPlan) {

        $scope.pickPlan = angular.copy(pickPlan);

        if (pickPlan === null) {
            $scope.headerTitle = 'Add Row';
            $scope.headerColor = 'modal-header modal-header-success';
            $scope.buttonColor = 'btn btn-success';
            $scope.buttonName = 'Add';
        }
        else {
            $scope.headerTitle = 'Edit Row';
            $scope.headerColor = 'modal-header modal-header-primary';
            $scope.buttonColor = 'btn btn-primary';
            $scope.buttonName = 'Update';
        }

        $scope.save = function () {
            $uibModalInstance.close($scope.pickPlan);
        };

        $scope.delete = function () {
            $uibModalInstance.close($scope.pickPlan);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);

