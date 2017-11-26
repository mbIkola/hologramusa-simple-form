var express = require('express');
var router = express.Router();
var assert = require('assert');
var _ = require('underscore');
var mailer = require('nodemailer');
var config = require('../config.js');
var MongoClient = require('mongodb').MongoClient;
var url =  'mongodb://' + config.MONGO_HOST + ":27017/" + config.MONGO_DB;

function getConnection() {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            if ( err !== null) {
                return reject(err);
            }
            return resolve(db);
        });
    });
}


function saveform( data, collectionName ) {

    return getConnection().then( function(db) {
        return new Promise( function(resolve, reject) {
            db.collection(collectionName).insertOne(data, function(err, result) {
                db.close();
                if ( err !== null ) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(result)
            });
        });
    }).catch( function(err)  {
        console.error(err);
    });
}

function getData( collectionName ) {
    return getConnection().then(function(db) {

        return new Promise(function(resolve, reject) {
            db.collection(collectionName).find({})
                .sort({ "created_at_timestamp" : -1})
                .toArray(function(err, docs) {
                db.close();
                if ( err !== null ) reject(err);
                else resolve(docs);
            });
        });
    });
}


function sendMail( data ) {

    var transport = mailer.createTransport({
        host: config.SMTP_HOST,
        auth : {
            'user' : config.SMTP_USER,
            'pass' : config.SMTP_PASS
        },
        from : config.SMTP_FROM
    });


    var ejs = require('ejs');
    var template = new Promise(function(resolve, reject) {
        ejs.renderFile(__dirname + "/../views/mail/mail.ejs", data, function(err, template) {
            console.info("Render:", template);
            if ( err === null ) resolve(template); else reject(err);
        });
    });

    return function() {
        template.then(function (htmlmessage) {
            var message = {
                to: data['email'],
                html: htmlmessage
            };
            return new Promise(function (resolve, reject) {
                transport.sendMail(message, function (err, info) {
                    console.log("Mail sent: ", [err, info]);
                    if (err === null) {
                        resolve(info);
                    } else {
                        reject(err);
                    }
                });
            });

        }).then(function (mailerinfo) {
            console.info(mailerinfo);
            transport.close();

        }).catch(function (err) {
            console.error(err);
            transport.close();
        });
    }
}
function sendMailAsync(data) {
    setTimeout(sendMail(data), 100);
}

/* GET list of submitted forms */
router.get('/', function(req, res, next) {
    getData("callcentre-form-v1").then(function(rows) {
        res.send(rows);
    }).catch(function(err) {
        res.error(err);
    });
});

router.get('/testmail', function(req, res, next) {
    sendMailAsync({fullname: "Nickolay", email: "nickolay.kharchevin@filmon.com"});
    res.send('ok');
});

var allowedScheme = "fullname,company,state,phone,email,amount,hear,referral,notes".split(",");

router.post('/', function(req, res, next) {
    var data = _.pick (req.body, allowedScheme);
    data.created_at_timestamp = + new Date();
    data.created_at = new Date() + "";
    console.log("About to save ", data);
    saveform(data, "callcentre-form-v1").then( function() {
        sendMailAsync(data);
        res.send('Got it');
    }).catch( function(err) {
        res.error(err);
    });

});

module.exports = router;
