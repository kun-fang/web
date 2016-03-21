/**
*  Module
*
* Description
*/
/* global angular */
"use strict";

angular.module('docApp', ["ui.router", "doc.controller", "doc.directive", "doc.service"])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('main');
    $stateProvider.state("main", {
        url: "/",
        template: "<label>Select a File or Create a New File</label>"
    }).state("document", {
        url: "/doc/:name",
        templateUrl: "/template/document.html",
        controller: "documentCtrl"
    }).state("document.history", {
        url: "/doc/:name/history/:ts",
        templateUrl: "/template/document.html"
    });
})
.controller("mainCtrl", function ($scope, $state) {
    console.log($state);
    $scope.docWidth = function () {
        return "col-sm-9";
    };
    $scope.$on("NewUser", function (event, user) {
        $scope.user = user;
    });
})
;