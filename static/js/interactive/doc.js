/* global angular */

angular.module("interactiveApp", ["doc.codearea", "socket.io"])
.config(['$socketProvider', function($socketProvider) {
    $socketProvider.connect('/doc_edit');
}])
.controller('interactiveCtrl', ['$scope', '$socket', '$window', '$timeout', '$interval', 'codeAreaService',
function ($scope, $socket, $window, $timeout, $interval, codeAreaService) {
    $scope.init = function (room, name, email) {
        $scope.model = {};
        $scope.model.room = {name: room};
        $scope.model.email = email;
        $scope.model.name = name;
        $scope.model.codeTypes = ['python', 'javascript'];
        $scope.model.type = $scope.model.codeTypes[0];
        $scope.model.getUpdate = false;
        $socket.join('/doc_edit', $scope.model.room.name);
    };

    $socket.on('join', function (data) {
        $scope.model.room.users = data.users;
        $scope.model.room.version = data.version;
        $scope.model.text = data.text;
    });

    $socket.on('leave', function (data) {
        $scope.model.room.users = data.users;
    });

    $socket.on('update_text', function (data) {
        if (data.from !== $scope.model.email && data.version > $scope.model.room.version) {
            $scope.model.getUpdate = true;
            $scope.model.text = data.text;
        }
        $scope.model.room.version = data.version;
        codeAreaService.markClean();
    });

    $scope.updateDocument = function () {
        if (!codeAreaService.isClean()) {
            $socket.emit("update_text", {
                text: $scope.model.text,
                room: $scope.model.room.name,
                version: $scope.model.room.version + 1
            });
        }
    };

    $scope.$watch('model.text', function (newVal, oldVal) {
        if (newVal !== oldVal && !$scope.model.getUpdate) {
            if ($scope.autoSave) {
                $timeout.cancel($scope.autoSave);
            }
            $scope.autoSave = $timeout(function () {
                $scope.updateDocument();
            }, 500);
            $scope.model.getUpdate = false;
        }
    });

    $window.onbeforeunload = function () {
        $socket.leave('/doc_edit', $scope.model.room.name);
    };

    $scope.$on('$destroy', function () {
        $timeout.cancel($scope.autoSave);
    });

}]);