var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var prefSchema = new Schema({
   username:String,
   start: Number,
   end: Number,
   prefStart: Number,
   prefEnd: Number,
   daysExcluded: [String],
   wellness: [[String, Number, Number, Number, Number, Number, String]],
});
module.exports = mongoose.model('Pref', prefSchema);    
//start, end, prefstart, prefend, days to be excluded - array of strings, wellness activities (name, max, min) - array of objects, 