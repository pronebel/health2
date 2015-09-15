Starter_Services
    .factory('Auth',
    function($q, $resource, $http,localStorageService) {

        var getter = function(key){
            return localStorageService.get(key);
        }

        var __profile = null;

        var initAuth = function(){
            __profile =   localStorageService.get("Profile");
        }

        var getUid = function(){
            if(!__profile){
                initAuth();
            }
            if(__profile&&__profile.wb_auth){
                return __profile.wb_auth.uid;
            }else{
                return null;
            }
        }

        var getToken = function(){
            if(!__profile){
                initAuth();
            }
            if(__profile&&__profile.wb_auth){
                return __profile.wb_auth.access_token;
            }else{
                return null;
            }
        }

        return {
            uid: getUid,
            token:getToken
        }


    })

;