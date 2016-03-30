/* global angular, $ */
angular.module("doc.controller", ["doc.service", "doc.directive"])
.controller("mainCtrl", ['$scope', function ($scope) {
    $scope.display = {
        showHistory: false,
    };
}])
.controller('docListCtrl', ['$scope', '$state', 'user', 'userData', function($scope, $state, user, userData){
    $scope.user = user;
    $scope.newDocument = function () {
        userData.newDocument().then(function (doc) {
            $scope.user.documents.push(doc);
        });
    };
    $scope.delDocument = function (doc) {
        userData.delDocument(doc).then(function () {
            $state.go("root", {}, {reload:true});
        });
    };
}])
.controller('documentCtrl', ['$scope', 'document', 'userData', function($scope, document, userData){
    $scope.document = document;
    $scope.codeTypes = ['python', 'javascript'];
    $scope.document.type = $scope.codeTypes[0];
    $scope.saveDocument = function () {
        userData.saveDocument($scope.document).then(function (doc) {
            $scope.document = doc;
        });
    };
}])
;
