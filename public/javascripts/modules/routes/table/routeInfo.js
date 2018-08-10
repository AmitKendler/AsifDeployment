angular.module('AsifHayir')
	.directive('routeInfo', ['VolunteersService', 'DonationsService', 'RoutesService', '$http', 
	function(VolunteersService, DonationsService, RoutesService, $http) {
	  return {
	  	restrict: 'E',
	  	scope: {
			route: '='
	    },
		templateUrl: "/javascripts/modules/routes/table/routeInfo.html",
	    link: function(scope, element, attrs) {
			
			scope.$on("setRouteInfo", function(event, route) {
				scope.route = route;
				scope.init();
			});

			scope.init = function () {
				scope.setUIRouteStatus();
				scope.loadDonations();
			}

			scope.loadDonations = function () {

				var donationsIds = [];
				scope.route.paths.forEach(path => {
					donationsIds = donationsIds.concat(Object.keys(path.donations));
				})

				DonationsService.getDonationsByIds(donationsIds).then(function (res) {
					scope.routeDonations = res.data;

					scope.onChangePath(0);
				});
			}

			scope.getDonationsForPath = function (pathIndex) {

				var pathDonations = [];
				var pathDonationsIds = scope.route.paths[pathIndex].donations;

				scope.routeDonations.forEach(routeDonation => {
					// Check if the current route donation belong to this path
					if (pathDonationsIds[routeDonation._id]) {
						var productsIds = pathDonationsIds[routeDonation._id];
						pathDonations = pathDonations.concat(DonationsService.flatDonationWithProducts(routeDonation, productsIds));
					}
				})

				return pathDonations;
			}

			scope.onChangePath = function (pathIndex) {
				scope.currentTabIndex = pathIndex;							
				scope.donations = scope.getDonationsForPath(pathIndex);
			}

			scope.getVolunteerName = function(id) {

				if (!id) return "טרם נבחר";
				
				if (scope.volunteers) {
					// Find the volunteer by its id
					var volunteer = scope.volunteers.find((v) => v._id == id);
					return (volunteer.firstName + " " + volunteer.lastName);
				}
			}

			scope.loadVolunteers = function () {
				if (!scope.volunteers) {
					VolunteersService.getVolunteers().then(function (res) {
						scope.volunteers = res.data;
					});
				}
			}

			scope.getAllProductsOfRoute = function () {
				var productsIds = [];
				scope.route.paths.forEach(path => {
					for (var key in path.donations) {
						productsIds = productsIds.concat(path.donations[key])
					}
				});

				return productsIds;
			}

			scope.startRoute = function () {

				var routeProductIds = scope.getAllProductsOfRoute();

				$http.put(`/products/status`, {
					productIds: routeProductIds,
					status: "PENDING"
				})
				.then(function(res) {
					
					// Update the status on the donations array so the table will be refreshed	
					scope.donations.forEach(d => {
						d.product.status = "PENDING";
					});
					scope.$broadcast("updateDonations", scope.donations);

					// Update route status
					scope.route.status = "STARTED";
					RoutesService.updateRoute(scope.route).then(function(res) {
						scope.setUIRouteStatus(); 
					});
				})
			}

			scope.setUIRouteStatus = function () {
				var html;
				if (scope.route.status == "STARTED") {
					html = "יצאנו לדרך!";
					scope.startedRoute = true;
				}
				else if (scope.route.status == "FINISHED") {
					html = "המסלול הסתיים בהצלחה";
					scope.startedRoute = true;
				} else {
					html = "צא לדרך";
					scope.startedRoute = false;
				}

				$("#btnStartRoute i").html(html);
			}

			scope.loadVolunteers();
			scope.init();
		}
	}
}]);