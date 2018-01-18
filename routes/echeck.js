var express = require('express');
var router = express.Router();
var Greenmoney = require('greenmoney').default;

var greenmoney = new Greenmoney( "ClientID", "APIPassword");



router.get('/', function(req, res) {
   res.render('echeck', {usps: require('us-states'), title: 'eCheck'});
});


router.post('/', function(req, res) {
   greenmoney.oneTimeDraftRTV(...req.body).then((e) => res.status(200)).catch(err => console.error(err));
});


module.exports = router;
