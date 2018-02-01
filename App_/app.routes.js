'use strict';

heavenApp.config(["$routeProvider",
    function ($routeProvider) {

        $routeProvider

            .when("/picker", {
                templateUrl: "app/picker/picker.html",
                controller: "pickerCtrl"
            })
     

            .when("/about", {
                templateUrl: "Home/About",
                controller: ""
            })

            .when("/contact", {
                templateUrl: "Home/Contact",
                controller: ""
            })


            .when("/home/", {
                templateUrl: "app/picker/picker.html",
                controller: "pickerCtrl"
            })

            .otherwise({
                redirectTo: "/home"

            });

    }]);