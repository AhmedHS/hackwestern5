const mongoose = require('mongoose');
var Pref = require('../../models/prefs.js');

let db = null;

module.exports = (username = '', callback) => {
    if (username === '') {
        callback('Must provide a username for a preference to delete.',null);
    }
    else {
        db = db || (mongoose.connect(process.env.MONGO_CONNECTION_STRING));

        Pref.remove({
            username: username
        }, function(err, item) {
            if (err)
                return err;
            callback(null, 'Successfully deleted!');
        });
    }
};
