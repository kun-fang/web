/**
*  Module
*
* Description
*/
/* global angular */
"use strict";

angular.module('docApp', ["ui.router", "doc.controller", "doc.directive", "doc.service"])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('root', {
        resolve: {
            user: function (userData) {
                return userData.getUser();
            }
        },
        views: {
            "": {
                template: "<div ui-view></ui-view>",
            },
            "list": {
                templateUrl: "/template/doc_list.html",
                controller: "docListCtrl",
            }
        }
    }).state("root.blank", {
        url: "/",
        views: {
            "main@": {
                template: "<label>Select a File or Create a New File</label>",
            }
        }
    }).state("root.document", {
        url: "/doc/:name",
        resolve: {
            document: function (user, userData, $stateParams) {
                console.log("here", $stateParams.name, user);
                return userData.getDocument($stateParams.name, user);
            }
        },
        views: {
            "main@": {
                templateUrl: "/template/document.html",
                controller: "documentCtrl",
            }
        }
    }).state("root.document.history", {
        url: "/doc/:name/history/:ts",
        templateUrl: "/template/document.html"
    });
})
.controller("mainCtrl", function ($scope) {
    $scope.docWidth = function () {
        return "col-sm-9";
    };
    $scope.$on("NewUser", function (event, user) {
        $scope.user = user;
    });
})