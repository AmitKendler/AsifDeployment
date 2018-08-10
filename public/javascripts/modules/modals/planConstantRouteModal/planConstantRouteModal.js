angular.module('AsifHayir')
	.directive('planConstantRouteModal', ['DonationsService', '$http', 'ConstantPathsService', function(DonationsService, $http, ConstantPathsService) {
	  return {
	  	restrict: 'E',
        templateUrl: "/javascripts/modules/modals/planConstantRouteModal/planConstantRouteModal.html",
        scope: {
            donations:'='
        },
	    link: function(scope, element, attrs) {

            ConstantPathsService.getPaths().then(function (res) {
                scope.constantPaths = res.data;        
            });

            scope.getLatLng = function (donation) {
                var loc = donation.address.location.coordinates;
                return new google.maps.LatLng(loc[0], loc[1]);
            }

            scope.planRoute = function (date, constantPath) {

                var routeDonations = scope.getDonationsForAlgo();

                var directionsService = new google.maps.DirectionsService;

                var wayPoints = routeDonations.map(don => {
                    return {
                        location: scope.getLatLng(don),
						stopover: true
                    }
                });

                var startPoint = constantPath.points[0];
                var lastPoint = constantPath.points[constantPath.points.length - 1];
                
				directionsService.route({
                    origin: new google.maps.LatLng(startPoint.y, startPoint.x),
                    destination: new google.maps.LatLng(lastPoint.y, lastPoint.x),
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

                            $("#planConstantRouteModal").modal("hide");
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
		}
	}
}]);