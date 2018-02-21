'use strict';

heavenApp.config(["$routeProvider",
    function ($routeProvider) {

        $routeProvider

            .when("/login", {
                templateUrl: "App/account/login.html",
                controller: "accountCtrl"
            })

            .when("/register", {
                templateUrl: "App/account/register.html",
                controller: "accountCtrl"
            })

            .when("/picker", {
                templateUrl: "App/picker/picker.list.html",
                controller: "pickerCtrl"
            })

            .when("/task", {
                templateUrl: "App/task/task.list.html",
                controller: "taskCtrl"
            })

            .when("/source", {
                templateUrl: "App/source/source.list.html",
                controller: "sourceCtrl"
            })

            .when("/plan", {
                templateUrl: "App/pick.planner/pick.planner.list.html",
                controller: "pickPlanCtrl"
            })

            .when("/about", {
                templateUrl: "App/home/about.html",
                controller: "homeCtrl"
            })

            .when("/contact", {
                templateUrl: "App/home/contact.html",
                controller: "homeCtrl"
            })


            .when("/home", {
                templateUrl: "App/pick.planner/pick.planner.list.html",
                controller: "pickPlanCtrl"
            })

            .when("/pickertask", {
                templateUrl: "App/picker.task/picker.task.list.html",
                controller: "pickerTaskCtrl"
            })

            .otherwise({
                redirectTo: "/home"

            });

    }]);