var PERDICTING_DAYS=5


var clearWorkout = function(uid) {
  var workoutlistModel = system.getModel('workoutlist')(uid);
    workoutlistModel.targetClearance();
};

var workoutController = {

    list:function(req, res) {
        try {
            var uid = req.query.uid;
            clearWorkout(uid);
            var workoutlistModel = system.getModel('workoutlist')(uid);
            workoutlistModel.list().then(function (list) {
                var success = new global.successModel(list,req);
                res.json(success.getObj());

            });
        } catch (e) {
            var fail = new global.failModel(e,req);
            res.json(fail.getObj());
        }
    },

    addTrack: function(req, res) {
        try {
            var uid = req.query.uid;
            if (uid == undefined || uid == null) {
                throw new Error("uid is essential");
            }
            var difficulity = req.body.difficulity;
            var completeness = req.body.completeness;
            var workout_name = req.body.workout_name;
            var expend;
            if (!(difficulity != undefined && completeness != undefined  && global.validateFloat(difficulity) && global.validateFloat(completeness) && workout_name != undefined)) {
                console.log(global.validateFloat(difficulity));
                throw new Error("difficulity and completeness should be number and should be lower then 1, and greater then 0, workout name must be exists");
            }
            var data = {};
            if (req.body.expend != undefined && req.body.expend != null) {
                data['expend'] = JSON.parse(req.body.expend);
            }
            data['difficulity'] = difficulity;
            data['completeness'] = completeness;
            data['workout_name'] = workout_name;
            data['clearance'] = false;

            var workoutModel = system.getModel('workout')(uid);
            workoutModel.addTrack(data).then(function(doc){
                var success = new global.successModel(doc, req);
                res.json(success.getObj());
            });
        } catch(e) {
            var fail = new global.failModel(e,req);
            res.json(fail.getObj());
        }
    },
    evaluateDifficulity: function(req,res) {

    },
    plan: function(req,res) {

        var uid = req.query.uid;
        if (uid == undefined || uid == null) {
            throw new Error("uid is essential");
        }
        var workoutList = system.getModel('workoutlist')(uid);
        workoutList.plan(PERDICTING_DAYS).then(function(doc){
            var success = new global.successModel(doc, req);
            res.json(success.getObj());
        });
    }

};

module.exports = workoutController;