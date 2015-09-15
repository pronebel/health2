Starter_Controller
    .controller('AppCtrl', function ($scope) {



    })
    .controller('IndexCtrl', function ($scope, $ionicModal, $timeout, $ionicLoading,socket,API,Auth,
                                       $ionicPopup,localStorageService) {


        API.post("service_list",{
            wb_uid:Auth.uid()
        }).then(function(rsp){
            $scope.services = rsp.data.list ;
        });


    })
    .controller('IndexServiceCtrl', function ($scope, $ionicModal, $timeout, $ionicLoading,socket,API,Auth,
                                       $ionicPopup,localStorageService) {
        API.post("service_list",{
            wb_uid:Auth.uid()
        }).then(function(rsp){
            $scope.services = rsp.data.list ;
        });


    })





    .controller('SwipeCardCtrl', function ($scope,$ionicSwipeCardDelegate) {
        var cardTypes = [{
            title: 'Swipe down to clear the card',
            image: 'img/pic.png'
        }, {
            title: 'Where is this?',
            image: 'img/pic.png'
        }, {
            title: 'What kind of grass is this?',
            image: 'img/pic2.png'
        }, {
            title: 'What beach is this?',
            image: 'img/pic3.png'
        }, {
            title: 'What kind of clouds are these?',
            image: 'img/pic4.png'
        }];

        $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

        $scope.cardSwiped = function(index) {
            $scope.addCard();
        };

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        }
    })

    .controller('CardCtrl', function ($scope, $ionicSwipeCardDelegate) {
        $scope.goAway = function () {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            card.swipe();
        };
    })


    .controller('ProfileMainCtrl', function ($scope, Friends) {
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })

    .controller('AccountCtrl', function ($scope, $timeout) {

      /*  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.doRefresh = function () {

            console.log('Refreshing!');
            $timeout(function () {
                //simulate async response
                $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);

        };*/


    })





    .controller('ExamCtrl', function($scope, Camera, formDataObject,fileReader, $http) {
        $scope.loginData={
            total:45,
            unit:5,
            time:0
        }



        $scope.timeId=null,$scope.timeId2=null,$scope.timeId3=null;
        $scope.endTime =function(){
            $scope.loginData.time= 0;


            clearInterval($scope.timeId);
            clearInterval($scope.timeId2);
            clearInterval($scope.timeId3);



        }
        $scope.beginTime =function(){
            $scope.timeId=  setInterval(function(){
                $scope.loginData.time +=1;
            },1000);

            $scope. timeId2 =   setInterval(function(){
                console.log("beep");
                navigator.notification.vibrate(250);

            },1000*$scope.loginData.unit)//*60*2

            $scope.timeId3= setInterval(function(){
                console.log("45");
                navigator.notification.vibrate(2500);
            },1000*60*$scope.loginData.total);

        }


    })
    .controller('CameraCtrl', function($scope, Camera, formDataObject,fileReader, $http) {


        $scope.alert=function(){

        }
        $scope.confirm=function(){

        }
        $scope.prompt=function(){

        }
        $scope.beep=function(){
            navigator.notification.beep(5);
        }
        $scope.vibrate=function(){
            navigator.notification.vibrate(3000);
        }




        $scope.getPhoto = function() {
            Camera.getPicture().then(function(imageURI) {
                $scope.lastPhoto = imageURI;
            }, function(err) {
                console.err(err);
            }, {
                quality: 25,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false
            });
        };

        $scope.submit = function() {

            fileReader.readAsDataUrl($scope.lastPhoto).then(function(fileInfo) {

                return $http({
                    method: 'POST',
                    url: 'url/to/service',
                    headers: {
                        'Content-Type':undefined,
                        'Authorization': 'Basic ' + btoa("user:password")
                    },
                    data: {
                        file: fileInfo,
                        input: "{'json': 'ifNeeded'}"
                    },
                    transformRequest: formDataObject
                })
                    .success(function(data, status, headers, config) {
                        console.log("success");
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                    });

            }, function(err) {
                console.err(err);
            });
        };
    })



;

