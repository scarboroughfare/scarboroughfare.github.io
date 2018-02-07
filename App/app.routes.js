'use strict';

heavenApp.config(["$routeProvider",
    function ($routeProvider) {

        $routeProvider

            .when("/picker", {
                templateUrl: "App/picker/picker.html",
                controller: "pickerCtrl"
            })
            .when("/plan", {
                templateUrl: "App/pick-plan/pick-plan.html",
                controller: "pickPlanCtrl"
            })
            .when("/plan/view", {
                templateUrl: "App/pick-plan/pick-plan_view.html",
                controller: "pickPlanViewCtrl"
            })

            .when("/about", {
                templateUrl: "Home/About",
                controller: ""
            })

            .when("/contact", {
                templateUrl: "Home/Contact",
                controller: ""
            })


            .when("/home", {
                templateUrl: "App/pick-plan/pick-plan.html",
                controller: "pickPlanCtrl"
            })

            .otherwise({
                redirectTo: "/home"

            });

    }]);