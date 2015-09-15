
var Starter = angular.module('starter',
    [
        'ionic', 'ionic.contrib.ui.cards',
        'starter.controllers',
        'starter.services',
        'ion-google-place',
        'china-city',
        'LocalStorageModule',
        'baiduMap',
        'ionic.contrib.frostedGlass'
    ])

Starter.config(function($compileProvider){
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })

Starter.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});



var RouterManage = (function(){
    var __router = {};

    return {
        add:function(routerJson){
            angular.extend(__router,routerJson);
        },
        get:function(){
            return __router;
        }
    }
})();


var Starter_Controller = angular.module('starter.controllers', []);
var Starter_Services = angular.module('starter.services', ['ngResource'])
