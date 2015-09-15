RouterManage.add({

    'login': {
        url: '/login',
        templateUrl: 'js/base/view/auth/login.html',
        controller: 'AuthCtrl'
    },

    'tutorial': {
        url: '/tutorial',
        templateUrl: 'js/base/view/help/tutorial.html',
        controller: 'TutorialCtrl'
    },
    'load': {
        url: '/load',
        templateUrl: 'js/base/view/help/load.html',
        controller: 'LoadCtrl'
    },


});