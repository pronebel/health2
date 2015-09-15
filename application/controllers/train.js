var iweibo = system.getLibrary('weibo/index');
iweibo.set({
    appkey: '1539652173',
    appsecret: 'a4b2b1feaf3784900c7938e68edc534f'
});
var weibo = new iweibo.Weibo();

var _ = require('lodash');
var baidu_map = require('baidu-map');

var baiduApi = new baidu_map({
    ak:"BWFpka4dLZCtXjwCLXOi9OYT",
    sk:"31G9jQbPzeUHl92iRodOF54dSBZy4fU6"
})

var getAddressAddToStation = function(station,pinyin,alias){




    var trainM = system.getModel("train");

    trainM.findStationAddress({
        station:station,pinyin:pinyin,alias:alias
    },function(result){

        if(result){


            return;
        }else{
            console.log(station+":不存在此站的数据，进行获取");
        }


        baiduApi.placeSearch({
            query:station,
            tag:"交通设施,火车站",
            scope:2,
            page_size:20,
            region:"全国",
            filter:"industry_type:life"
        },function(err,rsp){


            if(rsp.status==0){

                trainM.insertStationAddress({

                    station:station,
                    pinyin:pinyin,
                    alias:alias,
                    address : rsp.results

                },function(erraddress){
                    if(erraddress) console.log(erraddress);
                })
            }else{
                console.log(station+"获取address失败");
            }
        })
    })


}


var indexController = {

    baidu:function(req,res){

        baiduApi.placeSearch({
            query:"羊场",
            //tag:"交通设施,火车站",
            scope:2,
            page_size:20,
            region:"全国",
            filter:"industry_type:life"
        },function(err,data){
            res.json(data);
        })


    },

    stationAddress:function(req, res) {
        var data = {
            title: "专题列表"
        }


        var trainM = system.getModel("train");
        trainM.stationAddressList(function(station) {
            var data = {
                title: "火车站地址分析列表",
                stations:station
            }
            console.log(data);
           // system.loadView(res,'subject/list', data);
            system.loadView(res, 'station/address', data);
        });


    },
    stationAnalysisAddress:function(req,res){

        var trainM = system.getModel("train");

        trainM.analysisStation(function(stations) {

            var nlen =stations.length;
            for(var i=0;i<nlen;i++){

                var sitem = stations[i];

                var station = sitem.station;
                var pinyin = sitem.pinyin;
                var alias = sitem.alias;
                console.log(i+":"+station);
                getAddressAddToStation(station,pinyin,alias);


            }


        });
    },

    analysis:function(req,res){
        var trainM = system.getModel("train");

        trainM.analysisStation(function(stations){


       /*

            /*weibo.api('location/pois/search/by_location', {
                access_token:'2.00tLJWnBZrNMgBd680f478003QIgDB',
                q:"上海",
                category:"110200",
                count:20

            }).done(function(err, result) {
                var result = JSON.parse(result);
                res.json(result);
            });*/

        })



    },

    list:function(req, res){
        var data = {
            title: "专题列表"
        }
        system.loadView(res,'subject/list', data);
    },
    edit:function(req,res){
        var data = {
            title: "Sleek.js"
        }



        var trainM = system.getModel("train");

        trainM.line({
            start:"上海",
            end:"北京"
        })

        system.loadView(res,'subject/form', data);
    }
}

module.exports = indexController;