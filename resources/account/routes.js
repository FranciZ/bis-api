var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var guid = require('guid');
var authMiddleware = require('../../middlewares/auth');

require('../../node_modules/mailin-api-node-js/V2.0/mailin.js');


module.exports = function(server){

    // READ
    server.get('/api/accounts', function(req, res){

        var Account = mongoose.model('Account');

        Account.find(function(err, accountDocs){

            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{
                res.send(accountDocs);
            }

        });

    });

    
    server.post('/api/account/login', function(req, res){

        //req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('password', 'Password is too short').notEmpty().isLength({min:5});

        var errors = req.validationErrors();

        if(errors){
            return res.status(400).send(errors);
        }

        var userData = req.body;

        var Account = mongoose.model('Account');

        Account.findOne({email:userData.email}, function(err, accountDoc){

            if(accountDoc){

                bcrypt.compare(userData.password, accountDoc.password, function(err, result){

                    if(result){
                        // successful login
                        var token = {
                            token:guid.raw()
                        };

                        accountDoc.tokens.push(token);

                        accountDoc.save(function(err){

                            if(!err){
                                res.send(token);
                            }else{
                                res.sendStatus(401);
                            }

                        });

                    }else{
                        // wrong password
                        res.sendStatus(401);
                    }

                });

            }else{
                res.sendStatus(401);
            }

        });

    });

    // READ ONE
    server.get('/api/account/:id', function(req, res){

    });

    // UPDATE
    server.put('/api/account/:id', function(req, res){

    });

    // DELETE
    server.delete('/api/account/:accountId', authMiddleware, function(req, res){

        var Account = mongoose.model('Account');

        var accountId = req.params.accountId;

        Account.findByIdAndRemove(accountId, function(err, doc){

            res.send('You are admin! : '+ req.account.email);

            if(!err){
                //res.send(doc);
            }else{
                //res.status(400).send(err);
            }

        });

    });

    // CREATE
    server.post('/api/account', authMiddleware, function(req, res){

        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('password', 'Password is too short').notEmpty().isLength({min:5});

        var errors = req.validationErrors();

        if(errors){
            return res.status(400).send(errors);
        }

        var accountData = req.body;

        var email = accountData.email;
        var password = accountData.password;

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {

                var Account = mongoose.model('Account');
                var account = new Account({ email:email, password:hash});

                account.save(function(err){

                    if(err){
                        console.log(err);
                        res.status(400).send(err);
                    }else{
                        res.send(account);
                    }

                });
            });
        });
    });

    // CHECK INVITE CODE
    server.get('/api/invite/check/:code', function(req, res){

        var inviteCode = req.params.code;

        var Account = mongoose.model('Account');

        console.log(inviteCode);

        Account.findOne({ inviteCode:inviteCode }, function(err, accountDoc){

            if(!err) {
                console.log(accountDoc);
                if(accountDoc) {
                    res.send(accountDoc);
                }else{
                    res.status(404).send(err);
                }
            }else{
                res.status(400).send(err);
            }

        });

    });

    // INVITE
    server.post('/api/account/invite', authMiddleware, function(req, res){

        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('role', 'No role present').notEmpty();

        var errors = req.validationErrors();

        if(errors){
            return res.status(400).send(errors);
        }

        var Account = mongoose.model('Account');

        var inviteCode = guid.raw();

        var accountData = req.body;
        var email = accountData.email;
        accountData.status = 0;
        accountData.inviteCode = inviteCode;

        var account = new Account(accountData);

        account.save(function(err){

            sendInvitation(email, inviteCode, function(){

                res.send(account);

            });

        });

    });

    server.post('/api/account/confirm', function(req, res){

        req.checkBody('name', 'No name').notEmpty();
        req.checkBody('surname', 'No surname').notEmpty();
        req.checkBody('gender', 'No gender').notEmpty();
        req.checkBody('dateOfBirth', 'No date of birth').notEmpty();
        req.checkBody('kzz', 'No kzz').notEmpty();

        var errors = req.validationErrors();

        if(errors){
            return res.status(400).send(errors);
        }

        var accountData = req.body;
        var inviteCode = accountData.inviteCode;

        var Account = mongoose.model('Account');

        var data = {
            name        : accountData.name,
            surname     : accountData.surname,
            gender      : accountData.gender,
            dateOfBirth : accountData.dateOfBirth,
            kzz         : accountData.kzz,
            inviteCode  : null
        };

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(accountData.password, salt, function (err, hash) {

                data.password = hash;

                Account.findOneAndUpdate({inviteCode:inviteCode}, data, {new:true}, function(err, accountDoc){

                    if(!err){
                        res.send(accountDoc);
                    }else{
                        res.status(400).send(err);
                    }

                });

            });
        });

    });

};

function sendInvitation(email, id, cb){

    var client = new Mailin("https://api.sendinblue.com/v2.0","tqB7kdnpw2LRxZ5V");

    var to = {};
    to[email] = email;

    var data = { 'to' : to,
        'from' : ['invite@bis.com','BIS Invitation'],
        'subject' : 'Invite to BIS',
        'html' : '<h1>BIS Invitation</h1>' +
        '<a href="'+CFG.APP_URL+'/#/invitation/'+id+'">Click here to accept invite!</a>'
    };

    client.send_email(data).on('complete', function(data) {
        console.log(data);
        cb(data);
    });

}





