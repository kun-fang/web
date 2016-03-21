/* global angular */
angular.module("doc.directive", ["doc.service"])

.directive("docHistory", function () {
    return {
        restrict: 'A',
        templateUrl: '/template/doc_history.html'
    }
})

.directive("docList", function (fileService) {
    var link = function (scope, element, attrs) {
        scope.fileList = scope.fileList || [];
        scope.newDocument = function () {
            fileService.newDocument(scope.email).then(function (doc) {
                scope.fileList.push(doc);
            });
        };
    };
    return {
        restrict: 'A',
        templateUrl: '/template/doc_list.html',
        replace: true,
        scope: {
            fileList: "=list",
            email: "="
        },
        link: link,
    }
})