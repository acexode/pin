const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    expressValidator = require('express-validator'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    mongdb = require('mongodb'),
    db = require('monk')('localhost/pin'),
    multer = require('multer'),
    flash = require('connect-flash'),
    exphbs = require('express-handlebars'),
    moment = require('moment'),
    index = require('./routes/index'),
    post = require('./routes/post');

var app = express();

// view engine setup
exphbs.registerHelper
hbsEngine = exphbs.create({
    extname: 'handlebars',
    defaultLayout: 'main.handlebars',
    helpers: {
        formatDate: function(date, format) {
            return moment(date).format("MM-DD-Y");
        }
    }
});
//app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
//app.set('view engine', 'handlebars');
app.engine('handlebars', hbsEngine.engine);
app.set('view engine', 'handlebars');

// uploads files
const upload = multer({ dest: './public/images/uploads' })

//moment 
//app.locals.moment = require('moment')
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// save sessions
app.use(session({
        secret: 'iknowyoursecret',
        saveUninitialized: true,
        resave: true
    }))
    // express validator {https://github.com/ctavan/express-validator}
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//static files
app.use(express.static(path.join(__dirname, 'public')));

// flash
app.use(flash())
app.use(function(req, res, next) {
    res.locals.message = require('express-messages')(req, res);
    next();
});
// db
app.use(function(req, res, next) {
    req.db = db;

    next();
});


app.use('/', index);
app.use('/posts', post);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;