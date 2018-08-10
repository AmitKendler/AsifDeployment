angular.module("AsifHayir").controller("donations", function ($scope, DonationsService, alertify) {
    
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })

    DonationsService.getDonations().then(function (res) {
        $scope.donations = [];

        res.data.forEach(givaway => {
            $scope.donations = $scope.donations.concat(DonationsService.flatDonationWithProducts(givaway));
        });
    });   

    $scope.openPlanRouteModal = function () {
        $scope.openModal("planRouteModal");
    }

    $scope.openPlanConstantRouteModal = function () {
        $scope.openModal("planConstantRouteModal");
    }

    $scope.openModal = function(modalId) {
        var relevantDonations = $scope.donations.filter(donation => donation.includeInAlgorithm);

        if (relevantDonations.length == 0) {
            alertify.logPosition("bottom right");
            alertify.error('שים לב: יש לבחור לפחות תרומה אחת');

        }
        else $("#" + modalId).modal("show");
    }
});