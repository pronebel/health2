/**
 * Created by rollandlee on 4/29/15.
 */


var mobileCollection = mongodb.collection('mobile');
var JUHE_APP_KEY = "0c3c95e9e2c38921f06f5395aa206871";
var JUHE_SMS_API = "http://v.juhe.cn/sms/send";
var JUHE_SMS_VARI_TEMPLATE = 2672;
var PERMIT_MAX_VARIFY_PERIOD = 10000*3600*1000;
var Promise = require('promise');
var request = require('request');
var mobileModel = function() {
    var buildBaseUrl = function() {
        return JUHE_SMS_API+"?key="+JUHE_APP_KEY;
    };
    var generateConfirmNum = function() {
        return (parseInt(Math.random()*900000+100000));
    };
    var varifyMobileNum = function(mobile) {
        return /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(mobile);
    }
    return {
        getVarificationCode : function (imei, mobile) {

            if (!varifyMobileNum(mobile)) {
                    throw new Error("Mobile Number Not Valid");
            }
            return new Promise(function (fullfill, reject) {
                var confirmNum = generateConfirmNum();
                mobileCollection.save({imei:imei, mobile: mobile,confirm_num:confirmNum, time: new Date(), consumed: false},{safe:true}, function(err, doc) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    var codeParam = encodeURIComponent("#code#="+confirmNum);
                    var url = buildBaseUrl() + "&mobile=" + mobile + "&tpl_id="+JUHE_SMS_VARI_TEMPLATE + "&tpl_value="+codeParam;
                    request(url, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            if (JSON.parse(body).error_code==0)
                                fullfill();
                            else
                                reject(body);
                        } else {
                            reject(body);
                        }
                    });

                });
            });
        },
        varify: function(imei, varificationCode) {
            return new Promise(function (fullfill, reject){
                console.log(imei);
                console.log(varificationCode);
                mobileCollection.findOne({imei: imei, confirm_num: parseInt(varificationCode),consumed: false}, function(err, doc){

                    if (err || doc == null) {
                       reject();
                       return;
                   }

                    mobileCollection.update({_id:doc._id}, {$set:{consumed: true}}, function(err, doc){
                        if (err) {
                            reject();
                            return;
                        }
                        fullfill();
                    });
                });
            });
        }
    }
};




module.exports = mobileModel;
