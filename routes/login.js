var express = require('express');
var router = express.Router();

function loginRoutes( app ) {
    /* GET users listing. */
    router.get('/', function (req, res, next) {
        res.render('login', {title: "Please login to proceed"});
    });


    router.post('/', function (req, res, next) {
        app.User.findOne({email: req.body.email}).exec()
            .then(function(user) {
                if ( user && user.authenticate(req.body.password)) {
                    req.session.user_id = user._id;
                    req.session.save();
                    console.log(req.session);
                    res.sendStatus(202);
                } else {
                    res.sendStatus(404);
                }
            }).catch(err => {
                console.error(err);
                res.sendStatus(500, err);
            });
    });

    router.delete('/', function(req, res, next) {
       req.session.user_id = null;
       res.sendStatus(202);
    });

    return router;
}

module.exports = loginRoutes;
