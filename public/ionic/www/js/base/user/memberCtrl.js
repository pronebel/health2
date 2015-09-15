Starter_Controller
    .controller('AuthCtrl', function ($scope, $ionicModal, $timeout,$http,$state, $ionicLoading,socket, $ionicPopup,localStorageService) {

        $scope.signUp={}, $scope.auth={},$scope.login={};

        $ionicModal.fromTemplateUrl('js/base/view/auth/signup.html', { scope: $scope}).then(function (modal) {
            $scope.signUpModal = modal;
        });
        $ionicModal.fromTemplateUrl('js/base/view/auth/authWeibo.html', { scope: $scope}).then(function (modal) {
            $scope.authModal = modal;
        });

        /*************  SignUp  ****************/
        $scope.closeSignup = function () {
            $scope.signUpModal.hide();
        };

        $scope.showSignup=function(){
            $scope.signUpModal.show();
        }

        $scope.doSignup=function(){

            if (!$scope.signUp.email || !$scope.signUp.pwd ) {

                var alertPopup = $ionicPopup.alert({
                    title: '提示!',
                    template: '请输入注册信息'
                });
            } else {

                $ionicLoading.show({
                    template: 'Loading...'
                });

                var postData = $scope.signUp;

                $http.post(Cfg.api,{
                    cmd:"member_signup",
                    json:encodeURIComponent(JSON.stringify(postData))
                }).success(function(rsp){
                    console.log(rsp);
                    $ionicLoading.hide();
                    if(rsp.code>0){

                        $scope.closeSignup();
                        $scope.signUp={};
                        $ionicPopup.alert({
                            title: '提示!',
                            template: '注册成功'
                        });

                    }else{
                        $ionicPopup.alert({
                            title: '提示!',
                            template: rsp.error
                        });
                    }
                })
            }
        }

        /*************  Login   ****************/


        $scope.userAuth = {};

        $scope.doLogin=function(){
            if (!$scope.login.email || !$scope.login.pwd ) {
                $ionicPopup.alert({
                    title: '提示!',
                    template: '请输入登陆信息'
                });
            } else {

                $ionicLoading.show({
                    template: 'Loading...'
                });

                var postData = $scope.login;

                $http.post(Cfg.api,{
                    cmd:"member_login",
                    json:encodeURIComponent(JSON.stringify(postData))
                }).success(function(rsp){
                    console.log(rsp);
                    $ionicLoading.hide();
                    if(rsp.code>0){
                        $scope.userAuth = rsp.data;
                        if(rsp.authWeibo){

                        }else{
                            $scope.showAuth();
                        }

                    }else if(rsp.code==-1){
                        $ionicPopup.alert({
                            title: '提示!',
                            template: rsp.error
                        });
                    }
                })
            }
        }

        /*************  Auth Weibo   ****************/


        socket.on('token', function(rsp){
            console.log(rsp);
            $scope.authModal.hide();
            if(rsp.wb_auth){
                localStorageService.set("Profile",rsp);

                $state.go("app.index");

            }else{
                console.log("登陆失败");
            }
        });


        $scope.closeAuth = function () {
            $scope.authModal.hide();
        };

        $scope.showAuth=function(){
            $scope.authModal.show();
        }
        $scope.doAuth= function () {

            var getParam = {
                email:$scope.userAuth.email,
                account:$scope.auth.account
            }
            var url="http://127.0.0.1:8008/auth/login?"+ $.param(getParam);
             window.open(url, '_blank', 'location=no');
        }



    });




Starter_Controller
.controller('LoginCtrl', function ($scope, $ionicModal, $timeout, $ionicLoading,socket) {

    $scope.loginData = {};

    var ref=null;

    $ionicModal.fromTemplateUrl('js/base/view/auth2/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });






    socket.on('token', function(data){
        console.log(data);
        $scope.modal.hide();
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    $scope.weiboAuth=function(){

        socket.emit("token",{
            uid:1001
        });

        var url="http://127.0.0.1:8008/auth/login";
        ref = window.open(url, '_blank', 'location=no');

    }


    // Open the login modal
    $scope.login = function () {
        console.log("login");
        if (!$scope.loginData.username) {
            $scope.modal.show();
        }
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {

        try{
            navigator.weibo.init(function(response) {
                navigator.weibo.login(function(token) {
                    console.log(token);
                    alert("test");
                }, function(msg) {
                    console.log("login error : " + msg);
                });
            }, function(response) {
                console.log(response);
            }, '3952338548', "https://api.weibo.com/oauth2/default.html");

        }catch(ex){
            console.log(ex);
        }



        /*console.log($scope.loginData);
         if (!$scope.loginData.username || !$scope.loginData.password) {

         var alertPopup = $ionicPopup.alert({
         title: '提示!',
         template: '请输入登陆信息'
         });
         } else {

         console.log('Doing login', $scope.loginData);

         // Simulate a login delay. Remove this and replace with your login
         // code if using a login system
         $timeout(function () {
         $scope.closeLogin();
         $ionicLoading.hide();
         }, 1000);

         //显示loading
         $ionicLoading.show({
         template: 'Loading...'
         });

         }
         */

    };

})
