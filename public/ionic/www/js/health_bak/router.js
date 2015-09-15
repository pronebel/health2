RouterManage.add({


    // setup an abstract state for the tabs directive
    'app':{
        url: "/app",
        abstract: true,
        templateUrl: "js/health/main/index_tab.html"

    },
    'app.index': {
        url: "/index",
        views: {
            'index-tab': {
                templateUrl: "js/health/main/index.html",
                controller:'indexCtrl'
            }
        }
    },
    'app.record': {
        url: "/record",
        views: {
            'record-tab': {
                templateUrl: "js/health/record/index.html",
                //controller:'indexCtrl'
            }
        }
    },
    'app.supply': {
        url: "/supply",
        views: {
            'supply-tab': {
                templateUrl: "js/health/supply/index.html",
                //controller:'indexCtrl'
            }
        }
    },



    'profile': {
        url: "/profile",
        abstract: true,
        templateUrl: "js/health/profile/menu.html"
    },
    'profile.my': {
        url: '/my',
        views: {
            'menuContent': {
                templateUrl: 'js/health/profile/main.html',
                controller: 'ProfileMainCtrl'
            }
        }

    },
    'profile.basic': {
        url: '/basic',
        views: {
            'menuContent': {
                templateUrl: 'js/health/profile/basicInfo.html',
                controller: 'ProfileMainCtrl'
            }
        }

    },


    'launch': {
        url: "/",
        templateUrl: "js/health/main/launch.html",
        controller: 'LaunchCtrl'
    }



});