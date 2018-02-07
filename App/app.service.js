heavenApp.service('heavenService', ['$firebaseArray', '$q', function ($firebaseArray, $q) {

    //Get Picker List
    this.getPickers = function () {
        var pickers = $firebaseArray(firebase.database().ref().child('pickers'));
        return $q.when(pickers);          
    };

    //Get PickerPlan List
    this.getPickPlans = function () {
        var pickPlans = $firebaseArray(firebase.database().ref().child('pickPlans'));
        return $q.when(pickPlans);
    };


}]);


