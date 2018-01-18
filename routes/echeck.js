var express = require('express');
var router = express.Router();
const config = require('../config');
var Greenmoney = require('greenmoney').default;
var greenmoney = new Greenmoney(config.GREENMONEY_CLIENT_ID, config.GREENMONEY_API_PASSWORD);



router.get('/', function(req, res) {
   res.render('echeck', {usps: require('us-states'), title: 'eCheck'});
});


router.post('/', function(req, res) {
//   console.log("GOT POST Request", greenmoney);
   greenmoney.oneTimeDraftRTV(
       req.body.name, req.body.phone, req.body.address1, req.body.city, req.body.state,
       req.body.zip, req.body.routingNumber, req.body.accountNumber, req.body.bankName, req.body.checkAmount
   ).then((e) => {
       console.log("Success:::", e);
       res.status(200).json(e);
   })
   .catch(err => {
       console.error("Form Rejected," + err.message);
       res.status(500).json( {message: err.message});
   } );
});


module.exports = router;
