angular.module("AsifHayir").factory('RoutesService', function($http, $q) {
    return {
        getRoutes: function() {
            return $http.get('/getRoutes');
        },
        updateRoute: function(route) {
            return $http.put(`/updateRoute/${route._id}`, route);
        },
        deleteRoute: function(routeId) {
            return $http.delete(`/deleteRoute/${routeId}`);
        }
    };
});