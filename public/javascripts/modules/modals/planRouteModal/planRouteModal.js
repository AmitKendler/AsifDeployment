angular.module('AsifHayir')
	.directive('planRouteModal', ['DonationsService', '$http', function(DonationsService, $http) {
	  return {
	  	restrict: 'E',
        templateUrl: "/javascripts/modules/modals/planRouteModal/planRouteModal.html",
        scope: {
            donations:'='
        },
	    link: function(scope, element, attrs) {
            var startPointAutocomplete, endPointAutocomplete;

            scope.getLatLng = function (donation) {
                var loc = donation.address.location.coordinates;
                return new google.maps.LatLng(loc[0], loc[1]);
            }

            scope.getPointByPlace = function (autocompleteObject) {
                var place = autocompleteObject.getPlace();        
                var x = place.geometry.location.lng();
                var y = place.geometry.location.lat();
                return new google.maps.LatLng(y, x);
            }

            // scope.setPointByPlace = function (elementId) {
            //     var place = startPointAutocomplete.getPlace();        
            //     var x = place.geometry.location.lng();
            //     var y = place.geometry.location.lat();
            //     scope[elementId] = new google.maps.LatLng(y, x);
            // }
        
              // Bias the autocomplete object to the user's geographical location,
              // as supplied by the browser's 'navigator.geolocation' object.
              scope.geolocate = function() {
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
                    startPointAutocomplete.setBounds(circle.getBounds());
                    endPointAutocomplete.setBounds(circle.getBounds());
                  });
                }
              }

            scope.initGeoAutocompletes = function () {
                // Create the autocomplete object, restricting the search to geographical
                // location types.
                startPointAutocomplete = scope.getGoogleAutocompleteObject("startPoint");
                endPointAutocomplete = scope.getGoogleAutocompleteObject("endPoint");
        
                // When the user selects an address from the dropdown, populate the address
                // fields in the form.
                // startPointAutocomplete.addListener('place_changed', () => scope.setPointByPlace("startPoint"));
                // endPointAutocomplete.addListener('place_changed', () => scope.setPointByPlace("endPoint"));
              }

            scope.getGoogleAutocompleteObject = function (elementId) {
                return new google.maps.places.Autocomplete(
                    /** @type {!HTMLInputElement} */(document.getElementById(elementId)),
                    {types: ['geocode']});
            }

            scope.planRoute = function (date) {

                var routeDonations = scope.getDonationsForAlgo();

                var directionsService = new google.maps.DirectionsService;

                var wayPoints = routeDonations.map(point => {
                    return {
                        location: scope.getLatLng(point),
						stopover: true
                    }
                });

				directionsService.route({
                    origin: scope.getPointByPlace(startPointAutocomplete),
                    destination: scope.getPointByPlace(endPointAutocomplete),
					waypoints: wayPoints,
					optimizeWaypoints: true,
					travelMode: 'DRIVING'
					}, function(response, status) {
					if (status === 'OK') {

                        scope.route = {
                            date: moment(date, "DD/MM/YYYY").toDate(),
                            paths: [
                            {
                                geocoded_waypoints: response.geocoded_waypoints,
                                routes: response.routes,
                                request: response.request,
                                donations: scope.mapDonationsAndProductsIds(routeDonations)
                            }
                        ]};

                        $http.post('/addRoute', scope.route).then(function (res) {
                            
                             scope.route = res.data;

                            $("#planRouteModal").modal("hide");
                            $('#routeIsReadyModal').modal('show');   
                        });
                                 
					} else {
						window.alert('Directions request failed due to ' + status);
					}
                    });
            }

            scope.mapDonationsAndProductsIds = function (donations) {
                var relevantDonations = {};
                donations.forEach(donation => {
                    if (!relevantDonations[donation._id]) relevantDonations[donation._id] = [];
                    relevantDonations[donation._id].push(donation.product._id);           
                });

                return relevantDonations;
            }

            scope.getDonationsForAlgo = function (date) {
                return scope.donations.filter(donation => {
                    // TODO
                    // && currDonation.date == date 
                    return (donation.includeInAlgorithm);                  
                });
            }          
            
            scope.initGeoAutocompletes();
		}
	}
}]);