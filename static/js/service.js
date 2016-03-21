/* global angular */
"use strict";
angular.module("doc.service", [])
.factory('fileService', function($http, $q){
    var fileService = {};

    var deferData = function (promise, func) {
        var deferred = $q.defer(),
            func = func || function (item) {return item;};
        promise.then(function (response) {
            deferred.resolve(func(response.data));
        }, function (response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    };

    fileService.newDocument = function (email) {
        return deferData($http.post("/new_doc", {email: email}));
    };

    fileService.getFileList = function (name) {
        $http.get("/json/documents")
    };

    fileService.login = function (email) {
        return deferData($http.post("/login", {email: email}));
    }

    return fileService;
})
.factory('userData', function($q, fileService){
    var userData = {};
    var getUser = function (email) {
        deferred = $q.defer()
        if (userData && userD) {
            deferred.resolve(userData);
        } else {
            fileService.login(email).then(function (response) {
                userData = response.data;
                deferred.resolve(userData);
            }, function (response) {
                deferred.reject(response);
            });
        }
        return deferred.promise;
    };
    var getDocument = function (email, name) {
        deferred = $q.defer();
        getUser.then(function (user) {
            user.documents.forEach(function(doc) {
                if (doc.name === name) {
                    deferred.resolve(doc);
                }
            });
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }
    return {
        getUser: getUser
    };
})