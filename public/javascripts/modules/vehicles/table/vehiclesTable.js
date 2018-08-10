angular.module('AsifHayir')
	.directive('vehiclesTable', ['$compile', function($compile) {
	  return {
	  	restrict: 'E',
		templateUrl: "/javascripts/modules/vehicles/table/vehiclesTable.html",
	    link: function(scope, element, attrs) {
		}
	}
}]);
