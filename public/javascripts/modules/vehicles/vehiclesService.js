angular.module("AsifHayir").factory('VehiclesService', function($http, $q) {
    return {
        getVehicles: function() {
            return $http.get('/getVehicles')
        },
        addVehicle: function(vehicle) {
            return $http.post('/addVehicle', vehicle);
        },
        updateVehicle: function(vehicle) {
            return $http.put(`/updateVehicle/${vehicle._id}`, vehicle);
        },
        deleteVehicle: function(vehicleId) {
            return $http.delete(`/deleteVehicle/${vehicleId}`);
        }
    };
});