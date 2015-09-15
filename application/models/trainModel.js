var stationClt = mongodb.collection('station');

var stationAddressClt = mongodb.collection('station_address');


var _ = require('lodash');


var serviceModel = {

    stationProfile:function(params,callback){
        stationClt.find().sort({"sid":-1}).toArray(function(err, results) {
            callback({list:results});
        });
    },

    analysisStation:function(callback){

        var Station = system.getModel("station");

        Station.findAll().success(function(stations) {
            callback(stations);
        })
    },


    line:function(params,callback){
        var fileds = 'S.No,S.Station AS Start,E.Station AS End, S.Day,E.Day,S.Leave,E.Arrive,(E.Distance -S.Distance) AS Distance,(E.Price -S.Price) AS Price';
        var conds = ' S.station like"'+params.start+'%" AND E.station like"'+params.end+'%" AND S.No = E.No AND E.Order > S.Order'
        var order = ' ORDER BY  S.Leave ASC';
        var sql = 'SELECT '+fileds+' FROM trains S ,trains E where '+ conds + order;





        mysqldb.query(sql).spread(function (res, metadata) {
            // Metadata contains the number of affected rows
            console.log(res);
            console.log(metadata);
            console.log(res.length);
            callback(res)
        });

        /*.success(function(myTableRows) {

        })
*/

    },
    stationAddressList:function(callback){

        stationAddressClt.find().toArray(function(err, results) {
           // console.log(results);
            callback(results);
        });


    },


    findStationAddress:function(params,callback){
        stationAddressClt.findOne({
            "station":params.station,
            "pinyin":params.pinyin,
            "alias":params.alias
        },function(err,result){

            // console.log(result);
            if(result){
                callback(result)
            }else{
                callback(null)
            }

        })
    },

    insertStationAddress: function(data, callback){
        data.date = Date.now();
        stationAddressClt.insert(data, {safe:true}, function(err, newuser){
            if(err) {
                console.log(data.station +"写入地址失败，");
                console.log(err);
            }

           callback(err,newuser);
        });
    }

}




module.exports = serviceModel;
