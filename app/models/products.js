var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PrdSchema = new Schema({

    id: Number,
    Name: String,
    Description: String,
    Price: Number,
    Stock: Number,
    Packing: String,
    Status: Boolean

});

module.exports = mongoose.model('Product', PrdSchema);