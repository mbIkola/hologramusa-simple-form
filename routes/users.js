var express = require('express');
var router = express.Router();

function userRoutes( app ) {

    router.get('/', function(req, res) {
        console.log("list of users ");
        app.User.find()
            .exec()
            .then(users => {
                users = (users || []).map(u => u.getPublicProjection());
                res.render('users', {title: "List of users", users: users});
            })
            .catch(err =>
                res.render('fatal', {error: err})
            );
    });

    router.put('/', function(req, res) {
        req.body.password = req.body.password || Math.random().substr(2).toString(16);
        if ( ! req.body.email ) {

            res.sendStatus(400, "Can not create user without email");
            return;
        }

        var user = new app.User(req.body);
        user.password = req.body.password;

        user.save()
            .then(function(user)  {
                res.send(user.getPublicProjection());
            })
            .catch(err => {
                console.error(err);
                res.sendStatus(400);
            });
    });


    router.post('/', function(req, res) {
       var userId = req.body.id;
       if ( ! userId ) {
           console.log("Can't update user without id. Use PUT method to create user");
           return res.send(400);
       }
       console.log("updating user : " + userId + " " + JSON.stringify(req.body));
       app.User.findOne({_id: userId})
           .exec()
           .then(function( user) {
               //console.log({ err, user});
                if ( ! user ) {
                    throw new Error(404, "User not found");
                }

                [ "password", "firstname", "lastname", "role", "email"].forEach((i) => {
                    if ( req.body[i] ) {
                        user[i] = req.body[i];
                    }
                });


                return user.save();
           })
           .then( user => res.send(user.getPublicProjection()))
           .catch(err =>  {
               console.error(err);
               res.status(500);
           });
    });

    router.delete('/', function(req, res) {

            app.User.find({_id: req.body.id})
                .remove()
                .exec()
                .then(() => res.send(202))
                .catch(err => {
                    console.error("Requested to delete user ", req.body, "but got an error", err);
                    res.send(500, err)
                });
    });

    return router;
}

module.exports = userRoutes;

