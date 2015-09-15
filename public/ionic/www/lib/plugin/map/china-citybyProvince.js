window.rnd = 0;

angular.module('china-city', [])
    .directive('chinaCity', [
        '$ionicTemplateLoader',
        '$ionicBackdrop',
        '$q',
        '$timeout',
        '$rootScope',
        '$document', '$http', '$compile',
        function ($ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $document, $http, $compile) {


            function linkFn(scope1, element1, attrs1, ngModel1) {

                var scope = scope1;
                var element = element1;
                var attrs = attrs1;
                var ngModel = ngModel1;


                return function () {
                    window.rnd++;


                    scope.rnd = window.rnd;
                    ngModel.rnd = window.rnd;

                    var POPUP_TPL = [
                        '<div class="china-city-container">',

									'<div class="bar bar-header  bar-dark item-input-inset">',
                                '<label class="item-input-wrapper">',
                                    '<i class="icon ion-ios7-search placeholder-icon"></i>',
                                    '<input class="google-place-search" type="search" ng-model="searchQuery" placeholder="输入城市名或拼音">',
                                '</label>',
                                '<button class="button button-clear">',
                                    '取消',
                                '</button>',
                            '</div>',
                            '<div scroll="false" class="has-header right-list" id="rightList" on-release="onRelease()">',
                                '<div on-release="onRelease()" on-drag="onDrag()" on-touch="onDrag()" ng-repeat="value in rightList">{{value}}</div>',
                            '</div>',
                            '<ion-content class="has-header has-header">',

                                '<div class="list china-city-list" >' +
                                '<div class="item item-divider">当前位置</div>',
                                '<div class="item">上海</div>',
                                '<div class="item item-divider">历史</div>',
                                '<div class="item">上海</div>',
                                '<div class="item">北京</div>',
                                '<div class="item">南京</div>',

                                '<div ng-repeat="Province in CityList">',
                                    '<div class="item item-divider">{{Province.n}}</div>',
                                    '<div class="item" ng-click="selectLocation(City,Province.n)" ng-repeat="City in Province.cities">',

                                        '{{City.n}}',

                                    '</div>',
                                '</div></div>',
                            '</ion-content>',
                        '</div>'
                    ].join('');


                    scope.CityList = CityJSON;
                    scope.rightList = CityPinyinIndex;
                    var $popElement = angular.element('<div>').html(POPUP_TPL).contents();

                    scope.selectLocation = function (location, province) {

                        location.formatAddress = province + location.n;
                        ngModel.$setViewValue(location);
                        ngModel.$render();
                        $popElement.css('display', 'none');
                        $ionicBackdrop.release();
                    };
                    ngModel.$render = function () {


                        if (!ngModel.$viewValue) {
                            element.val('');
                        } else {
                            element.val(ngModel.$viewValue.n || '');
                        }
                    };
                    angular.element($document[0].body).append($popElement);

                    $compile($popElement)(scope);


                    $popElement.find('button').bind('click', function (e) {

                        $ionicBackdrop.release();
                        $popElement.css('display', 'none');
                    });
                    var onClick = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $ionicBackdrop.retain();

                        $popElement.css('display', 'block');

                    };

                    element.bind('click', onClick);
                    element.bind('touchend', onClick);


                }
            }


            return {
                require: 'ngModel',
                restrict: 'E',
                scope: true,

                template: '<input type="text" readonly="readonly" class="china-city" autocomplete="off">',
                replace: true,
                link: function (scope, element, attrs, ngModel) {
                    (new linkFn(scope, element, attrs, ngModel))();
                }
            };
        }
    ]);