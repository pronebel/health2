Starter_Services
    .factory('API',
    function($q, $resource, $http) {



        function __post(cmd,params){
            console.log("post params:");
            console.log(params);
           return $http.post("http://127.0.0.1:8008/api",{
                cmd:cmd,
                json:encodeURIComponent(JSON.stringify(params))
           });

        }
        function __weibo(cmd,params){

            console.log("post params:");
            console.log(params);
            return $http.post("http://127.0.0.1:8008/weibo",{
                cmd:cmd,
                json:encodeURIComponent(JSON.stringify(params))
            });

        }

        return {
            post: __post,
            weibo:__weibo
        }


    })

;