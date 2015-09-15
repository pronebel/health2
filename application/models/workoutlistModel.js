
var Promise = require('promise');
var targetCollection = mongodb.collection('target');
var targetLogCollection = mongodb.collection('target_log');
var workoutCollection = mongodb.collection('workout');
var workoutLogCollection = mongodb.collection('workout_log');
var LASTING_CHECK_POINT_DAYS = 180;
var RECOMMEND_TARGET_NUM_DIFF_THRESHOLD = 0.2;
var TOTAL_WORKOUT_LIST_LENGTH = 10;
var DIFFICULITY_RANGE = 0.3;
var STANDARD_COMPLETENESS_RATE=0.7;
var workoutlistModel = function(uid) {
    /**
     * determTarget
     * The Target is determined by the most rare trained item in the list
     * @param uid
     */
    var determineTarget = function (isSimulate, targetDate) {
        if (isSimulate === undefined) {
            isSimulate = false;
        }
        if (targetDate === undefined) {
            targetDate = new Date();
        }
        return new Promise(function (fullfill, reject) {
            var scoreList = {};
            var target = ['DEFAULT_0', 99999999, 'DEFAULT_1', 99999999];
            var totalScore = 0;
            var avgDiff = 0;
            var recommendTargetNum = 1;
            var recommendTargetDiff = 0;
            var returnData = {};
            returnData['list'] = [];
            var getHistoryTargetList = new Promise(function (fullfill, reject) {

                var historyList = new Promise(function (fullfill, reject) {
                    var condition = { uid: uid, time: {$gt: new Date(targetDate - LASTING_CHECK_POINT_DAYS * 3600 * 24000)}};
                    if (!isSimulate) {
                        condition['simulate'] = false;
                    }
                    targetLogCollection.find(condition).toArray(function (err, doc) {

                        if (err) {
                            reject(err);
                            return;
                        }
                        doc.forEach(function (item) {
                            if (!scoreList.hasOwnProperty(item.target)) {
                                scoreList[item.target] = 0;
                            }
                            var timeDiff = targetDate - item.time;
                            var itemScore = Math.pow(item.completeness, item.difficulity);
                            var finalScore = (3600 * 24) / timeDiff * itemScore;
                            scoreList[item.target] = scoreList[item.target] + finalScore;
                        });
                        fullfill();
                    });

                });

                var targetList = new Promise(function (fullfill, reject) {
                    targetCollection.find().toArray(function (err, doc) {
                        doc.forEach(function (item) {
                            if (!scoreList.hasOwnProperty(item.name)) {
                                scoreList[item.name] = 0;
                            }
                        });
                        fullfill();
                    });
                });
                var generateData = function () {
                    var count = 0;
                    for (item in scoreList) {
                        totalScore += scoreList[item];
                        count++;
                        if (scoreList[item] < target[1]) {
                            target[0] = item;
                            target[1] = scoreList[item];
                        } else if (scoreList[item] < target[3]) {
                            target[2] = item;
                            target[3] = scoreList[item];
                        }
                    }
                    avgDiff = (totalScore / count);
                    if (avgDiff < RECOMMEND_TARGET_NUM_DIFF_THRESHOLD) {
                        recommendTargetNum = 2;
                        recommendTargetDiff = 0.2;
                    } else {
                        recommendTargetNum = 1;
                        recommendTargetDiff = avgDiff;
                    }

                    for (var i = 0; i < recommendTargetNum; i++) {
                        returnData.list[i] = target[2 * i];
                    }
                    returnData.diff = recommendTargetDiff;
                };
                historyList.then(function () {
                    targetList.then(function () {
                        generateData();
                        fullfill(returnData);

                    });
                });
            });
            getHistoryTargetList.then(function (targetList) {
                fullfill(targetList);
            });

        });
    };

    var determineWorkout = function (target) {
        return new Promise(function (fullfill, reject) {
            //get the num of each target
            var numOfEachTarget = Math.ceil(TOTAL_WORKOUT_LIST_LENGTH / target.list.length);
            var workoutList = new Array();
            getWorkout(target.list, target.diff, numOfEachTarget, 0, workoutList).then(function () {
                fullfill(workoutList);
            });
        });
    };

    var getWorkout = function (targetList, difficulity, num, cursor, workoutList) {
        return new Promise(function (fullfill, reject) {
            //console.log(difficulity);
            workoutCollection.find({
                target: targetList[cursor],
                difficulity: {$gt: difficulity - DIFFICULITY_RANGE, $lt: difficulity + DIFFICULITY_RANGE}
            }, {limit: num}).toArray(function (err, doc) {
                doc.forEach(function (item) {
                    workoutList.push(item);
                });
                if (cursor < targetList.length - 1) {
                    getWorkout(targetList, difficulity, num, cursor + 1, workoutList);
                }
                fullfill(doc);
            });
        });
    };

    return {
        list: function () {
            if (uid === undefined) {
                throw new Error("UID is not defined");
            }
            return new Promise(function (fullfill, reject) {
                determineTarget().then(function (target) {
                    determineWorkout(target).then(function (list) {
                        fullfill(list);
                    });
                });
            });
        },
        targetClearance: function () {
            return new Promise(function (fullfill, reject) {
                var targets = {};
                var innerChecker = [];
                var inserts = [];
                var workoutCount = 0;
                workoutLogCollection.find({uid: String(uid), clearance: false}, {target:1, difficulity:1, completeness:1, time:1}).toArray(function (err, doc) {
                    doc.forEach(function(item){
                        if (item.target != undefined) {
                            var day = new Date(item.time);
                            var day = day.getFullYear() + "-" + day.getMonth() + "-" + day.getDay();
                            var key = day + "," + item.target;
                            if (!targets.hasOwnProperty(key)) {
                                targets[key] = {};
                                targets[key]['difficulity'] = parseFloat(item.difficulity);
                                targets[key]['completeness'] = parseFloat(item.completeness);
                                targets[key]['count'] = 1;
                            } else {
                                targets[key]['difficulity'] += parseFloat(item.difficulity);
                                targets[key]['completeness'] += parseFloat(item.completeness);
                                targets[key]['count'] += 1;
                            }
                            workoutCount++;
                        }

                    });
                    if (workoutCount > 0) {
                        for (item in targets) {
                            targets[item]['difficulity'] = Math.log(targets[item]['difficulity']/targets[item]['count']);
                            targets[item]['completeness'] = Math.log(targets[item]['completeness']/targets[item]['count']);
                            inserts.push({uid:uid, target:item.split(",")[1], completeness:parseFloat(targets[item]['completeness']), difficulity:targets[item]['difficulity'], time:new Date() });
                        }
                        targetLogCollection.insert(inserts, {safe:true, w:0}, function(err, doc){
                            workoutLogCollection.update({uid:uid},{$set:{clearance:true}},{multi:true} , function(err, doc){
                                fullfill();
                            });
                        });
                    } else {
                        fullfill();
                    }
                });
            });
        },
        plan: function(targetPlanCount) {

            var plans = [];

            var getSinglePlan = function(currentPlanId, targetDate, callback) {
                    if (currentPlanId >= targetPlanCount) {
                        callback();
                        return;
                    }
                    var targetDateNext = new Date(targetDate.getTime() + 24 * 3600 * 1000);
                    determineTarget(true, targetDate).then(function (doc) {
                        var inserts = [];
                        for (item in doc.list) {
                            inserts.push({
                                uid: uid,
                                target: doc.list[item],
                                completeness: STANDARD_COMPLETENESS_RATE,
                                difficulity: doc.diff,
                                time: targetDate,
                                simulate: true
                            });
                            plans.push({target: doc.list[item], difficulity: doc.diff, time: targetDate});
                        }
                        targetLogCollection.insert(inserts, {safe: true}, function (err, doc) {
                            getSinglePlan(currentPlanId + 1, targetDateNext, callback);
                        });
                    });
            };

            if (uid === undefined) {
                throw new Error("uid is not defined");
            }
            return new Promise(function (fullfill, reject){
                targetLogCollection.remove({uid:uid, simulate:true}, function(err, doc){
                    getSinglePlan(0, new Date(), function(){
                        fullfill(plans);
                    });
                });
            });


        }
    }
};

module.exports = workoutlistModel;