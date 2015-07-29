var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Please take below survey' });
});

/* GET result page. */
router.get('/view', function(req, res, next) {
  res.render('index', { title: 'Survey result of User emotional conditions' });
});

module.exports = router;
