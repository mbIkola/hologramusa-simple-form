var express = require('express');
var router = express.Router();

function createRoutes( app ) {
    /* GET users listing. */
    function getAllUsers(query) {
        query = query || {};
        return app.User.find(query).exec();
    }

    function getFilteredByAuthClaimsQuery(req) {
        var query = {};
        if (req.currentUser.role === 'admin') {
            query = {};
        } else {
            query = {$or: [{"salesman": req.currentUser._id}, {"salesman": {$exists: false}}, {"salesman": {$in: [null, undefined]}}]};
        }
        return query;
    }

    router.get('/', function (req, res, next) {

        console.log(req.currentUser);
        var query = getFilteredByAuthClaimsQuery(req);
        Promise.all( [
            app.Investments.find(query).sort({created_at_timestamp: -1}).exec(),
            getAllUsers(req.currentUser.role === "admin" ? {} : { _id : req.currentUser._id })
        ]).then((everything) => {
            return {
                investors: everything[0],
                users: everything[1]
            };
        }).then( everything =>  {
                investors = everything.investors || [];
                users = everything.users || [];

                res.render('list',
                    {
                        title: "List of submitted forms",
                        investors,
                        row: investors[0],
                        user: req.currentUser,
                        users
                    });
        }).catch(err => {
            console.error(err);
            res.render('fatal');
        });
    });
    router.post('/archive', function(req, res, next) {
       var toClose = req.body;
        var query = getFilteredByAuthClaimsQuery(req);
        query._id = { $in : toClose }  ;

	app.Investments.updateMany( query, {$set: {is_archived: true}}, {upsert: false})
	.exec().then(function(results) {
            console.log("Closed claims:" + toClose.join() + " by " + req.currentUser.email);
            console.log(results);
            res.send(202);
        }).catch( err => {
            console.error("Error while archiving claims:", err);
            res.send(500);
        });
    });

  return router;
}
module.exports = createRoutes;
