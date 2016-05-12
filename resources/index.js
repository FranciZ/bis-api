
exports.init = function(server){

    // require all resources
    // when adding new resource add a require statements for all the resource components

    require('./account/model');
    require('./account/routes')(server);

    require('./report/model');
    require('./report/routes')(server);

    return true;

};