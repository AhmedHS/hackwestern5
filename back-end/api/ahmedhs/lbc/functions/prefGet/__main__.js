const mongoose = require('mongoose');
var Pref = require('../../models/prefs.js');

let db = null;

module.exports = (name = '', callback) => {
    if (name === '') {
        return 'Must provide a name.';
    }
    else {
        db = db || (mongoose.connect(process.env.MONGO_CONNECTION_STRING));
        let result = null;
        let prefsSchema = mongoose.Schema({
            name: String
        });
        Pref.findOne({'name': name}, function(err, prefs) {
            if (err)
               return err;
            callback(null, JSON.stringify(prefs));
        });
    }
};
