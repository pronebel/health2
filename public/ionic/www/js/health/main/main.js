/**
 * Created by rollandlee on 4/22/15.
 */

var DialogController = function($scope, $mdDialog){
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.done = function(answer) {
        $mdDialog.hide(answer);
    };
};

Starter_Controller
    .controller('main',function($scope, localStorageService, $state, $http){
        $scope.leftColumnItem = [
            {name:"我的ROCKETS"},
            {name:"退出"}
        ];
        //check if user has already registered
        //fake one at first
        var imei = device.uuid;
        var param = "?imei="+imei;

        $http.get(Cfg.api+Cfg.user_exists+param).success(function(doc){
            if (!doc.data) {
                $state.go("single.mobilevari");
            }
        });
    })
    .controller("main.landing", function($scope,$state, $http){
        //suppose we do have a not used id

    }).controller("main.list", function($scope, $state, $http, localStorageService, $mdDialog, $rootScope){
        $rootScope.title = "当前训练";
        $scope.workoutList = [];
        $scope.loadingDisplay = "block";
        var uid = localStorageService.get('user');
        $http.get(Cfg.api+Cfg.workout_list+"?uid="+uid).success(function(doc){
            $scope.workoutList = doc.data;
            $scope.loadingDisplay = "none";
        });
        $scope.gotoWorkout = function(workout, ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'js/health/main/tplWorkout.html'
            }).then(function(status){
                if (status == 'success')
                    workout.done=true;
                var completeness = 0;
                if (status == 'fail') {
                    completeness = 0.2;
                } else {
                    completeness = 0.9;
                }
                var data = {completeness:completeness, difficulity:workout.difficulity, workout_name:workout.name};
                $http.post(Cfg.api+Cfg.workout_addtrack+"?uid="+localStorageService.get('user'), data).success(function(doc){
                    //$scope.loadingDisplay = "block";
                    //$http.get(Cfg.api+Cfg.workout_list+"?uid="+uid).success(function(doc){
                    //    $scope.workoutList = doc.data;
                    //    $scope.loadingDisplay = "none";
                    //});
                });
            });
        };
    }).controller("main.plan", function($scope,$cordovaCalendar, localStorageService, $http, $rootScope){
        $rootScope.title = "计划目标";
        $scope.targetList = [];
        $scope.loadingDisplay = "block";
        var uid = localStorageService.get('user');
        $http.get(Cfg.api+Cfg.workout_plan+"?uid="+1).success(function(doc){
            $scope.targetList = doc.data;
            $scope.loadingDisplay = "none";
        });
        $scope.clickSyncToCal = function(evt){
            for (var i =0; i< $scope.targetList.length; i++) {
                var cal= window.plugins.calendar;
                var startDate = new Date($scope.targetList[i].time);
                var endDate = new Date(new Date($scope.targetList[i].time).getTime()+30*60000);
                var title = $scope.targetList[i].target;
                var eventLocation = "A";
                var calOptions = window.plugins.calendar.getCalendarOptions();
                calOptions.calendarId = 9;
                cal.createEvent(title, eventLocation, "", startDate, endDate, calOptions, function(doc){
                    console.log($scope.targetList[i].target+" DONE");
                    console.log(doc);
                }, function(err){
                    console.log($scope.targetList[i].target+" ERR");
                    console.log(err);
                });
            }
        };

    });

