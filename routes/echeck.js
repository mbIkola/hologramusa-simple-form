var express = require('express');
var router = express.Router();
const config = require('../config');
var Greenmoney = require('greenmoney');
var greenmoney = new Greenmoney(config.GREENMONEY_CLIENT_ID, config.GREENMONEY_API_PASSWORD, true);



router.get('/', function(req, res) {
   res.render('echeck', {usps: require('us-states'), title: 'eCheck'});
});


router.post('/', function(req, res) {
   console.log("GOT POST Request", req.body); ///ereenmoney);
   let d = new Date();
   let todayDate = ('0' + (d.getMonth() + 1)).substr(-2) + '/' + ('0' + d.getDate()).substr(-2) + '/' + d.getFullYear();
   try { 
   let str = req.body.phone.replace(/-/ig, '');
   req.body.phone = str.slice(0,3) + '-' + str.slice(3,6) + '-' + str.slice(6);
   greenmoney.oneTimeDraftRTV(
       req.body.name, req.body.phone, req.body.address1, req.body.city, req.body.state,
       req.body.zip, req.body.routingNumber, req.body.accountNumber, req.body.bankName, req.body.checkAmount,
       {
           EmailAddress : req.body.email || '',
           CheckMemo: 'Hologram USA Investment',
           CheckDate: todayDate, //(d.getMonth()+1)  + '/' + d.getDate() + '/' + d.getFullYear() , ///03/03/2018',
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
       console.error("Form Rejected,", err);
       res.status(500).json( {message: err.message});
   } );
   } catch( err ) {
   	console.error("Error: ", err);
	res.status(500).json( { message: err.message } );
   }
});


module.exports = router;
