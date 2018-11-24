const mongoose = require('mongoose');
var mongoDB = 'mongodb://bobby:bobbyadmin123@ds115664.mlab.com:15664/lbcdb';

let db = null;

module.exports = async(name = '', context) => {
    if (name === '') {
        return 'Must provide a name.';
    }
    else {
        db = db || (await mongoose.connect(process.env.MONGO_CONNECTION_STRING));
        let prefsSchema = mongoose.Schema({
            name: String
        });
        let Pref = mongoose.model('Pref', prefsSchema);
        let prefs = new Pref({ name: name });
        await prefs.save();
        return 'Preference added!';
    }
};
