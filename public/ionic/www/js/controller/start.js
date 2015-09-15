Starter.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {



    var configProperties = {
        views: {
            maxCache: 5,
            forwardCache: true,
            transition: 'android'
        },

        /*    backButton: {
         icon: 'ion-chevron-left',
         text: '返回',
         previousTitleText: false
         },*/

        tabs: {
            style: 'striped',
            position: 'bottom'
        },
        templates: {
            // maxPrefetch: 0
        }
    };
    $ionicConfigProvider.setPlatformConfig('android', configProperties);





    var __routers = RouterManage.get();

    for(var stateName in __routers){
        $stateProvider.state(stateName,__routers[stateName]);
    }


    $stateProvider





        .state('camera', {
            url: '/camera',
            templateUrl: 'templates/example/camera.html',
            controller: 'CameraCtrl'
        })
        //小工具
        .state('exam', {
            url: '/exam',
            templateUrl: 'templates/example/exam.html',
            controller: 'ExamCtrl'
        })
        //




        .state('app.swipecard', {
            url: '/swipecard',
            views: {
                'menuContent': {
                    templateUrl: 'templates/example/swipe-card.html',
                    controller: 'SwipeCardCtrl'
                }
            }
        })


    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

});