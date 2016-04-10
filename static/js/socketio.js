/* global angular, io */
angular.module("socket.io", [])
.provider("$socket", [function () {
    var socket;
    this.connect = function (namespace) {
        socket = io.connect(namespace);
    };

    this.$get = ['$timeout', function ($timeout) {
        var socketio = {};
        socketio.on = function (namespace, callback) {
            socket.on(namespace, function (data) {
                $timeout(function () {
                    callback(data);
                });
            });
        };
        socketio.emit = function (namespace, obj) {
            socket.emit(namespace, obj);
        };
        return socketio;
    }];
}]);