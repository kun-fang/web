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

    var delDocument = function (doc) {
        return $http.post("/del_doc", {doc: doc});
    };

    var getDocument = function (name, user) {
        var deferred = $q.defer();
        var helper = function (user) {
            for (var i = 0; i < user.documents.length; i += 1) {
                if (user.documents[i].name === name) {
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

    var getHistoryDocument = function (name, ts, user) {
        var deferred = $q.defer();
        getDocument(name, user).then(function (document) {
            $http.post('/get_history', {
                email: user.email,
                document: document,
                ts: ts
            }).then(function (response) {
                deferred.resolve(response.data)
            }, function (response) {
                deferred.reject(response);
            });
        });
        return deferred.promise;
    };

    var saveDocument = function (document) {
        return $http.post('/save_doc/' + document.name, {
            text: document.text
        });
    };

    return {
        getUser: getUser,
        newDocument: newDocument,
        getDocument: getDocument,
        getHistoryDocument: getHistoryDocument,
        saveDocument: saveDocument,
        delDocument: delDocument,
    };
})
;
