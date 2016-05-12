var mongoose = require('mongoose');
var Promise = require('bluebird');

exports.init = function(){

    return new Promise(function(resolve, reject){

        mongoose.connect('mongodb://localhost/bis-db');

        mongoose.connection.on('error', function(err){

            reject();

        });

        mongoose.connection.once('open', function(){

            console.log('Database ready');
            resolve();

        });

    });

};