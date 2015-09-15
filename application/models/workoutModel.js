var Promise = require('promise');

var workoutCollection = mongodb.collection('workout');
var workoutLogCollection = mongodb.collection('workout_log');

var permitted_workout_param = new Array("step" // warm-up main relaxing
                                        ,"area" //chest
                                        ,"workout_name" // push-up
                                        ,"desc" // descriptions
                                        ,"level" // difficulties description
                                        ,"weight"
                                        ,"distance"
                                        ,"require_time"
                                        ,"count"
                                        ,"set_count"
                                        ,"set_break"
                                        ,"img"
                                        ,"video"
                                        ,"difficulity");



var workoutModel = function(uid) {
    var checkRegParam = function(data) {
        for (var p in data) {
            var permit = false;
            for (var i=0; i<permitted_workout_param.length; i++) {
                if (permitted_user_param[i] === p) {
                    permit = true;
                    break;
                }
            }
            if (!permit) {
                throw new Error("Model Error, Parameter "+p+" is not permit for a workout");
            }
        }
    };

    var varifyDifficulity = function(data){
        //the difficulity should be varified by difficility table but now just return the set difficulity
        if (data.hasOwnProperty('difficulity')) {
            return data.difficulity;
        } else {
            return 0.2;
        }
    };

    return {
        add: function(data) {
            checkRegParam(data);
        },
        addTrack: function(data) {
            //check data
            if (uid === null || uid === undefined) {
                throw new Error("Lack of Parameters, uid is not defined");
            }
            // difficulity, complete rate => completeness should be at least contained
            if (!data.hasOwnProperty('difficulity') || !data.hasOwnProperty('completeness') || !data.hasOwnProperty('workout_name')) {
                throw new Error("Lack of Parameters, difficulity or completeness is not defined");
            }
            return new Promise(function(fullfill, reject){
                data['time'] = new Date();
                data['uid'] = uid;
                workoutCollection.findOne({name:data.workout_name},{target:1},function(err, doc){
                    if (err) {
                        reject(err);
                    }
                    data['target'] = doc.target;
                    workoutLogCollection.insert(data, {safe:true}, function(err, doc){
                        if (err) {
                            reject(err);
                            return;
                        }
                        fullfill(doc);
                    });
                });
            });
        }
    }
};

module.exports = workoutModel;