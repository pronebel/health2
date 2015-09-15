Starter_Controller

    //搜索Form
    .controller('TravelCtrl', function(
        $scope,MapService,TravelAPI,$ionicPopup,$state,$ionicActionSheet, $timeout,$http,localStorageService,
        $ionicLoading
        ) {

        try {
            var noop = function(){}
            window.locationService.getCurrentPosition(function(baidupos){
                var baiduCoords = baidupos.coords;
                console.log(baidupos);
                MapService.getAtLocation(baiduCoords.latitude, baiduCoords.longitude).then(function (resp) {

                    var address = resp.data.result;
                    console.log(resp);
                    $scope.travel.from={
                        n:address.addressComponent.city,
                        g:address.location.lng+","+address.location.lat,
                        data:address
                    };

                })
            },function(e){
                console.log(JSON.stringify(e))
                window.locationService.stop(noop,noop)
            });
        }catch(ex){
            console.log(ex);
            console.log("geo error");
        }

        $scope.travel = {
            from:{},
            to:{}
        };

        var condTmp =  localStorageService.get("SEARCH_CONDITION");
        if(condTmp){


            $scope.travel.from ={
                n:condTmp.from.title,
                g:condTmp.from.poi.join(",")
            }
            $scope.travel.to ={
                n:condTmp.to.title,
                g:condTmp.to.poi.join(",")
            }
            $scope.travel.days = condTmp.days

        }



        $scope.goHome=function(){
            $state.go("app.index");
        }

        $scope.searchTarget=function(){

            if(!$scope.travel.from.n||!$scope.travel.to.n ){
                $ionicPopup.alert({
                    title:"提示",
                    template:"请填写游玩信息"
                })
            }else{




                var loc = {
                    from:{
                        title:$scope.travel.from.n,
                        poi:$scope.travel.from.g.split(",")
                    },
                    to:{
                        title:$scope.travel.to.n,
                        poi:$scope.travel.to.g.split(",")
                    },
                    days:$scope.travel.days || 7
                }

                localStorageService.set("SEARCH_CONDITION",loc);


                $state.go("travellist");


            }

        }
    })

    //搜索结果
    .controller('TravelListCtrl', function($scope,MapService,$ionicPopup,TravelAPI,$state,$ionicActionSheet, $timeout,$http,localStorageService, $ionicLoading){


/*

        $ionicLoading.show({
            template: 'Loading...'
        });
*/


        var searchCond =   localStorageService.get("SEARCH_CONDITION");
        var searchFilters = searchCond;//



        var toPlace = searchFilters.to;
        var fromPlace = searchFilters.from;
        var travelDays = searchFilters.days;

        $scope.hours =0;
        $scope.title =  fromPlace.title + "至" + toPlace.title + "(" + searchFilters.days + "日游)";
        var params = {
            longitude:searchFilters.to.poi[0],
            latitude:searchFilters.to.poi[1],
            radius:9999,
            interests:{"7":1},
            num:10,
            offset:0,
            callback:"JSON_CALLBACK"
        };
        $scope.commendlist = [];
        $scope.hasnext = true;




        $scope.goSearch=function(){
            $state.go("travel");
        }

        $scope.actRemove=function(item){
           console.log(arguments);
        }

        var isLoading = false;

        $scope.loadMoreData=function(){


            if(isLoading==true){
                return;
            }

            if($scope.hasnext){


                isLoading=true;

                TravelAPI.nearBy(params).then(function(resp){


                    isLoading= false;
                    var data = resp.data;

                    $scope.hasnext = data.hasnext;
                    if(data.list){
                        $scope.commendlist =  $scope.commendlist.concat( data.list);

                        params.offset = params.offset + params.num;
                    }else if(params.offset==0){//第一次加载
                        var alertPopup =  $ionicPopup.alert({
                            title:"提示",
                            template:"没有搜索到相关的景点信息"
                        });
                        alertPopup.then(function(res) {
                            $state.go("travel")
                        });
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            }else{
                return;
            }

        }

        $scope.moreDataCanBeLoaded=function(){
            return  $scope.hasnext;
        }
        $scope.$on('$stateChangeSuccess', function() {

            $scope.loadMoreData();
        });

        var calHours = function(){
            var hours = 0;
            for(var i=0;i<$scope.commendlist.length;i++){
                var curItem = $scope.commendlist[i];
                if(curItem.selected==true){
                    hours += parseInt(curItem.poi_duration);
                }
            }

            $scope.hours = hours;
        }


        $scope.savePlan=function(){

            $ionicLoading.show({
                template: 'Loading...'
            });
            var pids = [];
           for(var i=0;i<$scope.commendlist.length;i++){
               var curItem = $scope.commendlist[i];
               if(curItem.selected==true){
                   pids.push(curItem.poi_id);
               }
           }

            if(pids.length==0){
                $ionicPopup.alert({
                    title:"提示",
                    template:"您还没有选择需要游玩的景点"
                });
                $ionicLoading.hide();
                return;
            }



            TravelAPI.addPlanByPois({
                list_name:$scope.title,
                pois : pids.join(","),
                place_start:fromPlace.title,//出发地
                place_end:toPlace.title,//目的地
                days:travelDays//预计游玩的天数


            }).then(function(resp){
                $ionicLoading.hide();
                var retData = resp.data;
                $state.go("plandetail",{planId:retData.data.list_id});

            })




        }
        $scope.showOper = function(item) {

            console.log(item);
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: (item.selected ? '<b>取消收藏 </b>':"添加") },
                    { text: '删除' }
                ],

                cancelText: '取消',
                cancel: function () {

                },
                buttonClicked: function (index) {
                    if(index==0){
                        if(item.selected){
                            item.selected = false;
                        }else{
                            item.selected = true;
                        }
                        calHours();
                    }else if(index==1){
                        console.log("removing...");
                    }
                    console.log(arguments);
                    return true;
                }
            });
        }

    })


    .controller('PlanDetailMapCtrl', function($scope,TravelAPI,$state,$ionicActionSheet, $timeout,$http,$stateParams,localStorageService) {

        var goDetailPage =  function(){
            $state.go("plandetail",{
                planId:$stateParams.planId
            });
        }
        $scope.mapCallBack=function(map){
//create markers

            console.log(map);


            var points = [];
            for (var i in pointsInfo) {
                var marker = pointsInfo[i];
                var pt = new BMap.Point(marker.longitude, marker.latitude);
                points.push(pt);
                var marker2  = new BMap.Marker(pt);

                map.addOverlay(marker2); // 将标注添加到地图中

                var opts = {
                    position : pt,   // 指定文本标注所在的地理位置
                    offset   : new BMap.Size(-15, -50)    //设置文本偏移量
                }

                marker2.title = marker.title;

                marker2.addEventListener("click", function(){

                    this.openInfoWindow(new BMap.InfoWindow(this.title));
                });

            }


            var curve = new BMap.Polyline(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});
            map.addOverlay(curve); //添加到地图中
        }



        var  MapDetailData = localStorageService.get("PLAN_DETAIL"+$stateParams.planId);
        if(MapDetailData){
            $scope.detail = MapDetailData;


            var pointsInfo = [];
            for(var i=0;i<MapDetailData.list.length;i++){
                var curPOI = MapDetailData.list[i];
                pointsInfo.push({
                    longitude: curPOI.poi_longitude,
                    latitude: curPOI.poi_latitude,
                    title: curPOI.poi_name
                })
            }


            var longitude = 116.397428;
            var latitude = 39.90923;

            $scope.mapOptions = {
                center: {
                    longitude: pointsInfo[0].longitude,
                    latitude: pointsInfo[0].latitude
                },
                enableScrollWheelZoom:true,
                zoom: 14,
                style:{
                    width:"100%",
                    height: "100%"
                }
            };






        }else{
            if($stateParams.planId){
                goDetailPage();
            }else{
                $state.go("app.index");
            }

        }
        $scope.showDetail = goDetailPage;







    })
    .controller('PlanDetailCtrl', function($scope,TravelAPI,$state,$ionicActionSheet, $timeout,$http,$stateParams,localStorageService) {


        $scope.goPlanList=function(){
            $state.go("planList");
        }

     /*     //行程更新机制：1.数据缓存到Store，2，额外接口获取哪些行程更新过。
        var curDetailData = localStorageService.get("PLAN_DETAIL"+$stateParams.planId);
    */
        TravelAPI.planDetail({
            planId:$stateParams.planId,
            offset:0,
            num:20

        }).then(function(resp){

            $scope.planlist = resp.data.list;
            $scope.title = resp.data.info.list_name;
            localStorageService.set("PLAN_DETAIL"+$stateParams.planId,resp.data );
            console.log($scope.planlist);
        })



        $scope.showMap=function(){
           $state.go("plandetailmap",{
               planId:$stateParams.planId
           });
        }




    })
    .controller('PlanListCtrl', function($scope,TravelAPI,$state,$ionicActionSheet, $timeout,$http,$stateParams) {

        TravelAPI.planList({
            offset:0,
            num:20
        }).then(function(resp){
            $scope.planlist = resp.data.list;
            console.log($scope.planlist);
        })




        $scope.goIndex=function(){
            $state.go("app.index");
        }






    })
;

