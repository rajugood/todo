const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/jwt');

const router = express.Router();
//jwt
const privateKEY = fs.readFileSync(path.join(__dirname, config.privatekey), 'utf8');
const publicKEY = fs.readFileSync(path.join(__dirname, config.publickey), 'utf8');


function generateJWTtoken (user){
    let payload = {
        name: user.name,
        email: user.email,
        id: user._id
    };

    let token = jwt.sign(payload, privateKEY, config.signOptions);
    return token;
}

router.post('/test', (req, res) => {
    res.status(200).json({msg:"testing api"});
});


router.post('/create', async (req, res) => {

    let user = new User({
        name: req.body.name || "Admin",
        email: req.body.email || "admin@itpeoplecorp.com",
        password: req.body.password || "admin"
    });
    user.password = user.generateHash(user.password);
    let result = await user.save();
    res.json(result);
});

router.post('/login', async (req, res) => {

    User.findOne({email: req.body.email}, function(err, user) {
        
        if (user.validPassword(req.body.password)) {

            let token = generateJWTtoken(user)
            res.json({success: true, jwt:token});
        } else {
          
          console.log('invalid login');
          res.status(400).json({success:false , msg: "Failed to login with given credentials"})
        }
      });

});




module.exports = router;