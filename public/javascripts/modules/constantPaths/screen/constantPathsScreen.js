angular.module("AsifHayir").controller("constantPaths", function ($scope, ConstantPathsService,$timeout) {
    
    ConstantPathsService.getPaths().then(function (res) {
        $scope.constantPaths = res.data;        
    });

    $scope.onOpenDialog = function (constantPath) {
        $scope.path = (constantPath) ? angular.copy(constantPath) : {points:[]};
        $scope.geoPoints = [];

        if (constantPath) {
            setTimeout(() => {
                constantPath.points.forEach(point => $scope.getPlaceByCoords(point));
            }, 10);
            // $scope.getPlaceByCoords(constantPath.points[0]);
        }
    }

    $scope.addConstantPath = function() {

        $scope.setPoints();

        ConstantPathsService.addPath($scope.path).then(function () {
            ConstantPathsService.getPaths().then(function (res) {
                $scope.constantPaths = res.data;
            })
        })
    }

    $scope.updateConstantPath = function () {

        $scope.setPoints();
        
        // Find the index of the path we want to update
        var pathToUpdateIndex = $scope.constantPaths.findIndex(path => path._id == $scope.path._id);

        // Update the path
        ConstantPathsService.updatePath($scope.path).then(function () {
            $scope.constantPaths[pathToUpdateIndex] = $scope.path;
        })
    }

    $scope.deleteConstantPath = function (index) {
        ConstantPathsService.deletePath($scope.constantPaths[index]._id).then(function () {
            $scope.constantPaths.splice(index, 1)
        })
    }

    $scope.getPlaceByCoords = function (coordinate) {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(coordinate.y, coordinate.x);
        geocoder.geocode({
            // 'latLng': latlng
            placeId: coordinate.placeId
          }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                var place = results[0];
                var newPointId = "point-" + $scope.geoPoints.length;

                $timeout(function () {
                    $scope.geoPoints.push({});
                    $scope.$apply();
                    var newPoint = $scope.getGoogleAutocompleteObject(newPointId);
                    newPoint.set("place", place);
                    $scope.geoPoints[$scope.geoPoints.length - 1] = newPoint;
                }, 1); 
                
              } else {
                console.error('No results found for: ' + coordinate);
              }
            } else {
                console.error('Geocoder failed due to: ' + status + ". for coord " + coordinate);
            }
          });
    }

    $scope.setPoints = function () {
        // var place = point.getPlace();        
        // var x = place.geometry.location.lng();
        // var y = place.geometry.location.lat();
        // scope[elementId] = new google.maps.LatLng(y, x);

        $scope.path.points = [];
        $scope.geoPoints.forEach(point => {
            var place = point.getPlace();        
            $scope.path.points.push({
                x: place.geometry.location.lng(),
                y: place.geometry.location.lat(),
                placeId: place.place_id
            });
        });

    }

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    $scope.geolocate = function(index) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            $scope.geoPoints[index].setBounds(circle.getBounds());
            });
        }
    }

    $scope.getGoogleAutocompleteObject = function (elementId) {
        return new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById(elementId)),
            {types: ['geocode']});
    }

    $scope.addPoint = function () {
        var newPointId = "point-" + $scope.geoPoints.length;
        

        $timeout(function () {
            $scope.geoPoints.push({});
            $scope.$apply();
            var newPoint = $scope.getGoogleAutocompleteObject(newPointId);
            $scope.geoPoints[$scope.geoPoints.length - 1] = newPoint;
        }, 1);
    }
});