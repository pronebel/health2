Starter_Services
    .factory('TravelAPI',
    function($q, $resource, $http) {

        var friends = [
            { id: 0, name: 'Scruff McGruff' },
            { id: 1, name: 'G.I. Joe' },
            { id: 2, name: 'Miss Frizzle' },
            { id: 3, name: 'Ash Ketchum' }
        ];



        var host= "192.168.173.74";

        function nearBy(opt){
            var params = {
                longitude:opt.longitude,
                latitude:opt.latitude,
                radius:opt.radius,
                interests:JSON.stringify(opt.interests),
                num:opt.num,
                offset:opt.offset,
                callback:"JSON_CALLBACK"
            }
            var mockData = {"code": 0, "list": [
                {"i": "0.199980580668317", "poi_id": "363281", "poi_name": "\u73ed\u5c3c\u8def(\u4e07\u535a\u5546\u53a6\u5e97)", "poi_duration": "6"},
                {"i": "0.199980580667352", "poi_id": "361816", "poi_name": "\u6a31\u6843\u56ed\u7535\u70e4\u4e32", "poi_duration": "6"},
                {"i": "0.199980575974421", "poi_id": "361811", "poi_name": "\u8fbd\u5f00\u9633\u95e8\u6545\u5740", "poi_duration": "2"},
                {"i": "0.199980548242793", "poi_id": "365401", "poi_name": "\u76f2\u4e19\u4fdd\u5065\u6309\u6469\u9662(\u53f3\u5b89\u95e8\u5e97)", "poi_duration": "1"},
                {"i": "0.19998046997413", "poi_id": "361807", "poi_name": "\u767d\u7eb8\u574a\u793e\u533a\u6587\u5316\u5e7f\u573a", "poi_duration": "2"},
                {"i": "0.199980445244002", "poi_id": "363276", "poi_name": "\u6cf0\u7f8e\u5370\u52a1\u6025", "poi_duration": "9"},
                {"i": "0.199980356995247", "poi_id": "365384", "poi_name": "\u4e09\u67aa(\u53f3\u5b89\u95e8\u5185\u5927\u8857)", "poi_duration": "10"},
                {"i": "0.199980356995247", "poi_id": "330018", "poi_name": "\u516c\u7528\u7535\u8bdd", "poi_duration": "3"},
                {"i": "0.199980356995247", "poi_id": "361817", "poi_name": "\u53f3\u5b89\u95e8\u5185\u8f66\u884c", "poi_duration": "1"},
                {"i": "0.199980356995247", "poi_id": "351630", "poi_name": "\u666e\u5170\u5fb7\u6d17\u8863\u5e97(\u53f3\u5b89\u95e8\u5185\u5927\u8857)", "poi_duration": "4"}
            ], "hasnext": 1};
            return $http.jsonp("http://"+host+"/Sys/Poi/nearby?"+$.param(params))  .error(function(data, status, headers, config) {
               console.log(arguments);
            });
        }

        function createPlanByPois(opt){




            var params = {
                list_name:opt.list_name,// "北京3日游 //列表名称
                list_owner: 1, //创建人id,即当前登陆人id
                pois : opt.pois,//放入列表的多个poi_id,逗号隔开,
                place_start:opt.place_start,
                place_end :opt.place_end,
                days:opt.days,

                callback:"JSON_CALLBACK"
            }
            return $http.jsonp("http://"+host+"/Home/Poi/list_create?"+$.param(params))

        }

        function planDetail(opt){

            var params = {
                list_id: opt.planId, //列表id
                list_owner: 1, //列表拥有者
                num: opt.num,
                offset: opt.offset,
                callback:"JSON_CALLBACK"
            }
            return $http.jsonp("http://"+host+"/Home/Poi/list_listPois?"+$.param(params));
        }

        function planList(opt){


            var params = {
                list_owner: 1, //列表拥有者
                callback:"JSON_CALLBACK"
            }
            return $http.jsonp("http://"+host+"/Home/Poi/list_search?"+$.param(params));


        }




        return {
            nearBy:nearBy,
            addPlanByPois:createPlanByPois,
            planDetail:planDetail,
            planList:planList
        }
    })
