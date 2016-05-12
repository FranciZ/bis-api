
// initialize database
// initialize resources

var server = require('./server');
var database = require('./database');
var resources = require('./resources');
var seed = require('./seed');

global.CFG = require('./config');

function init(){

    server.init()
        .then(database.init)
        .then(function(){

            return resources.init(server.getServer());

        })
        .then(seed.seedAdmin)
        .then(function(){

            console.log('All is well!');

        })
        .catch(function(err){

            console.log(err);

        });

}

init();