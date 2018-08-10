/**
 * Created by ziv-private on 12/11/17.
 */
var app = angular.module("AsifHayir", ["ngRoute", "firebase", "ngAlertify"]);
app.config(function($routeProvider, $httpProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
  
    var reolveRoute = function(tab) {
        return {
            currentAuth: function(UserAuth) {
                setTimeout(function() {
                    $('header nav a[href^="#/'+ tab + '"]').addClass('active');
                }, 1);

                return UserAuth.userIsReady();
            }
        }
    };

    $routeProvider    
        .when("/donations", {
            templateUrl : "javascripts/modules/donations/screen/donationsScreen.html",
            controller: 'donations',
            resolve: reolveRoute("donations")
        })
        .when("/constantPaths", {
            templateUrl : "javascripts/modules/constantPaths/screen/constantPathsScreen.html",
            controller: 'constantPaths',
            resolve: reolveRoute("constantPaths")
        })   
        .when("/vehicles", {
            templateUrl : "javascripts/modules/vehicles/screen/vehiclesScreen.html",
            controller: 'vehicles',
            resolve: reolveRoute("vehicles")
        })    
        .when("/volunteers", {
            templateUrl : "javascripts/modules/volunteers/screen/volunteersScreen.html",
            controller: 'volunteers',
            resolve: reolveRoute("volunteers")
        })    
        .when("/statistics", {
            templateUrl : "javascripts/modules/statistics/statistics.html",
            controller: 'statistics',
            resolve: reolveRoute("statistics")
        })   
        .when("/routes", {
            templateUrl : "javascripts/modules/routes/screen/routesScreen.html",
            controller: 'routes',
            resolve: reolveRoute("routes")
        })    
        .when("/findv", {
            templateUrl : "javascripts/modules/findv/findv.html",
            controller: 'findv',
            resolve: reolveRoute("findv")
        }) 
        .when("/photolabels", {
            templateUrl : "javascripts/modules/photolabels/photolabels.html",
            controller: 'photolabels',
            resolve: reolveRoute("photolabels")
        })           
        .otherwise({
            redirectTo : "/"
        });
});

$(function() {
    // Set the active class to the current tab
    $('header nav a[href^="#!/' + location.hash.split("/")[1] + '"]').addClass('active');

    // Remove this class when clicking another tab
    $("header nav a").click(function() {
        $("header nav a.active").removeClass("active");
    });
});