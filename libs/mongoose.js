var mongoose    = require('mongoose');
var log         = require('./log')(module);
var config      = require('./config');

mongoose.connect(config.get('mongoose:uri'));

// mongoose.connect('mongodb://localhost/test1');
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

// Schemas
var Record = new Schema({
    id: { type: String, required: true },
    country: { type: String, required: true },
    visa_required: { type: String, required: true },
    days_to_get: { type: String, required: true },
});

// validation
// Record.path('title').validate(function (v) {
//     return v.length > 5 && v.length < 70;
// });

var RecordModel = mongoose.model('RecordModel', Record);

module.exports.RecordModel = RecordModel;