/**
 * Sample Model
 * 
 * @package Sleek.js
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */


var collection = mongodb.collection('user');
var Promise = require('promise');
var permitted_user_param = new Array("imei","height","weight","age","gender","name","avatar","username","varify");
    var goals = new Array("lose_weight","fitness","performance");
var md5 = require('MD5');
var userModel = function() {
    var passwordEncrypt = function(password) {
        return md5(password);
    }

    var checkParam = function(data, permits) {
        for (var p in data) {
            var permit = false;
            for (var i=0; i<permits.length; i++) {
                if (permits[i] === p || permits[i] === data[p]) {
                    permit = true;
                    break;
                }
            }
            if (!permit) {
                throw new Error("Model Error, Parameter "+p+"/"+data[p]+" is not permit");
            }
        }
    };

    var checkUserExists = function(data){
        if (   (data.hasOwnProperty('imei') || !data.hasOwnProperty('username')) || (!data.hasOwnProperty('imei') || data.hasOwnProperty('username')))
        {
            return new Promise(function(fullfill, reject){
                var returns = function(data) {
                    if (data!=null) {
                        fullfill(true);
                    } else {
                        fullfill(false);
                    }
                };
                var errors = function(data) {

                };
                if (data.hasOwnProperty('imei')) {
                    collection.findOne({'imei': data.imei}, {}, function (err, doc) {
                        returns(doc);
                    });
                } else {
                    collection.findOne({username: data.username }, {}, function (err, doc) {
                        returns(doc);
                    });
                }
            });
        } else {
            throw new Error("Model Error, User Checking Only Let username & imei goes");
        }
    };

    return {
        list: function (callback) {

        },
        add: function(data) {
            return new Promise(function(fullfill, reject) {
                    //required parameter, imei is the only property that we need for reg
                    if (!data.hasOwnProperty(global.IMEI)) {
                        reject("Model Error, Register needs IMEI");
                        return;
                    }
                    //if (!data.hasOwnProperty('username')) {
                    //    reject("Model Error, Register needs Username");
                    //}
                    //if (!data.hasOwnProperty('password')) {
                    //    reject("Model Error, Register needs Password");
                    //}
                    // convert the type to String in case imei is all numbers
                    data.imei = data.imei.toString();
                    checkParam(data,permitted_user_param);
                    //check the imei is already reged
                    checkUserExists(data).done(function (res) {
                        if (res) {
                            reject("Registing Error, User Exists");
                            return;
                        }
                        //start the insert prosess

                        var insertPromise = new Promise(function(fullfill, reject) {
                            data.password = passwordEncrypt(data.password);
                            collection.insert(data, {safe:true}, function(err, newuser){
                                if(err) {
                                    reject(err);
                                    return;
                                }
                                fullfill(newuser);
                            });
                        });
                        insertPromise.then(function(data){
                                fullfill(data);
                            }, function(msg){
                                reject(msg);
                                return;
                            }
                        );
                    });
                }
            );
        },
        remove: function(data) {
            return new Promise(function(fullfill, reject){
                if (!data.hasOwnProperty(global.IMEI)) {
                    reject("Model Error, Remove User Needs IMEI");
                    return;
                }

                checkUserExists(data).done(function(res){
                    if (!res) {
                        reject("User Does Not Exists");
                        return;
                    }

                    var deletePromise = new Promise(function(fullfill, reject){
                        collection.remove(data,{safe:true}, function(err, doc){
                            if (err) {
                                reject(err);
                                return;
                            }
                            fullfill(doc);
                            return;
                        });
                    });
                    deletePromise.done(function(data){
                        fullfill(data);
                    });
                });
            });
        },
        modify: function(query, data) {
            return new Promise(function(fullfill, reject){

            });
        },
        checkExists: function(imei) {
            var data = {'imei':imei};
            return checkUserExists(data);
        },
        setGoal: function(query, data) {
            return new Promise(function (fullfill, reject) {
                checkUserExists(query).then(function(res) {
                    if (res === false) {
                        reject("User Not Exists");
                        return;
                    }
                    checkParam(data, goals);
                    collection.update(query, {$set: {goal: data}}, function (doc) {
                            fullfill();
                    });
                });
            });
        }
    };
};

module.exports = userModel;