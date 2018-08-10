angular.module("AsifHayir").factory('ConstantPathsService', function($http) {
    return {
        getPaths: function() {
            return $http.get('/getConstantPaths')
        },
        addPath: function(path) {
            return $http.post('/addConstantPath', path);
        },
        updatePath: function(path) {
            return $http.put(`/updateConstantPath/${path._id}`, path);
        },
        deletePath: function(pathId) {
            return $http.delete(`/deleteConstantPath/${pathId}`);
        }
    };
});