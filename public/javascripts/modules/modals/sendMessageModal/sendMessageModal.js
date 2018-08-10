angular.module('AsifHayir')
	.directive('sendMessageModal', ['$http','alertify', function($http, alertify) {
	  return {
	  	restrict: 'E',
        templateUrl: "/javascripts/modules/modals/sendMessageModal/sendMessageModal.html",
	    link: function(scope, element, attrs) {

			scope.sendMessage = function (message) {
                $http.post(`/user/sendMessage`, {
					message: message,
					userId: scope.userId
				})
				.then(function(res) {
                    alertify.logPosition("bottom right");
                    alertify.success('ההודעה נשלחה בהצלחה');
                });
            }

            $("#sendMessageModal").on("show.bs.modal", function (e) {
                $('#msgContent')[0].value = "";
                scope.userId = $(e.relatedTarget).data('user-id');
			});
        }
    }
}]);