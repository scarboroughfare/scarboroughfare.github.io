heavenApp.service('heavenService', ['$firebaseArray', '$q', function ($firebaseArray, $q) {

    this.getPickers = function () {
        var pickers = $firebaseArray(firebase.database().ref().child('pickers'));
        return $q.when(pickers);          
    };

    this.getTasks = function () {
        var tasks = $firebaseArray(firebase.database().ref().child('tasks'));
        return $q.when(tasks);
    };

    this.getSources = function () {
        var sources = $firebaseArray(firebase.database().ref().child('sources'));
        return $q.when(sources);
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


