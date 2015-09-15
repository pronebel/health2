Starter.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    var configProperties = {
        views: {
            maxCache: 5,
            forwardCache: true,
            transition: 'android'
        },

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

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});