/* global angular */
angular.module("doc.controller", ["doc.service"])
.controller('docListCtrl', ['$scope', 'user', 'userData', function($scope, user, userData){
    $scope.user = user;
    $scope.newDocument = function () {
        userData.newDocument().then(function (doc) {
            $scope.user.documents.push(doc);
        });
    };
}])
.controller('documentCtrl', ['$scope', 'document', function($scope, document){
    console.log(document);
    $scope.document = document;
}])

;