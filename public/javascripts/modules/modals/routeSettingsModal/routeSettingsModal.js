angular.module('AsifHayir')
	.directive('routeSettingsModal', ['VolunteersService','RoutesService', '$http', function(VolunteersService, RoutesService, $http) {
	  return {
	  	restrict: 'E',
		templateUrl: "/javascripts/modules/modals/routeSettingsModal/routeSettingsModal.html",
	    link: function(scope, element, attrs) {

			scope.saveSettings = function () {

				if (scope.validateSettings()) {

					// Set the new settings
					scope.route = scope.routeCopy;

					RoutesService.updateRoute(scope.route).then(function(res) {
						// Close the modal
						$("#routeSettingsModal").modal("hide");
					});
				}
			}

			// Validate that the driver and his helper are not the same man
			scope.validateSettings = function () {

				var bIsValid = true;
				$("form select").removeClass("invalid-input");

				scope.routeCopy.paths.forEach((path, i) => {					
					if (angular.isDefined(path.driver) && angular.isDefined(path.helper) &&
						path.driver == path.helper) {
						bIsValid = false;
						$("form select:eq(" + i*2 + ")").addClass("invalid-input");
						$("form select:eq(" + (i*2 + 1) + ")").addClass("invalid-input");
					}
				});

				scope.routeSettingsForm.$setValidity("settings", bIsValid);
				return bIsValid;
			}

			scope.volunteerLabel = function (v) {
				return v.firstName + " " + v.lastName;
			}

			scope.loadVolunteers = function () {
				if (!scope.volunteers) {
					VolunteersService.getVolunteers().then(function (res) {
						scope.volunteers = res.data;
					});
				}
			}

			scope.loadVolunteers();

			// Create a copy of the route because we don't want to bind
			// the new settings until the user click "save"
			$("#routeSettingsModal").on("show.bs.modal", function () {
				scope.$apply(function () {
					scope.routeCopy = angular.copy(scope.route);
				})				
			});
        }
    }
}]);