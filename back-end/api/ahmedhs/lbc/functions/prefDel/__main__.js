const mongoose = require('mongoose');
var Pref = require('../../models/prefs.js');

let db = null;

module.exports = (id = '', callback) => {
    if (id === '') {
        return 'Must provide an id for a preference to delete.';
    }
    else {
        db = db || (mongoose.connect(process.env.MONGO_CONNECTION_STRING));

        Pref.remove({
            _id: id
        }, function(err, item) {
            if (err)
                return err;
            callback(null, 'Successfully deleted!');
        });
    }
};
