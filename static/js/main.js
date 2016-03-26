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
        url: "/history/:ts",
        resolve: {
            document: function (user, userData, $stateParams) {
                return userData.getHistoryDocument($stateParams.name, $stateParams.ts, user);
            }
        },
        views: {
            "main@": {
                templateUrl: "/template/document.html",
                controller: "documentCtrl",
            }
        }
    });
});