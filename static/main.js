/**
*  Module
*
* Description
*/
/* global angular */
"use strict";

angular.module('docApp', ["ui.router"]).config(function ($stateProvider) {
    $stateProvider.state("login", {
        url: "/login",
        templateUrl: "login.html",
    }).state("logout", {
        url: "/logout",
        templateUrl: "logout.html",
    }).state("document", {
        url: "/doc/:name",
        templateUrl: "document.html"
    }).state("document.history", {
        url: "/doc/:name/history/:ts",
        templateUrl: "document.html"
    });
})
.controller("mainCtrl", function ($scope, $state) {
    console.log($state);
})
;