'use strict';

/* directives */
angular.module('app').directive('ngConfirm', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                var message = attrs.ngConfirmMessage || 'Are you sure?';
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngConfirm);
                }
            });
        }
    }
}]);

angular.module('app').directive('remoteValidator', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        priority: 5,
        require: ['ngModel', '?^remoteValidatorClues'],
        link: function (scope, elm, attr, ctrls) {
            var expfn = $parse(attr["remoteValidatorFunction"]);
            var validatorName = attr["remoteValidator"];
            var modelCtrl = ctrls[0];
            var clueCtrl = ctrls[1];
            modelCtrl.$parsers.push(function (value) {
                var result = expfn(scope, { 'value': value });
                if (result.then) {
                    if (clueCtrl) clueCtrl.showClue();
                    result.then(function (data) { //For promise type result object
                        console.log('hiding spinner');
                        if (clueCtrl) clueCtrl.hideClue();
                        modelCtrl.$setValidity(validatorName, data);
                    }, function (error) {
                        console.log('hiding spinner');
                        if (clueCtrl) clueCtrl.hideClue();
                        modelCtrl.$setValidity(validatorName, true);
                    });
                }
                return value;
            });
        }
    }
}]);

angular.module('app').directive('updateOnBlur', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: '100',
        link: function (scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;
            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function () {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
});

angular.module('app').directive('remoteValidatorClues', ['$compile', '$animate', function ($compile, $animate) {
    return {
        scope: true,
        transclude: true,
        template: '<div><div ng-transclude=""></div><label ng-show="busy" class="text-info three-quarters">checking...</label></div>',
        link: function (scope, element, attr) {
            $animate.enabled(false, element)
        },
        controller: ['$scope', function ($scope) {
            this.showClue = function () { $scope.busy = true; }
            this.hideClue = function () { $scope.busy = false; }
        }]

    }
}]);

angular.module('app').directive('ajaxButton', ['$compile', '$animate', function ($compile, $animate) {
    return {
        transclude: true,
        restrict:'E',
        scope: {
            onClick: '&',
            submitting:'@'
        },
        template: '<span><span class="glyphicon glyphicon-refresh spin" ng-show="submitting"></span><span ng-transclude=""></span></span>',
        link: function (scope, element, attr) {
            if (attr.onClick) {
                element.on('click', function (event) {
                    scope.$apply(function () { 
                        var result = scope.onClick();
                        if (attr.submitting) return;    //submitting attribute if there takes priority
                        if (result.finally) {
                            scope.submitting = true;
                            result.finally(function () { scope.submitting = false });
                        }
                    });
                });
            }
        },
        controller: ['$scope', function ($scope) {
        }]

    }
}]);