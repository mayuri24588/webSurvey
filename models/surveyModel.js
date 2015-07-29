var mongoose = require('mongoose');
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
 var surveySchema = new Schema({
   gender     : { type: String, required: true},
    condition  : { type: String, required: true},
    state      : { type: String, required: true},
    reg_date   : { type: Date, default: Date.now }
});

mongoose.model('Survey', surveySchema);
