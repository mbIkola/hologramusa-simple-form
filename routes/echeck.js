var express = require('express');
var router = express.Router();
const config = require('../config');
var Greenmoney = require('greenmoney');
var greenmoney = new Greenmoney(config.GREENMONEY_CLIENT_ID, config.GREENMONEY_API_PASSWORD, true);



router.get('/', function(req, res) {
   res.render('echeck', {usps: require('us-states'), title: 'eCheck'});
});


router.post('/', function(req, res) {
//   console.log("GOT POST Request", greenmoney);
   greenmoney.oneTimeDraftRTV(
       req.body.name, req.body.phone, req.body.address1, req.body.city, req.body.state,
       req.body.zip, req.body.routingNumber, req.body.accountNumber, req.body.bankName, req.body.checkAmount,
       {
           EmailAddress : req.body.email || '',
           CheckMemo: '',
           CheckDate: '',
           CheckNumber: '',
           PhoneExtension: '',
           Country: 'US' ,
           Address2: req.body.address2 || '',
       }

   ).then((e) => {
       console.log("Success?:::", e);
       if (  (e.ResultDescription && e.ResultDescription.match(/invalid/i)) ||
             (e.VerifyResultDescription && e.VerifyResultDescription.match(/not accepted/i))) {
           res.status(400).json(e.toObject())
       } else {
           res.status(200).json(e.toObject());
       }
   })
   .catch(err => {
       console.error("Form Rejected," + err.message);
       res.status(500).json( {message: err.message});
   } );
});


module.exports = router;
