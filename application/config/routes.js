/* 
 * Routes.
 */








//define routes
exports.routes = [
    { route: '/', controller: 'index', action: 'index' },
    { route: '/login2', controller: 'index', action: 'login' },
    //api,weiboapi
    { route: '/api', controller: 'api', action: 'cmd', type: 'POST' },


    {route: '/socket', controller: 'index', action:'socket'},

    {route: '/train/analysis', controller: 'train', action:'analysis'},
    {route: '/train/baidu', controller: 'train', action:'baidu'},
    {route: '/station/address', controller: 'train', action:'stationAddress'},
    {route: '/station/addressing', controller: 'train', action:'stationAnalysisAddress'},

    {route: '/usr/exists', controller: 'usr', action:'exists'},
    {route: '/usr/add', controller: 'usr', action:'add', type:'POST'},


// workout list
    { route: '/workout/list', controller: 'workout', action: 'list' },
    { route: '/workout/add_track', controller: 'workout', action: 'addTrack', type:'POST' },
    { route: '/workout/evaluate_difficulity', controller: 'workout', action: 'evaluateDifficulity', type:'POST' },
    { route: '/workout/plan', controller: 'workout', action: 'plan' },
    { route: '/img/saveavatar', controller: 'img', action: 'saveAvatar', type:'POST' },
    { route: '/img/getavatar', controller: 'img', action: 'getAvatar' },
    { route: '/usr/getvaricode', controller: 'usr', action: 'getVarificationCode' },
    { route: '/usr/setgoal', controller: 'usr', action: 'setGoal', type:'POST' },
    { route: '/util/weather', controller: 'util', action: 'getWeather'}
];

//Define common function namess
exports.commonRouteFunctions = [];  // if use ['helper'],then add a 
                                    //function named helper in helpers/routes.js
                                    //with (req,res, next);
