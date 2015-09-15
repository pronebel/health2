Starter_Services
    .factory('SenceApi',
    function($q, $resource, $http) {


        function api2(cmd,params,token){

            params = params || {};

            var data = {
                cmd:cmd,
                token:token,
                json:encodeURIComponent(JSON.stringify(params)),
                callback:"JSON_CALLBACK"
            }

            return $http.jsonp("http://nebel.sinaapp.com/auth/api.php?"+$.param(data));
        }

        //function ajax()


        function api (){


            $http({method: 'POST', url: 'bird' + index + '.json'}).
                success(function (data, status, headers, config) {
                    if (data.status && data.status == 200) {
                        $scope.rs = data.data;
                        $scope.loading = false;
                    }
                }).
                error(function (data, status, headers, config) {
                    console.log('请求错误')
                });
        }





        return {
            query: api
        }


    })

;