const mongoose = require('mongoose');
var Pref = require('../../models/prefs.js');

let db = null;

module.exports = (username = '', start = 0, end = 0, prefStart = 0, prefEnd = 0, daysExcluded = '', wellness = '', callback) => {
    if (username === '' || start === 0 || end === 0 || prefStart === 0 || prefEnd === 0 || daysExcluded ==='' || wellness === '') {
        callback('Must provide an id for a preference to update and the new parameters', null);
    }
    else {
        db = db || (mongoose.connect(process.env.MONGO_CONNECTION_STRING));
        var comma = daysExcluded.split(',');
        var daysExcl = [];
        for(var i =0; i < comma.length; i++){
            console.log(comma[i]);
            daysExcl.push(comma[i]);
        }
        Pref.findOne({'username': username}, function(err, pref) {
            if(err)
                return(err);
            console.log(pref);
            pref.start          = start;
            pref.end            = end;
            pref.prefStart      = prefStart;
            pref.prefEnd        = prefEnd;
            pref.daysExcluded   = daysExcl;
            pref.wellness       = wellness;
            pref.save(function(err) {
                if (err)
                    return (err);
            });
            callback(null, 'Preference updated!');
        });
    }
};
