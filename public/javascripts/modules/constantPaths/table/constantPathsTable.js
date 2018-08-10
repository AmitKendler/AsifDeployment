angular.module('AsifHayir')
	.directive('constantPathsTable', ['$compile', function($compile) {
	  return {
	  	restrict: 'E',
		templateUrl: "/javascripts/modules/constantPaths/table/constantPathsTable.html",
	    link: function(scope, element, attrs) {

		}
	}
}]);
