/**
*  Module
*
* Description
*/
/* global angular */
angular.module('docApp', ["ui.router", "doc.controller", "doc.directive", "doc.service"])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state("root", {
        url: "/",
        resolve: {
            user: function (userData) {
                return userData.getUser();
            }
        },
        views: {
            "main": {
                template: "<label>Select a File or Create a New File</label>",
            },
            "list": {
                templateUrl: "/template/doc_list.html",
                controller: "docListCtrl",
            }
        }
    }).state("root.document", {
        url: "doc/:name",
        resolve: {
            document: function (userData, $stateParams) {
                return userData.getDocument($stateParams.name);
            }
        },
        views: {
            "main@": {
                templateUrl: "/template/document.html",
                controller: "documentCtrl",
            }
        }
    }).state("root.history", {
        url: "doc/:name/history/:ts",
        resolve: {
            document: function (userData, $stateParams) {
                return userData.getHistoryDocument($stateParams.name, $stateParams.ts);
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