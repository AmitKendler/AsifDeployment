angular.module('AsifHayir')
    .directive('donationsTable', ['$compile', function($compile) {
        return {
            restrict: 'E',
            scope: {
                donations: '=',
                hideCheckboxes: '='
            },
            templateUrl: "/javascripts/modules/donations/table/donationsTable.html",
            link: function(scope, element, attrs) {

                // scope.columnWidth = scope.hideCheckboxes ? "13%" : "11%";

                scope.$on("updateDonations", function(e, donations) {
                    scope.donations = donations;
                });

                scope.tableColumns = [{
                        label: "סטטוס",
                        getValue: function(row) { return scope.getStatusLabel(row.product.status); },
                        width: "10%",
                        className: "status"
                    },
                    {
                        label: "סוג",
                        getValue: function(row) { return scope.getTypeLabel(row.product.prodType); },
                        width: "6%"
                    },
                    {
                        label: "תרומה",
                        getValue: "product.name",
                        width: "11%"
                    },
                    {
                        label: "תיאור",
                        getValue: "product.description",
                        width: "10%"
                    },
                    {
                        label: "כתובת לאיסוף",
                        getValue: function(row) { return scope.getAddressLabel(row.address); },
                        width: "12%"
                    },
                    {
                        label: "זמין מ",
                        getValue: function(row) { return scope.getTimeLabel(row.pickupTime.startTime); },
                        width: "16%"
                    },
                    {
                        label: "זמין עד",
                        getValue: function(row) { return scope.getTimeLabel(row.pickupTime.endTime); },
                        width: "16%"
                    }
                ];

                scope.getValue = function(column, row) {
                    return (typeof(column.getValue) == "string") ? scope.getNestedValue(row, column.getValue) :
                        column.getValue(row);
                }

                scope.getNestedValue = function(object, property) {

                    var obj = angular.copy(object);
                    var properties = property.split(".");
                    properties.forEach(x => obj = obj[x]);

                    return obj;
                }

                scope.TYPE_ENUM = {
                    FOOD: "אוכל",
                    CLOTHES: "ביגוד",
                    FURNITURE: "ריהוט"
                };

                scope.STATUS_ENUM = {
                    NEW: "חדש",
                    PENDING: "ממתין לאיסוף",
                    TAKEN: "נלקח"
                };

                scope.getTypeLabel = function(type) {
                    return scope.TYPE_ENUM[type];
                }

                scope.getStatusLabel = function(status) {
                    return scope.STATUS_ENUM[status];
                }

                scope.getAddressLabel = function(pickupAddress) {
                    return pickupAddress.streetName + " " + pickupAddress.houseNumber + ", " + pickupAddress.city;
                }

                scope.getTimeLabel = function(pickupTime) {
                    return scope.stringToDate(pickupTime);
                }

                scope.stringToDate = function(dateString) {
                    return moment(new Date(dateString)).format("DD/MM/YYYY HH:mm:ss");
                }

                scope.openSendMessageModal = function(userId) {

                    // scope.userIdForMessage = userId;
                    $("#sendMessageModal").modal("show");
                }
            }
        }
    }]);

angular.module('AsifHayir').directive('popoverContactDetails', function($compile) {
    return {
        restrict: 'E',
        scope: {
            contact: "="
        },
        link: function(scope, element, attrs) {
            scope.definePopover = function() {

                // var popoverId = scope.getPopoverIdByType();

                $(element).popover({
                    title: "פרטי איש קשר",
                    trigger: "hover",
                    container: 'body',
                    html: true,
                    placement: "right",
                    content: $compile($("#contactInfo").html())(scope)
                });

                $(element).on("show.bs.popover", function() {
                    var popover = $($(this).data("bs.popover").tip);
                    popover.css("maxWidth", "170px");
                    popover.css("height", "110px");
                });
            }

            scope.definePopover();
        }
    }
});

angular.module('AsifHayir').directive('popoverProductImage', function($compile) {
    return {
        restrict: 'E',
        scope: {
            product: "="
        },
        link: function(scope, element, attrs) {
            scope.definePopover = function() {

                // var popoverId = scope.getPopoverIdByType();

                $(element).popover({
                    title: "תמונה",
                    trigger: "hover",
                    container: 'body',
                    html: true,
                    placement: "right",
                    content: $compile($("#productImage").html())(scope)
                });

                $(element).on("show.bs.popover", function() {
                    var popover = $($(this).data("bs.popover").tip);
                    popover.css("maxWidth", "170px");
                    popover.css("height", "170px");
                });
            }

            scope.definePopover();
        }
    }
});

angular.module('AsifHayir').directive('popoverAdvancedDetails', function($compile) {
    return {
        restrict: 'E',
        scope: {
            product: "=",
            type: "="
        },
        link: function(scope, element, attrs) {

            scope.AMOUNT_TYPE_ENUM = {
                ITEMS: "פריטים",
                KG: "ק''ג",
                LITRE: "ליטר",
                PORTIONS: "חלקים"
            };

            scope.getAmountTypeLabel = function(amountUnits) {
                return scope.AMOUNT_TYPE_ENUM[amountUnits];
            }

            scope.definePopover = function() {

                var popoverId = scope.getPopoverIdByType();

                $(element).popover({
                    title: "פרטים נוספים",
                    trigger: "hover",
                    container: 'body',
                    html: true,
                    placement: "right",
                    content: $compile($("#" + popoverId).html())(scope)
                });
            }

            scope.getPopoverIdByType = function() {

                switch (scope.type) {
                    case "FOOD":
                        return "foodPopover";
                    case "CLOTHES":
                        return "clothingPopover";
                    case "FURNITURE":
                        return "furniturePopover";
                    default:
                        return "";
                }
            }

            scope.getIconClass = function(key, valueForSuccess) {
                return (scope.product[key] == valueForSuccess) ? 'fa fa-check success-icon' : 'fa fa-times danger-icon';
            }

            scope.definePopover();
        }
    }
});