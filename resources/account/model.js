var mongoose = require('mongoose');

var Schema = new mongoose.Schema({

    name        : String,
    surname     : String,
    email       : { type : String, unique : true, required:true },
    password    : String,
    dateCreated : { type:Date, default:Date.now },
    role        : String,
    status      : Number, // active = 1, invited = 0, banned = 2
    dateOfBirth : Date,
    doctorCode  : String,
    gender      : String,
    profileImage: String,
    kzz         : String,
    inviteCode  : String,
    tokens      : [
        {
            token   : String,
            expires : {
                type : Date,
                default : function(){ return Date.now() + 1000*60*60*24*14 }
            }
        }
    ]

});

mongoose.model('Account', Schema);

















