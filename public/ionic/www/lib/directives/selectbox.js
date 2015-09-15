angular.module('$selectBox', []).
    directive('selectBox', function () {

        var _compile = function ($element, $attrs) {

            var input = $element.find('input');

            angular.forEach({
                'name': $attrs.name,
                'placeholder': $attrs.ngPlaceholder,
                'ng-model': $attrs.ngSelectedText
            }, function (value, name) {
                if (angular.isDefined(value)) {
                    input.attr(name, value);
                }
            });

            if (angular.isDefined($attrs.ngSelectedValue)) {
                $element.attr('ng-model', $attrs.ngSelectedValue);
            }
        }
        var _ctrl =  function ($scope, $element, $attrs, $ionicModal, $parse) {
            $scope.modal = {};

            var ngItemText = $attrs.ngItemText || "name";
            var ngItemValue = $attrs.ngItemValue || "value";


            $scope.showSelectModal = function () {
                var val = $parse($attrs.ngData);
                $scope.data = val($scope);

                $scope.modal.show();
            };

            $scope.closeSelectModal = function () {
                $scope.modal.hide();
            };

            $scope.$on('$destroy', function (id) {
                $scope.modal.remove();
            });

            $scope.modal = $ionicModal.fromTemplate(
                '<ion-modal-view id="select">' +
                    '<ion-header-bar>' +
                        '<h1 class="title">' + $attrs.ngTitle + '</h1>' +
                        ' <a ng-click="closeSelectModal()" class="button button-icon icon ion-close"></a>' +
                    '</ion-header-bar>' +
                    '<ion-content>' +
                        '<ion-list>' +
                            '<ion-item  ng-click="clickItem(item)" ng-repeat="item in data" ng-bind-html="item[\'' + ngItemText + '\']">' +
                            '</ion-item>' +
                        '</ion-list>' +
                    '</ion-content>' +
                '</ion-modal-view>', {
                scope: $scope,
                animation: 'slide-in-right'
            });

            $scope.clickItem = function (item) {

                var index = $parse($attrs.ngSelectedValue);
                index.assign($scope.$parent, item[ngItemValue]);

                var value = $parse($attrs.ngSelectedText);
                value.assign($scope.$parent, item[ngItemText]);

                $scope.closeSelectModal();
            };
        }
        return {
            restrict: 'E',
            replace:true,
            scope:true,
            require: ['ngModel', 'ngData', 'ngSelectedText', 'ngSelectedValue', '?ngTitle', 'ngItemText', 'ngItemValue'],
            template: '<span><input type="text" ng-click="showSelectModal()"  />' + '</span>',
            controller:_ctrl,
            compile:_compile
        };
    });