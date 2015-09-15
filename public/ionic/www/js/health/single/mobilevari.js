var user_number = "aaa"


Starter_Controller
    .controller('main.mobilevari', ['$scope','$http','$state','localStorageService', function($scope, $http, $state, localStorageService){
        $scope.getVarification = function() {
            console.log("Start Varification");
            var mobile = $scope.mobile;
            var url = Cfg.api+Cfg.user_varification+"?mobile="+$scope.mobile+"&imei="+device.uuid;
            $http.get(url).success(function(doc){
                console.log(doc);
                if (doc.data) {
                    localStorageService.set('mobile',mobile);
                    $state.go("single.reg");
                }
            });
        };
    }]);