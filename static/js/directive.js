/* global angular */
angular.module("doc.directive", ["doc.service"])

.directive("docHistory", function () {
    return {
        restrict: 'A',
        templateUrl: '/template/doc_history.html'
    }
})