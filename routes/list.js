var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('list', {title: "List of submitted forms"});
});

module.exports = router;
