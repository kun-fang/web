/* global angular */
angular.module("doc.service", [])
.factory('userData', function($q, $http){

    var getUser = function () {
        var deferred = $q.defer();
        $http.get("/user_data").then(function (response) {
            deferred.resolve(response.data);
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    var newDocument = function () {
        var deferred = $q.defer();
        $http.post("/new_doc").then(function (response) {
            deferred.resolve(response.data);
        }, function (response) {
            deferred.reject(doc);
        });
        return deferred.promise;
    };

    var delDocument = function (doc) {
        return $http.post("/del_doc", {doc: doc});
    };

    var getDocument = function (name) {
        var deferred = $q.defer();

        var helper = function (user) {
            for (var i = 0; i < user.documents.length; i += 1) {
                if (user.documents[i].name === name) {
                    return user.documents[i];
                }
            }
            return undefined;
        };

        getUser().then(function (user) {
            deferred.resolve(helper(user));
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    var getHistoryDocument = function (name, ts) {
        var deferred = $q.defer();
        $http.post('/get_history', {
            name: name,
            ts: ts
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    var saveDocument = function (document) {
        var deferred = $q.defer();
        $http.post('/save_doc/' + document.name, {
            text: document.text
        }).success(function (doc) {
            deferred.resolve(doc);
        }).error(function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
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
