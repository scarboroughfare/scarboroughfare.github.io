heavenApp.service('heavenService', ['$firebaseArray', '$q', function ($firebaseArray, $q) {

    this.getPickers = function () {
        var pickers = $firebaseArray(firebase.database().ref().child('pickers'));
        return $q.when(pickers);          
    };

    this.getPickPlans = function () {
        var pickPlans = $firebaseArray(firebase.database().ref().child('pickPlans'));
        return $q.when(pickPlans);
    };

    this.getPickPlanDetails = function () {
        var pickPlanDetails = $firebaseArray(firebase.database().ref().child('pickPlanDetails'));
        return $q.when(pickPlanDetails);
    };

}]);


