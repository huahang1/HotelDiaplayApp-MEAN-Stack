var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports.register = function(req,res){

    console.log('register user');
    
    var username = req.body.username;
    var name = req.body.name || null;
    var password = req.body.password;
    
    User.create({
        username:username,
        name:name,
        password:bcrypt.hashSync(password,bcrypt.genSaltSync(10))
    },function (err,user) {
        if (err){
            console.log('err: ', err);
            res.status(400).json(err);
        }else{
            console.log('user created: ', user);
            res.status(201).json(user);
        }
    });
};

module.exports.login = function (req,res) {

    console.log('logging in user');
    var username = req.body.username;
    var password = req.body.password;

    console.log('username: ',username, 'password: ',password);

    User.findOne({
        username:username
    }).exec(function (err,user) {
        if (err){
            console.log('err: ',err);
            res.status(400).json(err);
        }else{
            console.log('user: ', user);
            if (user !== undefined && user != null){
                console.log('password in User.findOne: ', password);

                if (bcrypt.compareSync(password, user.password)){
                    console.log('User found and password is correct: ', user);

                    //sign a token, the first parameter is payload, the second one is secret, the last one defines the expire time
                    var token = jwt.sign({username:user.username},'j8uyhs',{ expiresIn:3600 });

                    res.status(200).json({success:true, token:token});
                }else{
                    res.status(401).json('Unauthorized');
                }
            }else{
                res.status(404).json('This username does not exist');
            }

        }
    });
};

module.exports.authenticate = function (req,res,next) {
    var headerExists = req.headers.authorization;
    if (headerExists){
        //Authorization Bearer
        var token = req.headers.authorization.split(' ')[1];
        //the second parameter should be the same secret in client side
        jwt.verify(token,'j8uyhs',function (err,decoded) {
            if (err){
                console.log('err: ',err);
                res.status(401).json('Unauthorized');
            }else{
                req.user = decoded.username;
                next();
            }
        });
    }else{
        res.status(403).json('No token provided');
    }
};