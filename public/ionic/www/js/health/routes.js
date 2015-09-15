/**
 * Created by rollandlee on 4/22/15.
 */
RouterManage.add({
    // setup an abstract state for the tabs directive
    "index":{
        url:"/",
        controller:"generalLanding"
    },
    "landing": {
        url: "/landing",
        controller:"generalLanding"
    },
    "introduction" :{
        url: "/introduction",
        controller:"introduction",
        templateUrl:"js/health/landing/tplIntroduction.html"
    },
    "main": {
        url: "/main",
        templateUrl:"js/health/main/tplMain.html",
        abstract:true,
        controller:"main"
    },
    "single": {
        url: "/single",
        templateUrl:"js/health/single/tplSingle.html",
        abstract:true,
        controller:"single"
    },
    "main.landing":{
        url: "/landing",
        views: {
            'main-tab': {
                templateUrl: "js/health/main/tplLoading.html",
                controller: "main.landing"
            }
        }
    },
    "single.reg" : {
        url: "/reg",
        views: {
          'single-tab': {
              templateUrl: "js/health/single/tplReg.html",
              controller:"main.reg"
          }
        }
    },
    "single.mobilevari" : {
        url: "/mobilevari",
        views: {
            'single-tab': {
                templateUrl: "js/health/single/tplMobilevari.html",
                controller:"main.mobilevari"
            }
        }
    },
    "main.list" : {
        url: "/list",
        views: {
            'workoutlist-tab': {
                templateUrl: "js/health/main/tplList.html",
                controller:"main.list"
            }
        }
    },
    "main.plan": {
        url:"/plan",
        views: {
            'targetplan-tab': {
                templateUrl: "js/health/main/tplPlan.html",
                controller:"main.plan"
            }
        }
    }
});