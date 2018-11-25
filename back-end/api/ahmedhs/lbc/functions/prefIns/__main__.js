const mongoose = require('mongoose');
var Pref = require('../../models/prefs.js');

let db = null;

module.exports = (username = '', start = 0, end = 0, prefStart = 0, prefEnd = 0, daysExcluded = '', wellness = '', callback) => {
    if (username === '' || start === 0 || end === 0 || prefStart === 0 || prefEnd === 0 || daysExcluded ==='' || wellness === '') {
        callback('Must provide all attributes.', null);
    }
    else {
        db = db || (mongoose.connect(process.env.MONGO_CONNECTION_STRING));
        var comma = daysExcluded.split(',');
        var daysExcl = [];
        for(var i =0; i < comma.length; i++){
            console.log(comma[i]);
            daysExcl.push(comma[i]);
        }
        let prefs = new Pref({ 
            username:       username, 
            start:          start,
            end:            end,
            prefStart:      prefStart,
            prefEnd:        prefEnd,
            daysExcluded:   daysExcl,
            wellness:       wellness,
        });
        Pref.find({username: username}, function(err, pref) {
            if(pref.length == 0){
                prefs.save(function (err) {
                    if (err) 
                        return(err);
                });
             callback(null, 'Preference added!');
            }
            else {
                callback('A preference with this username already exists', null);
            }
        });

    }
};
