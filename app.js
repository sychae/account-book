var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var log = require("./fstapp/log.js");


log.debug("hello");
var app = express();
var webServer = http.createServer(app);
console.log('app app app');
app.use(session({
    secret: 'sychae!23',
    resave: false,
    saveUninitialized: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var db = require('./fstapp/db.js');
var member = require("./fstapp/member");

var router = require('./routes/index')(app, member);
var bankbook = require('./routes/bankbook')(app, member);
var card = require('./routes/card')(app, member);
var inout = require('./routes/inout')(app, member);
var memo = require('./routes/memo')(app, member);
var error = require('./routes/error')(app);


db.open(function () {
    webServer.listen(process.env.PORT || 8080, function listening() {
        console.log('Listening on %d', webServer.address().port);
    });
})
module.exports = app;

