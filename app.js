/**
 * Sleek app init
 * Here we iniialize :: Its better to dont edit, if you're a beginner :)
 *
 * @package Sleek.js
 * @version 1.0
 *
 * The MIT License (MIT)

 * Copyright Cubet Techno Labs, Cochin (c) <2013> <info@cubettech.com>

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//require our needs
var express = require('express'),
    http = require('http'),
    path = require('path'),
    exphbs = require('express3-handlebars'),
    helmet = require('helmet'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    favicon = require('serve-favicon'),
    json = require('json'),
    urlencoded = require('urlencode'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    socketio = require('socket.io'),
    multer  = require('multer');



global.app = express();

global.sleekConfig = {};
require(path.join(__dirname, 'application/config/config.js'));

app.set('env', sleekConfig.env);
app.set('x-powered-by', 'Sleek.js');
// all environments
app.set('port', process.env.PORT || sleekConfig.appPort);
app.set('host', sleekConfig.appHost ? sleekConfig.appHost : 'localhost');
app.set('views', path.join(__dirname, 'application/views'));
app.set('view engine', 'handlebars');
app.engine('html', exphbs({
        defaultLayout: 'default',
        layoutsDir: path.join(__dirname, 'application/layouts/'), extname: ".html"
    })
);
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(helmet.xframe());
app.use(helmet.iexss());
app.use(helmet.contentTypeOptions());
app.use(helmet.cacheControl());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    secret: 'CubEtNoDeSlEek',
    saveUninitialized: true,
    resave: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({ dest: path.join(__dirname, 'application/var/img/')}));

app.set('strict routing');
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","*");

    next();
});
//set Site url
global.sleekConfig.siteUrl = 'http://' + app.get('host') + ':' + app.get('port');
//get configs
require('./system/core/sleek.js')(app);
// development only
if ('development' === app.get('env')) {

}

var server = http.createServer(app);
global.sleekio  =socketio(server);


try {
    server.listen(app.get('port'), app.get('host'), function () {
        console.log('server listening on port ' + sleekConfig.siteUrl);
    });
} catch (e) {
    system.log(e);
}
