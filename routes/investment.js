var express = require('express');
var router = express.Router();

function routes( app ) {
    function ensureAccessRightsMiddleware(req, res, next) {
        var investmentId = req.params.investmentId;
        console.log(req.params);
        app.Investments.findOne({_id : investmentId })
            .exec()
            .then( (row) => {

                if ( ! row ) {
                    console.error("Could not find doc", investmentId);
                    return res.sendStatus(404);
                }
                if ( req.currentUser.role !== 'admin' ) {
                    if ( row.salesman && row.salesman != req.currentUser._id.toString() ) {
                        console.error("Restricted access: ", row.salesman , req.currentUser._id.toString(), row.salesman != req.currentUser._id.toString());
                        return res.sendStatus(403);
                    }
                }
                req.row = row;
                next();
            });
    }
    router.get('/next', function(req, res) {
        app.Investments.findOne( { salesman : undefined }).then((investment) => {
            console.log("Next unassigned: ", investment, req);

            if ( investment ) {
                res.redirect(req.originalUrl.replace('next', investment._id));
            } else {
                res.redirect(req.originalUrl.replace('edit/next', 'list'));
            }
        });
    });

    /* GET users listing. */
    router.get('/:investmentId', ensureAccessRightsMiddleware, function (req, res, next) {

        Promise.all([
            //app.Investments.findOne({_id : req.params.investmentId}).exec(),
            req.currentUser.role === 'admin' ? app.User.find().exec() : [ req.currentUser ]
        ])
        .then( (users) => {
            var row = req.row, users = users[0];
            res.render('edit', {
                title: "Request #" + req.params.investmentId + "," + row.email,
                user: req.currentUser,
                users,
                row
            });
        })

    });


    router.post('/:investmentId', ensureAccessRightsMiddleware, function(req, res, next) {
        if ( req.body.salesman ) {
            req.row.salesman = req.body.salesman;
        } else if ( req.body.comment ) {
            req.row.notes.push(
                "[" + (new Date()).toISOString().slice(0, 10) + "] by <" + req.currentUser.email + ">: "
                + req.body.comment + ""
            );
        } else {
            for ( let i in req.body ) {
                req.row[i] = req.body[i];
            }
        }

        req.row.save().then( () => res.sendStatus(202));
    });

    return router;
}

module.exports = routes;
