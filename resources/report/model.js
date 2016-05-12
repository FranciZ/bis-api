var mongoose = require('mongoose');

var Schema = new mongoose.Schema({

    number          : String,
    title           : String,
    body            : String,
    createdBy       : { type:String, ref:'Account'},
    authorizedBy    : { type:String, ref:'Account'},
    accountRef      : { type:String, ref:'Account'},
    dateCreated     : { type:Date, default:Date.now }

});

mongoose.model('Report', Schema);