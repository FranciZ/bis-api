var express = require('express');
var server  = express();
var Promise = require('bluebird');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cors = require('cors');

exports.init = function(){

    return new Promise(function(resolve, reject){

        server.use(cors());
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended:true }));
        server.use(expressValidator());

        server.listen(3050, function(err){

            if(err){
                reject(err);
            }else{
                console.log('Server running on port 3050');
                resolve(server);
            }

        });

    });

};

exports.getServer = function(){

    return server;

};