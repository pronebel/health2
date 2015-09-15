/**
 * Created by rollandlee on 4/22/15.
 */
Starter_Controller
    .controller('generalLanding',function($scope, localStorageService, $state){
        $state.go("single.reg");
        //var isLanded = localStorageService.get('isLanded');
        //if (isLanded === null) {
        //    console.log("Introduction Havn't Shown Yet, Go To Introduction");
        //    localStorageService.set('isLanded',true);
        //    $state.go("introduction");
        //} else {
        //    console.log("Introduction Shown Detected, Go To Main Page");
        //    $state.go("main.landing");
        //}
    })
    .controller('introduction', function($scope, $state){
        $scope.gotoMain = function(){
              $state.go("main.landing");
        };
    });
