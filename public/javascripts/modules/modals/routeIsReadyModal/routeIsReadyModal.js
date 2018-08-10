angular.module('AsifHayir')
	.directive('routeIsReadyModal', ['DonationsService', function(DonationsService) {
	  return {
	  	restrict: 'E',
		templateUrl: "/javascripts/modules/modals/routeIsReadyModal/routeIsReadyModal.html",
	    link: function(scope, element, attrs) {

			scope.toDateFormat = function (date) {
				return moment(new Date(date)).format("DD/MM/YYYY");
			}
        }
    }
}]);