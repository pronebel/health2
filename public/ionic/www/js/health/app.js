/**
 * Created by rollandlee on 4/22/15.
 */

var Starter = angular.module('starter',
    [
        'ionic',
        'starter.controllers',
        'starter.services',
        'LocalStorageModule',
        '$selectBox',
        'ngMaterial',
        'ngCordova'
    ])

Starter.config(function($compileProvider){
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

});

Starter.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

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
var Starter_Services = angular.module('starter.services', ['ngResource']);


function onJPushNotification(event) {
    console.log("PUSH NOTIFICATION");
    console.log(event);
}

var onOpenNotification = function(event){
    try{
        var alertContent
        if(device.platform == "Android"){
            alertContent=window.plugins.jPushPlugin.openNotification.alert;
        }else{
            alertContent   = event.aps.alert;
        }
        console.log(alertContent);
        console.log("open Notificaiton:");
        console.log(event);

    }
    catch(exception){
        console.log("JPushPlugin:onOpenNotification"+exception);
    }
}

var onReceiveMessage = function(event) {
    try{
        var message = window.plugins.jPushPlugin.receiveMessage.message;
        //var extras = window.plugins.jPushPlugin.extras
        console.log("RECIEVE MESSAGE");
        console.log(event);
        console.log(window.plugins.jPushPlugin.receiveMessage);

    }
    catch(exception){
        console.log("JPushPlugin:onReceiveMessage-->"+exception);
    }
}

var onGetRegistradionID = function(data) {
    try{
        console.log("JPushPlugin:registrationID is "+data);
    }
    catch(exception){
        console.log(exception);
    }
}

document.addEventListener("deviceready", function() {
    window.plugins.jPushPlugin.init();
    window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);

    if(device.platform == "Android"){
        window.plugins.jPushPlugin.setDebugModeFromIos();
        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
    }else{
        window.plugins.jPushPlugin.setDebugMode(true);
    }



    document.addEventListener("jpush.receiveNotification", onJPushNotification, false);
    document.addEventListener("jpush.openNotification", onOpenNotification, false);
    document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);

    var domElement = document.body;
    angular.bootstrap(domElement, ["starter"]);
}, false);