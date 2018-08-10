angular.module("AsifHayir").factory('VolunteersService', function($http, $q) {
    return {
        getVolunteers: function() {
            return $http.get('/getVolunteers');      
        },
        addVolunteer: function(volunteer) {
            volunteer.isVolunteer = true;
            return $http.post('/addUser', volunteer);
        },
        updateVolunteer: function(volunteer) {
            return $http.put(`/updateUser/${volunteer._id}`, volunteer);
        },
        deleteVolunteer: function(volunteerId) {
            return $http.delete(`/deleteUser/${volunteerId}`);
        }
    };
});