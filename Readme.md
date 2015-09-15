API of HEALTH APP

##workout/

####list:

list the recommend list of Workouts

Parameter: uid

example: /workout/list?uid=1

return sample:
    {"status":1,"data":[{"_id":"55336beb7c0101abb3a305c0","name":"重锤下压","difficulity":0.1,"sequence":3,"standard_set":12,"set_count":4,"target":"tricep"},{"_id":"55336beb7c0101abb3a305c1","name":"站立臂屈伸","difficulity":0.4,"sequence":3,"standard_set":12,"set_count":4,"target":"tricep"},{"_id":"55336beb7c0101abb3a305c2","name":"单手哑铃臂曲伸","difficulity":0.2,"sequence":3,"standard_set":12,"set_count":4,"target":"tricep"},{"_id":"55336beb7c0101abb3a305c5","name":"颈后哑铃臂屈伸","difficulity":0.3,"sequence":3,"standard_set":12,"set_count":4,"target":"tricep"}],"url":"/workout/list?uid=1"}

####add_track

Add The Track when a set is done

Parameter:
    Post: difficulity: 0~1 float number
          completeness: 0~1 float number
          expend: json object, depends on workout
          workout_name: String, the name of workout
    Get: uid

return sample:
    {"status":1,"data":[{"expend":{},"difficulity":"0.2","completeness":"0.9","workout_name":"哑铃弯举","clearance":false,"time":"2015-04-21T03:58:01.265Z","uid":"1","target":"bicep","_id":"5535cac924ffa01804000001"}],"url":"/workout/add_track?uid=1"}