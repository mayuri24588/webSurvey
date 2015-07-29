var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); //mongo connection

/*
 * GET survey.
 */
router.get('/surveylist', function(req, res) {
    mongoose.model('Survey').find({}, function (err, surveys) {
    	res.json(surveys);
    });
});

// Add new record
router.post('/addsurvey', function(req, res) {
	mongoose.model('Survey').create({
            gender : req.body.gender,
            condition : req.body.condition,
            state : req.body.state,
            reg_date : req.body.reg_date
        }, function (err, survey) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  console.log('POST Adding new Survey: ' + survey);
                  res.send(
           			 (err === null) ? { msg: '', redirect : "/view" } : { msg: err }
       			  );
                
              }
        })
});

module.exports = router;
