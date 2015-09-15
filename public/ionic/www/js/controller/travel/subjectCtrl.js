Starter_Controller


    .controller('SubjectListCtrl', function(  $scope,$state,$http,API,$ionicLoading) {


        API.post("subject_list",{

        }).then(function(rsp){
            console.log(rsp);
            $scope.subjects = rsp.data.list;
        });
    })
    .controller('SubjectDetailCtrl', function(  $scope,$stateParams,$state,$http,API,$ionicLoading) {



        API.post("subject_detail",{
              id:$stateParams.id
        }).then(function(rsp){
            $scope.detail = rsp.data.detail;
        });
    })

