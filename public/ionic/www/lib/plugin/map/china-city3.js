angular.module('china-city', [])
    .directive('chinaCity', [
        '$ionicTemplateLoader',
        '$ionicBackdrop',
        '$q',
        '$timeout',
        '$rootScope',
        '$document','$http',
        function($ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $document,$http) {

            return {
                require: 'ngModel',
                restrict: 'E',
                template: '<input type="text" readonly="readonly" class="china-city" autocomplete="off">',
                replace: true,
                link: function(scope, element, attrs, ngModel) {
                    scope.CityList = [];


                    ngModel.rnd = Date.now();

                    var POPUP_TPL = [
                        '<div class="china-city-container">',
                            '<div class="bar bar-header bar-dark ">',
                                ' <h1 class="title">选择城市</h1>',

                                '<button class="button button-clear">',
                                    '取消',
                                '</button>',
                            '</div>',
                            '<ion-content class="has-header has-header">',
                                '<div class="list china-city-list" ><div ng-repeat="Province in CityList">',
                                    '<div class="item item-divider">{{Province.n}}</div>',
                                    '<div class="item">',
                                    ' <a  ng-click="selectLocation(City,Province.n)" ng-repeat="City in Province.cities"  >',
                                        '{{City.n}}',
                                    '</a>',
                                    '</div>',
                                '</div></div>',
                            '</ion-content>',
                        '</div>'
                    ].join('');

                    var popupPromise = $ionicTemplateLoader.compile({
                        template: POPUP_TPL,
                        scope: scope,
                        appendTo: $document[0].body
                    });

                    popupPromise.then(function(el){

                        scope.selectLocation = function(location,province){
                            location.formatAddress =  province+location.n;
                            ngModel.$setViewValue(location);
                            ngModel.$render();
                            el.element.css('display', 'none');
                            $ionicBackdrop.release();
                        };

                        scope.CityList = CityJSON;


                        var onClick = function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            $ionicBackdrop.retain();
                            el.element.css('display', 'block');

                        };

                        var onCancel = function(e){

                            $ionicBackdrop.release();
                            el.element.css('display', 'none');
                        };

                        element.bind('click', onClick);
                        element.bind('touchend', onClick);

                        el.element.find('button').bind('click', onCancel);

                        ngModel.$formatters.unshift(function (modelValue) {
                            if (!modelValue) return '';
                            return modelValue;
                        });

                        ngModel.$parsers.unshift(function (viewValue) {

                            return viewValue;
                        });

                        ngModel.$render = function(){
                            console.log(arguments);
                            console.log(this);
                            if(!ngModel.$viewValue){
                                element.val('');
                            } else {
                                console.log(ngModel.$viewValue);
                                element.val(ngModel.$viewValue.n || '');
                            }
                        };
                    });




                }
            };
        }
    ]);