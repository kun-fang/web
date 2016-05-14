/* global angular, CodeMirror */
angular.module("doc.codearea", [])

.service("codeAreaService", function () {
    var codeAreaService = {};
    codeAreaService.setCodeArea = function (obj) {
        codeAreaService.codeArea = obj;
    };
    codeAreaService.isClean = function () {
        return codeAreaService.codeArea.isClean();
    };
    codeAreaService.markClean = function () {
        codeAreaService.codeArea.markClean();
    };
    return codeAreaService;
})

.directive("codeArea", function (codeAreaService) {
    var link = function (scope, element) {

        scope.cmObj = CodeMirror.fromTextArea(element[0], {
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            mode: scope.type,
            theme: 'solarized light'
        });
        codeAreaService.setCodeArea(scope.cmObj);
        angular.element(".CodeMirror").css({
            'height': "500px",
            'border': "1px solid #ccc",
            '-webkit-border-radius': "5px",
            '-moz-border-radius': "5px",
            'border-radius': "5px",
        });
        scope.cmObj.doc.setValue(scope.text || "");
        scope.cmObj.markClean();
        scope.cmObj.on('change', function (instance) {
            scope.$evalAsync(function () {
                scope.text = instance.getValue();
            });
        });

        scope.$watch("type", function (newVal, oldVal) {
            if (newVal !== oldVal && newVal) {
                scope.cmObj.setOption('mode', newVal);
            }
        });

        scope.$watch("text", function (newVal, oldVal) {
            if (newVal !== oldVal && newVal && newVal !== scope.cmObj.getValue()) {
                var cursor = scope.cmObj.getCursor("head");
                scope.cmObj.setValue(newVal);
                scope.cmObj.setCursor(cursor);
            }
        });
    };
    return {
        restrict: 'AE',
        template: '<textarea id="codearea" class="form-control" ng-model="text" rows=20></textarea>',
        replace: true,
        scope: {
            text: "=",
            type: "@",
        },
        link: link
    };
});