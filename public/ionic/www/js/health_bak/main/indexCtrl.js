Starter_Controller


    .controller('LaunchCtrl', function ($scope, $rootScope, $state, $timeout, $ionicViewService,localStorageService) {
       /* var loginData = localStorageService.get("Profile");
        if(loginData&&loginData.wb_auth){
            $state.go("app.index")
        }else{
            $state.go("login")
        }*/

        $state.go("app.index")

    })

    .controller('indexCtrl', function ($scope, $rootScope, $state, $timeout, $ionicViewService,localStorageService) {

        $scope.profile={
            sex:{
                name:"女",
                value:1
            },
            weight:{
                value:65,
                name:"65kg"
            }
        }
        $scope.sex =[
            {name:"男", value:"1"},
            {name: "女", value:"0"}
        ];

        $scope.weight =[
            {name:"<strong>75kg</strong>", value:"75"},
            {name: "65kg", value:"65"}
        ];


        $scope.getProfile=function(){
            console.log($scope.profile);
        }

    })

    .controller('ProfileMainCtrl', function ($scope) {
    })




