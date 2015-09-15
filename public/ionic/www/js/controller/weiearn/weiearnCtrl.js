Starter_Controller

    //搜索Form
    .controller('NearbyCtrl', function(
        $scope,MapService,TravelAPI,$ionicPopup,$state,$ionicActionSheet, $timeout,$http,WeiboApi,API,$ionicLoading
        ) {
        $scope.pois = {};
        $scope.mapOptions = {

            enableScrollWheelZoom:true,
            zoom: 20,
            style:{
                width:"100%",
                height: "200px"
            }
        };


        $scope.mapCallBack=function(map){
            $scope.map = map;
        }
        try{
            navigator.geolocation.getCurrentPosition(function(posiInfo){
                var position = posiInfo.coords;

                var     lat=position.latitude.toFixed(6);
                var    long=position.longitude.toFixed(6);
                WeiboApi.query("place/nearby/pois",{
                    lat: lat,
                    long:long,
                    count:25
                },'2.00tLJWnBRmzr6B2815321d7cgGPjEB').then(function(resp){
                    var data = resp.data;

                    $scope.pois = data.pois;
                    console.log(data);
                });

                var centerPoint = new BMap.Point(long,lat) ;
                $scope.map.setCenter(centerPoint);
                var marker2  = new BMap.Marker(centerPoint);

                $scope.map.addOverlay(marker2); // 将标注添加到地图中

            },function(err){
                console.log(err);
            })

        }catch(ex){
            console.log(ex);
        }


    })
    .controller('WeiEarnUserListCtrl', function(
        $scope,MapService,TravelAPI,$ionicPopup,$state,$ionicActionSheet, $timeout,$http,WeiboApi,
        $ionicLoading,$ionicPopover,API,Auth
    ){

        $ionicPopover.fromTemplateUrl('templates/weiearn/sort.html', function(popover) {
            $scope.popover = popover;
        });


            API.post("service_list",{

            }).then(function(rsp){
                $scope.services = rsp.data.list ;
            });






        $scope.goIndex=function(){
            $state.go("app.index");
        }

    })
    .controller('WeiEarnUserDetailCtrl', function(
        $scope,MapService,TravelAPI,$ionicPopup,$state,$ionicActionSheet, $timeout,$http,WeiboApi,API,Auth,
        $ionicLoading,$ionicPopover,$stateParams, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope,$ionicModal
        ){


        // chat
        var messageOptions = [
            { content: '<p>Wow, this is really something huh?</p>' },
            { content: '<p>Yea, it\'s pretty sweet</p>' },
            { content: '<p>I think I like Ionic more than I like ice cream!</p>' },
            { content: '<p>Gee wiz, this is something special.</p>' },
            { content: '<img src="http://static.oschina.net/uploads/user/361/723632_100.jpg?t=1396248858000" alt=""/>' },
            { content: '<p>Is this magic?</p>' },
            { content: '<p>Am I dreaming?</p>' },
            { content: '<img src="http://static.oschina.net/uploads/user/361/723632_100.jpg?t=1396248858000" alt=""/>'},
            { content: '<p>Am I dreaming?</p>' },
            { content: '<p>Yea, it\'s pretty sweet</p>' },
            { content: '<p>I think I like Ionic more than I like ice cream!</p>' },
        ];

        var messageIter = 0;
        $scope.messages = messageOptions.slice(0, messageOptions.length);

        $scope.chatInfo = {};
        $scope.add = function() {
            if( $scope.chatInfo.message){
                $scope.messages.push({
                    content:'<p>'+$scope.chatInfo.message+'</p>'
                });
                messageIter++;
                // Update the scroll area and tell the frosted glass to redraw itself
                $ionicFrostedDelegate.update();
                $ionicScrollDelegate.scrollBottom(true);
                $scope.chatInfo={};
            }
        };
        $ionicModal.fromTemplateUrl('templates/weiearn/chat2.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.chat = function(u) {


            $scope.modal.show();
        };



        //用户信息

        API.post("member_profile",{
            uid:$stateParams.uid
        }).then(function(rsp){
            console.log(rsp.data);

            var profile = rsp.data;
            $scope.userdetail = rsp.data ;

            var weiboStart = moment(profile.created_at);
            var duration = moment.duration(moment()-weiboStart);
            var ages = duration.asYears();

            console.log(weiboStart);
            if(ages>=1){
                $scope.weiboAges = ages.toFixed(1)+"年";
            }else{
                $scope.weiboAges = parseInt(duration.asMonths())+"月";
            }
        });

        API.weibo("friendships/friends/in_common",{
            suid:$stateParams.uid,
            uid:Auth.uid(),
            access_token:Auth.token()
        }).then(function(rsp) {

            $scope.commonUsers = rsp.data.users;
        });

        API.weibo("tags",{
            uid:$stateParams.uid,
            access_token:Auth.token()
        }).then(function(rsp) {

            var tags = [];
            for(var i=0;i<rsp.data.length;i++){
                var item = rsp.data[i];
                for(var prop in item){
                    if($.isNumeric(prop)){
                        tags.push(item[prop]);
                        break;
                    }
                }
            }

           $scope.commonTags = tags;
           //console.log(rsp.data)
        });
        API.weibo("place/user_timeline",{
            uid:$stateParams.uid,
            base_app:0,
            count:50,
            access_token:Auth.token()
        }).then(function(rsp) {


            console.log(rsp.data)
        });






        $scope.groups = [];
        API.post("service_listByUid",{
            wb_uid:$stateParams.uid
        }).then(function(rsp){
            $scope.groups = rsp.data.list ;
        });


        $scope.goIndex=function(){
            $state.go("app.index");
        }




    })
    .controller('WeiEarnServiceCtrl', function(
        $scope,$ionicPopup,$state, $timeout,$http,API,Auth,
        $ionicLoading,$ionicPopover,$stateParams,$ionicModal
        ){


        API.post("service_listByUid",{
            wb_uid:Auth.uid()
        }).then(function(rsp){
            $scope.groups = rsp.data.list ;
        });





        $ionicModal.fromTemplateUrl('templates/weiearn/addService.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.createContact = function(u) {


            var serviceItem ={
                name: u.name,
                price: u.price,
                desc: u.desc,
                wb_uid:Auth.uid()

            }
            API.post("service_insert",serviceItem).then(function(rsp){
                var data = rsp.data;

                data.shown= false;
                $scope.groups.push(data);
                u = {}
                $scope.modal.hide();
            });

        };

        $scope.goIndex=function(){
            $state.go("app.index");
        }

    })
    .controller('ChatCtrl', function($scope, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope) {
        var messageOptions = [
            { content: '<p>Wow, this is really something huh?</p>' },
            { content: '<p>Yea, it\'s pretty sweet</p>' },
            { content: '<p>I think I like Ionic more than I like ice cream!</p>' },
            { content: '<p>Gee wiz, this is something special.</p>' },
            { content: '<img src="http://static.oschina.net/uploads/user/361/723632_100.jpg?t=1396248858000" alt=""/>' },
            { content: '<p>Is this magic?</p>' },
            { content: '<p>Am I dreaming?</p>' },
            { content: '<img src="http://static.oschina.net/uploads/user/361/723632_100.jpg?t=1396248858000" alt=""/>'},
            { content: '<p>Am I dreaming?</p>' },
            { content: '<p>Yea, it\'s pretty sweet</p>' },
            { content: '<p>I think I like Ionic more than I like ice cream!</p>' },
        ];

        var messageIter = 0;
        $scope.messages = messageOptions.slice(0, messageOptions.length);

        $scope.add = function() {
            var nextMessage = messageOptions[messageIter++ % messageOptions.length];
            $scope.messages.push(angular.extend({}, nextMessage));

            // Update the scroll area and tell the frosted glass to redraw itself
            $ionicFrostedDelegate.update();
            $ionicScrollDelegate.scrollBottom(true);
        };
        $scope.goIndex=function(){
            $state.go("app.index");
        }

    })


;

