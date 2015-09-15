/**
 * Created by rollandlee on 5/5/15.
 */

var request = require('request');
var JUHE_WEATHER_APP_KEY = "4dc20f8117adf2d2de438772fadcc06f";
var JUHE_WEATHER_API = "http://v.juhe.cn/weather/ip";
var utilController = {
    getWeather: function(req,res) {
        var buildBaseUrl = function() {
            return JUHE_WEATHER_API+"?key="+JUHE_WEATHER_APP_KEY;
        };

        try {
            var ip = req.query.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            var url = buildBaseUrl() + "&ip="+ip;
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (JSON.parse(body).error_code == 0) {
                        var retu = JSON.parse(body).result;
                        var data = {};
                        data['weather'] = retu.today.weather;
                        data['temp'] = retu.sk.temp;
                        data['humidity'] = retu.sk.humidity;
                        data['city'] = retu.today.city;
                        var success = new global.successModel(data, req);
                        res.json(success.getObj());
                    } else {
                        var fail = new global.failModel(new Error(JSON.parse(body).reason), req);
                        res.json(fail.getObj());
                    }
                } else {
                    var fail = new global.failModel(new Error(JSON.parse(body).reason),req);
                    res.json(fail.getObj());
                }
            });
        } catch (e) {
            var fail = new global.failModel(e,req);
            res.json(fail.getObj());
        }
    }
};


module.exports = utilController;