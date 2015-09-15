
'use strict';


var baseUrl = 'http://127.0.0.1:8008/';


Starter_Services
    .factory('MapService',['$q', '$resource', '$http',
        function($q, $resource, $http) {

            var URL_GeoCoder = "http://api.map.baidu.com/geocoder/v2/?";
            var URL_CovertCood= "http://api.map.baidu.com/ag/coord/convert?";





            function getAtLocation(lat, lng) {
                console.log(lat+","+lng);
                var params = {
                    ak:"6ad07370e93c20ceb6637d0c4d879942",
                    location:lat+","+lng,
                    output:"json",
                    pois:"1",
                    callback:"JSON_CALLBACK"
                }
                return $http.jsonp(URL_GeoCoder+$.param(params));
            }



            function getCurrentPosition(funcSucc){
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(funcSucc)
            }





            function translate(lat,lng, fromType) {


                var params = {
                    from:fromType||2,
                    to:4,
                    x:lng,
                    y:lat,
                    callback:"JSON_CALLBACK"


                }
                return $http.jsonp(URL_CovertCood+$.param(params));
             }

            function createMap(domId,centerCity,level){
                centerCity = centerCity || "北京";
                level = level || 12;
                var map = new BMap.Map(domId);
                map.centerAndZoom(centerCity,level);

                return map;
            }


            /**
             *         location	String|Map|Point	设定返回结果的所属范围。例如“北京市”。
             types	Array<String>	返回数据类型。两种设置方式，第一种为默认值（即设置值为空），将返回所有数据。如地图初始化为北京，在输入框中输入“小”，输入框下会出现包含“小”关键字的多种类型（如餐饮、地名等）的提示词条。第二种设置值为"city"，将返回省市区县乡镇街道地址类型数据。如地图初始化为北京，在输入框中输入“小”，输入框下会出现“小金县”的地点名称类的提示词条。
             onSearchComplete	Function	在input框中输入字符后，发起列表检索，完成后的回调函数。
             参数：AutocompleteResult
             * @param input
             * @param types
             * @param onsearchComplete
             * @param location
             */
            function autocomplete(options,onconfirmFunc){
                //input,types,onsearchComplete,location
                var ac = new BMap.Autocomplete(options);

                if(onconfirmFunc){
                    ac.addEventListener("onconfirm", onconfirmFunc);
                }
            }


            function suggestion(options){

                var url = "http://apis.map.qq.com/ws/place/v1/suggestion/?";

                var params = {
                    keyword:options.keyword,

                    output:"jsonp",
                    key:"XUWBZ-ZUQ33-DW533-3O6X7-WGGYO-4XBSJ",
                    callback:"JSON_CALLBACK"
                }

                if(options.region){
                    params.region=options.region;
                }

                return $http.jsonp(url+$.param(params));

            }




            return {
                getAtLocation:getAtLocation,
                geoConvert:translate,
                getCurrentPosition:getCurrentPosition,
                autocomplete:autocomplete,
                suggestion:suggestion
            }
        }]);


