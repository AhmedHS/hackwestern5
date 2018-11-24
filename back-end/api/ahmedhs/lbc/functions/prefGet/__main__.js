const mongoose = require('mongoose');
var Pref = require('../../models/prefs.js');

let db = null;

module.exports = (username = '', callback) => {
    if (username === '') {
        return 'Must provide a name.';
    }
    else {
        db = db || (mongoose.connect(process.env.MONGO_CONNECTION_STRING));
        let result = null;

        Pref.findOne({'username': username}, function(err, prefs) {
            if (err)
               return err;
            callback(null, JSON.stringify(prefs));
        });
    }
};
