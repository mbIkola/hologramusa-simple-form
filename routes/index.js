var express = require('express');
var router = express.Router();

var theFormSpec =  [
    {
      name :  "Name",
      placeholder: "John Doe",
      type: "text",
      id: "name"
    }

]



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HologramUSA Sales Automation Something', form: theFormSpec });
});

module.exports = router;
