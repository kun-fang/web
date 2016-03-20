/* global angular */
"use strict";
angular.module("doc.service", [])
.factory('fileService', function($http){
    var fileService = {};
    fileService.newFile = function () {
        $http.post("/new").then(function(response) {
            var new_doc = response.data;
        });
    };
});