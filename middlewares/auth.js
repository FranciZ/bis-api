var mongoose = require('mongoose');

module.exports = function(req, res, next){

    var token = req.headers.authorization;

    if(token !== undefined){

        var Account = mongoose.model('Account');

        Account.findOne({'tokens.token':token}, function(err, accountDoc){

            if(!err){

                if(accountDoc){

                    req.account = accountDoc;
                    next();

                }else{
                    res.status(401).send('Not allowed');
                }

            }

        });

    }else{
        res.status(401).send('Not allowed');
    }

};