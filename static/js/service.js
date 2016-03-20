/* global angular */
"use strict";
angular.module("doc.service", [])
.factory('userData', function($q, $http){
    var userData = undefined;

    var getUser = function () {
        var deferred = $q.defer()
        if (userData) {
            deferred.resolve(userData);
        } else {
            $http.get("/user_data").then(function (response) {
                userData = response.data
                deferred.resolve(userData);
            }, function (response) {
                deferred.reject(response);
            });
        }
        return deferred.promise;
    };

    var newDocument = function () {
        var deferred = $q.defer();
        $http.post("/new_doc").then(function (response) {
            var doc = response.data;
            userData = undefined;
            deferred.resolve(doc);
        }, function (response) {
            deferred.reject(doc);
        });
        return deferred.promise;
    };

    var getDocument = function (name, user) {
        var deferred = $q.defer();
        var helper = function (user) {
            for (var i = 0; i < user.documents.length; i += 1) {
                if (user.documents[i].name === name) {
                    console.log(user.documents[i])
                    return user.documents[i]
                }
            }
            return undefined;
        }
        if (user) {
            deferred.resolve(helper(user));
        } else {
            getUser().then(function (user) {
                deferred.resolve(helper(user));
            }, function (response) {
                deferred.reject(response);
            });
        }
        return deferred.promise;
    };

    return {
        getUser: getUser,
        newDocument: newDocument,
        getDocument: getDocument,
    };
})