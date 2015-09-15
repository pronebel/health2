Starter_Controller
    .controller('main.reg', ['$scope','$http','$state','localStorageService','$cordovaImagePicker', function($scope, $http, $state, localStorageService,$cordovaImagePicker){
        if (localStorageService.get('user') != undefined && localStorageService.get('user') != null) {
            $state.go("main.list");
        }
        $scope.weight="0";
        $scope.mobile = localStorageService.get('mobile');
        $scope.years = [];
        for(var i=1940; i<2010; i++) {
            $scope.years.push(i);
        }
        $scope.weights = [];
        for(var i=40; i<120; i++) {
            $scope.weights.push(i+"KG");
        }
        $scope.heights = [];
        for (var i=140; i<210; i++) {
            $scope.heights.push(i+"CM");
        }
        $scope.clickReg = function(evt) {
            //console.log($scope.user.name);
            var age = (new Date).getYear()+parseInt($scope.user.birth);
            var weight = parseInt($scope.user.weight.substr(0,2));
            var height = parseInt($scope.user.height.substr(0,3));
            var gender = parseInt($scope.user.gender);
            var varify = parseInt($scope.user.varify);
            var name = $scope.user.name;
            $http.post(Cfg.api+Cfg.user_reg+"?imei="+device.uuid+"&varify="+varify, {age:age, height: height, gender: gender, name:name}).success(function(doc){
                console.log(doc);
                if (doc.status == 1) {
                    localStorageService.set('user',Math.random());
                    $state.go("main.list");
                }
            });
        };
        $scope.clickShare = function(evt) {
            var scope = "snsapi_userinfo";
            console.log("asdfasdfasdfsd");
            Wechat.auth(scope, function (response) {
                // you may use response.code to get the access token.
                console.log(response);
            }, function (reason) {
                console.log("Failed: ");
                console.log(reason);
            });
        };
        $scope.selectImage = function(evt) {
            var options = {
                maximumImagesCount: 10,
                width: 800,
                height: 800,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    $scope.avatarSource = result[0];
                }, function(error) {
                    // error getting photos
                });
        }
    }]);