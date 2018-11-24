const mongoose = require('mongoose');
var Pref = require('../../models/prefs.js');

let db = null;

module.exports = (id = '', newName = '', callback) => {
    if (id === '' || newName === '') {
        callback('Must provide an id for a preference to update and new name', null);
    }
    else {
        db = db || (mongoose.connect(process.env.MONGO_CONNECTION_STRING));
        Pref.findById(id, function(err, pref) {
            if (err)
                return (err);
            console.log(pref);
            pref.name = newName;  // update the items info

            // save the item
            pref.save(function(err) {
                if (err)
                    return (err);
                callback(null, 'Preference updated!');
            });
        });
    }
};
