'use strict';

heavenApp.config(["$routeProvider",
    function ($routeProvider) {

        $routeProvider

            .when("/picker", {
                templateUrl: "App/picker/picker-list.html",
                controller: "pickerCtrl"
            })

            .when("/task", {
                templateUrl: "App/task/task-list.html",
                controller: "taskCtrl"
            })

            .when("/source", {
                templateUrl: "App/source/source-list.html",
                controller: "sourceCtrl"
            })

            .when("/plan", {
                templateUrl: "App/pickplan/pickplan-list.html",
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
                templateUrl: "App/pickplan/pickplan-list.html",
                controller: "pickPlanCtrl"
            })

            .otherwise({
                redirectTo: "/home"

            });

    }]);