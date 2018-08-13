var app = angular.module("AsifHayir");
const messaging = firebase.messaging();
// Add the public key generated from the console here.
messaging.usePublicVapidKey("BMd7sZp5XN1Tbn1c8K2ynoxrbC9sXnj5MQxoupB-FuKu756cm70tkOzYRN1umuNdCYO1TaTjEn08lAcfkGdRmJ8");

app.factory("UserAuth", function($q, $timeout) {
    var deferred = $q.defer();
    return {
        finish: function() {
            deferred.resolve();
        },
        userIsReady: function() {
            // var deferred = $q.defer();
            // $timeout(function(){
            //     deferred.resolve("Allo!");
            // },2000);
            return deferred.promise;
        }
    }
});

// app.factory("Auth", ["$firebaseAuth",
//   function($firebaseAuth) {
// //       // Initialize Firebase
// //     var config = {
// //         apiKey: "AIzaSyCLjvInkTICWVDqRKx7HcGztQD--pI0mEE",
// //         authDomain: "leftright-2e5de.firebaseapp.com",
// //         databaseURL: "https://leftright-2e5de.firebaseio.com",
// //         projectId: "leftright-2e5de",
// //         storageBucket: "leftright-2e5de.appspot.com",
// //         messagingSenderId: "371521623116"
// //     };
// //     firebase.initializeApp(config);

// //     return $firebaseAuth();
// return {};
//   }
// ]);

app.controller("AuthCtrl", function($scope, $location, /* Auth,*/ $http, $timeout, UserAuth) {

    // any time auth state changes, add the user data to scope
    firebase.auth().onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser != null) $scope.afterLogin(firebaseUser);
        else {
            $('#loginModal').modal('show');
        }
    });

    $scope.onLogin = function() {
        ($scope.newUser) ? $scope.register(): $scope.login();
    }

    $scope.setToken = function(token) {
        $http.defaults.headers.common['auth-token'] = token;
    }

    $scope.afterLogin = function(user) {
        // messaging.requestPermission()
        // .then(function() {
        //     console.log('Notification permission granted.');

        //     return user.getIdToken(true);
        // })
        // .then(function(idToken) {
        //     $scope.setToken(idToken);

        //     // Get Instance ID token. Initia    lly this makes a network call, once retrieved
        //     // subsequent calls to getToken will return from cache.
        //     return messaging.getToken();
        // })
        // .then(function(currentToken) {
        //     if (currentToken) {
        //         sendTokenToServer(currentToken);

        //         UserAuth.finish();
        //         $('#loginModal').modal('hide');

        //         $timeout(function(){ 
        //             if (!location.hash.split("/")[1]) {
        //                 $location.path('/donations');
        //                 // $('header nav a[href^="#!/donations"]').addClass('active');
        //             }
        //         },1);
        //     } else {
        //         throw new Error("problem with push token"); 
        //     }
        // })
        // .then(function () {


        //     // updateUIForPushEnabled(currentToken);
        // }).catch(function(err) {
        //     console.log('An error occurred while retrieving token. ', err);
        //     // showToken('Error retrieving Instance ID token. ', err);
        //     // setTokenSentToServer(false);
        // });

        // // Callback fired if Instance ID token is updated.
        // messaging.onTokenRefresh(function() {
        //     messaging.getToken().then(function(refreshedToken) {
        //         console.log('Token refreshed.');
        //         // Indicate that the new Instance ID token has not yet been sent to the
        //         // app server.
        //         // setTokenSentToServer(false);
        //         // Send Instance ID token to app server.
        //         sendTokenToServer(refreshedToken);
        //         // ...
        //     }).catch(function(err) {
        //         console.log('Unable to retrieve refreshed token ', err);
        //         // showToken('Unable to retrieve refreshed token ', err);
        //     });
        // });
        user.getIdToken(true).then(function(idToken) {
            $scope.setToken(idToken);
            UserAuth.finish();
            $('#loginModal').modal('hide');

            $timeout(function() {
                if (!location.hash.split("/")[1]) {
                    $location.path('/donations');
                    // $('header nav a[href^="#!/donations"]').addClass('active');
                }
            }, 1);
        });
    }

    $scope.login = function() {
        firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
            // messaging.requestPermission().then(function() {
            //     console.log('Notification permission granted.');
            //     // Get Instance ID token. Initially this makes a network call, once retrieved
            //     // subsequent calls to getToken will return from cache.
            //     messaging.getToken().then(function(currentToken) {
            //         if (currentToken) {
            //             sendTokenToServer(currentToken);
            //             // updateUIForPushEnabled(currentToken);
            //         } else {
            //         // Show permission request.
            //         console.log('No Instance ID token available. Request permission to generate one.');
            //             // Show permission UI.
            //             // updateUIForPushPermissionRequired();
            //             // setTokenSentToServer(false);
            //         }
            //     }).catch(function(err) {
            //         console.log('An error occurred while retrieving token. ', err);
            //         // showToken('Error retrieving Instance ID token. ', err);
            //         // setTokenSentToServer(false);
            //     });
            //   }).catch(function(err) {
            //     console.log('Unable to get permission to notify.', err);
            //   });

            // // Callback fired if Instance ID token is updated.
            // messaging.onTokenRefresh(function() {
            //     messaging.getToken().then(function(refreshedToken) {
            //         console.log('Token refreshed.');
            //         // Indicate that the new Instance ID token has not yet been sent to the
            //         // app server.
            //         // setTokenSentToServer(false);
            //         // Send Instance ID token to app server.
            //         sendTokenToServer(refreshedToken);
            //         // ...
            //     }).catch(function(err) {
            //         console.log('Unable to retrieve refreshed token ', err);
            //         // showToken('Unable to retrieve refreshed token ', err);
            //     });
            // });              
        }, function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    }

    $scope.register = function() {
        firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
            $scope.error = error;
        });
    }

    $scope.logout = function() {
        firebase.auth().signout();
    }

    function sendTokenToServer(token) {
        $http.post('/user/volunteer/push-token', { token: token });
    }
});