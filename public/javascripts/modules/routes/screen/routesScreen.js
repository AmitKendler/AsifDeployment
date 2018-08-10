angular.module("AsifHayir").controller("routes", function ($scope, RoutesService) {
    
    RoutesService.getRoutes().then(function (res) {        
        $scope.routes = res.data;
        $scope.routeIndex = 0;

        $scope.route = $scope.routes[0];        

        $(".screen-content").css("marginRight", "130px");
    });

    $scope.setRoute = function(routeIndex){
      $scope.routeIndex = routeIndex;
      $scope.route = $scope.routes[routeIndex];

      $scope.$broadcast("setRouteInfo", $scope.route);
    };

    $scope.deleteRoute = function () {
        RoutesService.deleteRoute($scope.route._id).then(function () {
            $scope.routes.splice($scope.routeIndex, 1)
            $scope.setRoute(0);
        })
    }
    
    /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
    $scope.openNav = function () {
        $("#sidenavOpen").addClass("show");
        $("#sidenavClose").removeClass("show");
        $(".screen-content").css("marginRight", "130px");
    }

    /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
    $scope.closeNav = function () {
        $("#sidenavOpen").removeClass("show");
        $("#sidenavClose").addClass("show");
        $(".screen-content").css("marginRight", "50px");
    }    

    $scope.toDateFormat = function (route) {
        return moment(new Date(route.date)).format("DD/MM/YYYY");
    }
});