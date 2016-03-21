/* global angular */
angular.module("doc.controller", ["doc.service"])
.controller('documentCtrl', function($scope, name){
    
})
.controller('loginCtrl', function($scope, fileService){
    $scope.login = function () {
        fileService.login($scope.email).then(function (user) {
            $scope.$emit("NewUser", user);
        });
    }
})