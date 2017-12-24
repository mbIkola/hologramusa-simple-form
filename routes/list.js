var express = require('express');
var router = express.Router();

function createRoutes( app ) {
    /* GET users listing. */
    function getAllUsers(query) {
        query = query || {};
        return app.User.find(query).exec();
    }

    router.get('/', function (req, res, next) {

        console.log(req.currentUser);
        var query = {};
        if ( req.currentUser.role === 'admin' ) {
             query = {};
        } else {
            query = { $or: [{ "salesman" : req.currentUser._id }, {"salesman" : {$exists : false}}, {"salesman" : { $in: [null, undefined] }}]};
        }
        Promise.all( [
            app.Investments.find(query).exec(),
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

  return router;
}
module.exports = createRoutes;
