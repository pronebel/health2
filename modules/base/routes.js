exports.routes = [

    {route: '/editor', controller: 'editor', action:'index',type:'POST'},
    {route: '/editor', controller: 'editor', action:'index',type:'GET'},



    { route: '/weibo/api', controller: 'weibo', action: 'cmd', type: 'POST' },
    { route: '/weibo/test', controller: 'weibo', action: 'test' },

    {route: '/auth', controller: 'auth', action:'login'},
    {route: '/auth/login', controller: 'auth', action:'extLogin'},
    {route: '/callback', controller: 'auth', action:'callback'},
];
