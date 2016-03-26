/* global angular */
angular.module("doc.controller", ["doc.service"])
.controller("mainCtrl", function ($scope) {
    $scope.display = {
        showHistory: false,
    };
})
.controller('docListCtrl', ['$scope', 'user', 'userData', function($scope, user, userData){
    $scope.user = user;
    $scope.newDocument = function () {
        userData.newDocument().then(function (doc) {
            $scope.user.documents.push(doc);
        });
    };
    $scope.delDocument = function (doc) {
        userData.delDocument(doc).then(function () {
            for (var i = 0; i < $scope.user.documents.length; i += 1) {
                if ($scope.user.documents[i].document_id === doc.document_id) {
                    $scope.user.documents.splice(i, 1);
                    break;
                }
            }
        });
    };
}])
.controller('documentCtrl', ['$scope', 'document', 'userData', function($scope, document, userData){
    $scope.document = document;
    $scope.saveDocument = function () {
        userData.saveDocument($scope.document).then(function (response) {
            $scope.document = response.data;
        });
    };
}])
;
