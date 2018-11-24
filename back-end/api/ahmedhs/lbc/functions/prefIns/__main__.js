const mongoose = require('mongoose');
var Pref = require('../../models/prefs.js');

let db = null;

module.exports = (name = '', callback) => {
    if (name === '') {
        callback('Must provide a name.', null);
    }
    else {
        db = db || (mongoose.connect(process.env.MONGO_CONNECTION_STRING));
        let prefs = new Pref({ name: name });
        prefs.save(function (err) {
            if (err) 
                return(err);
            callback(null, 'Preference added!');
        });
    }
};
