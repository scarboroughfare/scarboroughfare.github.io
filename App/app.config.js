//For Popup Toaster Config
heavenApp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
});


//Initialize the Firebase SDK
heavenApp.config(function () {

    var config = {
        apiKey: "AIzaSyDDR0N4N6hKb4X_r7-BvGVRtPgTMaFvbUg",
        authDomain: "heaven-dev-db.firebaseapp.com",
        databaseURL: "https://heaven-dev-db.firebaseio.com",
        projectId: "heaven-dev-db",
        storageBucket: "heaven-dev-db.appspot.com",
        messagingSenderId: "917810951004"
    };
    firebase.initializeApp(config);

});


