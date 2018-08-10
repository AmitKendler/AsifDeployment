angular.module("AsifHayir").factory('DonationsService', function($http, $q) {
    return {
        flatDonationWithProducts: function (givaway, productsIdsOptional) {
            var donations = [];

            givaway.products.forEach((product, index) => {
                if (!productsIdsOptional || (productsIdsOptional && 
                    productsIdsOptional.indexOf(product._id) != -1)) {

                    var donation = angular.copy(givaway);
                    delete donation.products;
                    donation.product = product;
                    donations.push(donation);
                }
            });

            return donations;
        },
        getDonations: function() {
            return $http.get('/giveaways');
        },
        getDonationsByIds: function(ids) {
            return $http.post('/getGiveawaysByIds', ids);          
        }
    };
});