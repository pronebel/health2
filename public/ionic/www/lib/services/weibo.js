Starter_Services
    .factory('WeiboApi',
    function($q, $resource, $http) {


        function api(cmd,params,token){

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






        return {
            query: api
        }


    })

;