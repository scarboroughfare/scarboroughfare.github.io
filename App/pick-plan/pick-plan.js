'use strict';

heavenApp.controller('pickPlanCtrl', ['$scope', '$uibModal', '$firebaseArray', 'toastr',
    function ($scope, $uibModal, $firebaseArray, toastr) {

        var ref = firebase.database().ref().child("PickPlan"); 
        $scope.pickPlans = $firebaseArray(ref);


        $scope.isShowDatePlan = true;

        $scope.showDatePlan = function () {

            $scope.isShowDatePlan = true;
           
        }

        $scope.hideDatePlan = function () {

            $scope.isShowDatePlan = false;
            $scope.pickPlan.PlanDate = "";
            $scope.dateForm.$setPristine();
            $scope.dateForm.$setUntouched();
        }


        $scope.openCalendar = function () {
            $scope.status.opened = true;
        };
        $scope.status = {
            opened: false
        };


        $scope.saveDatePlan = function (pickPlan) {


            var ref;

            if (pickPlan.$id === undefined) {

                ref = firebase.database().ref("PickPlan");
                $firebaseArray(ref).$add({
                    PlanDate: pickPlan.PlanDate.toDateString()
            })
                .then(function() {
                     toastr.success('New PickPlan Added Successfully!');
                 }),
                    function() {
                        toastr.error("Error Adding the Record!");
                    };
            } else {

                ref = firebase.database().ref("PickPlan/" + pickPlan.$id);
                ref.update({
                            FirstName: pickPlan.FirstName,
                            LastName: pickPlan.LastName,
                            NickName: pickPlan.NickName
                        })
                        .then(function() {
                            toastr.info('PickPlan Updated Successfully!');
                        }),
                    function() {
                        toastr.error("Error Updating the Record!");
                    };
            }
            
        };


        $scope.savePickPlan = function (pickPlan) {

            if (pickPlan === undefined) {
                pickPlan = null;
            };

            $uibModal.open({
                resolve: { pickPlan: pickPlan },
                templateUrl: 'App/pick-plan/pick-plan_entry.html',
                controller: 'modalPickPlanCtrl',
                backdrop: 'static'
            }).result.then(function (pickPlan) {

                var ref;

                if (pickPlan.$id === undefined) {

                    ref = firebase.database().ref("PickPlan");
                    $firebaseArray(ref).$add({
                        FirstName: pickPlan.FirstName,
                        LastName: pickPlan.LastName,
                        NickName: pickPlan.NickName
                    })
                    .then(function () {
                        toastr.success('New PickPlan Added Successfully!');
                     }),
                    function () {
                        toastr.error("Error Adding the Record!");
                    };
                }
                else {

                    ref = firebase.database().ref("PickPlan/" + pickPlan.$id);
                    ref.update({
                        FirstName: pickPlan.FirstName,
                        LastName: pickPlan.LastName,
                        NickName: pickPlan.NickName
                    })
                    .then(function () {
                         toastr.info('PickPlan Updated Successfully!');
                    }),
                    function () {
                        toastr.error("Error Updating the Record!");
                    };
                }      
            });
        };

        $scope.deletePickPlan = function (index) {

            $uibModal.open({
                resolve: { pickPlan: index },
                templateUrl: 'App/shared/delete_popup.html',
                controller: 'modalPickPlanCtrl',
                backdrop: 'static'        
            }).result.then(function (index) {

                var pickPlan = $scope.pickPlans[index];
                $scope.pickPlans.$remove(pickPlan);
             })
            .then(function () {
                toastr.error('PickPlan Deleted Successfully!');
             }),
             function () {
                 toastr.error("Error Deleting the Record!");
             };
        };
}]);



heavenApp.controller('modalPickPlanCtrl', ['$scope', '$uibModalInstance', 'pickPlan',
    function ($scope, $uibModalInstance, pickPlan) {

        $scope.pickPlan = angular.copy(pickPlan);

        if (pickPlan === null) {
            $scope.headerTitle = 'Add PickPlan';
            $scope.headerColor = 'modal-header modal-header-success';
            $scope.buttonColor = 'btn btn-success';
            $scope.buttonName = 'Save';
        }
        else {
            $scope.headerTitle = 'Edit PickPlan';
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

