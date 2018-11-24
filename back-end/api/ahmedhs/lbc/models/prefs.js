var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var prefSchema = new Schema({
   name:String,
});
module.exports = mongoose.model('Pref', prefSchema);    