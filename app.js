const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const config = require('./config');
const mongoDbUrl =  'mongodb://' + config.MONGO_HOST + ":27017/" + config.MONGO_DB;


const app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


app.set('db-uri', mongoDbUrl);
app.set('db', mongoose.connect(mongoDbUrl,  { useMongoClient: true }));
mongoose.Promise = global.Promise;


app.User = require('./models/user')(app.get('db'));
app.Investments = require('./models/investments')(app.get('db'));


app.use(session({
    saveUninitialized: false, // don't create session until something stored
    resave: true,
    cookie: { maxAge: 2628000000 },
    secret: "eat, sleep, rave, repeat",
    store: new MongoStore( {
        url : mongoDbUrl,
        ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    })
}));


function authMiddleware(req, res, next) {
    if ( req.session.user_id) {
        app.User.findById(req.session.user_id).then( function(user) {
            if ( user ) {
                req.currentUser = user ;
                req.currentUserId = req.session.user_id;
                next();
            } else {
                console.error("Could not find user in database: ", req.session.user_id )
                res.redirect('/callcenter/login');
            }
        }).catch( err => {
            console.error("Auth fail: ", err);
            res.redirect('/callcenter/login');
        });
    } else {
        console.log("Unauthorized access  to /list");
        res.redirect('/callcenter/login');
    }
}
function adminOnlyAuthMiddleware(req, res, next) {
    authMiddleware(req, res, function() {
        if ( req.currentUser.role === "admin" ) {
            next();
        } else {
            console.warn("Admin access forbidden for " + req.currentUser.email);
            res.sendStatus(403);
        }
    });
}

var base='/'; //"/callcenter/"
app.use(base, require('./routes/index'));
app.use(base + 'api', require('./routes/api'));
app.use(base + 'list', authMiddleware,  require('./routes/list')(app));
app.use(base + 'users', adminOnlyAuthMiddleware, require('./routes/users')(app));
app.use(base + 'login', require('./routes/login')(app));
app.use(base + 'edit', authMiddleware, require('./routes/investment')(app));




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
