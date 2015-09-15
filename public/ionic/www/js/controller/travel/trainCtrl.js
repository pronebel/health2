Starter_Controller

    .controller('TrainCtrl', function(  $scope,$state,$http,API,$ionicLoading) {


        console.log("TrainCtrl");
    })
    .controller('TrainSearchCtrl', function(  $scope,$state,$http,API,$ionicLoading,$ionicPopup,localStorageService) {

         $scope.train={};


        $scope.searchTrain=function(){


            if (!$scope.train.start || !$scope.train.end ) {

                var alertPopup = $ionicPopup.alert({
                    title: '提示!',
                    template: '请输入查询信息'
                });
            } else {

                localStorageService.set("LINE_SEARCH",$scope.train);
                $state.go("train.line");

            }
        }

    })
    .controller('LineCtrl', function(  $scope,$state,$http,API,$ionicLoading,localStorageService) {

        $scope.search = localStorageService.get("LINE_SEARCH");

        API.post("train_line",{
            start:$scope.search.start,
            end:$scope.search.end
        }).then(function(rsp){

            $scope.lines = rsp.data;;
        });
    })
