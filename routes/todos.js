const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const Item = require('../models/item');
const config = require('../config/jwt');

//jwt
const privateKEY = fs.readFileSync(path.join(__dirname, config.privatekey), 'utf8');
const publicKEY = fs.readFileSync(path.join(__dirname, config.publickey), 'utf8');


async function validateJWTtoken ( token ){
    let data = await jwt.verify( token, publicKEY, config.signOptions );
    if(data){
        return data;
    }else{
        return false;
    }
}

async function verifyJWT_MW(req, res, next){
    let token =  req.body.jwt;
    if( token !== undefined && token !== ''){
        let data = await validateJWTtoken(token);
        console.log(data);
        console.log('adding user_id');
        if( data ){
            req.user_id = data.id;
            next();
        }
        else{
            res.status(400)
            .json({message: "Invalid auth token provided."});
        }
    }
    else{
        res.status(400)
        .json({message: "token not provided."});
    }
    
}

router.all('*', verifyJWT_MW);



//create new
router.post('/', async (req, res) => {
    try {
        const newItem = new Item({
            item: req.body.item,
            user_id: req.user_id
        });
        let result = await newItem.save();

        // after insert retrive all items
        result = await Item.find({});

        res.json({
            success: true,
            result: result
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: "failed to insert item"
        });
    }
});

//update
router.put('/', async (req, res) => {
    try {

        if (req.body.id !== undefined && req.body.item != undefined) {

            let result = await Item.findOne()
                .where("_id").in(req.body.id)
                .where("user_id").in(req.user_id)
                .exec();
            result.item = req.body.item;
            result = await result.save();

            // after update retrive all items
            result = await Item.find({});

            res.status(200).json({
                success: true,
                result: result
            });

        } else {
            throw new ReferenceError('Id or item not passed');
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: "failed to update item"
        });
    }
});


//delete
router.delete('/', async (req, res) => {
    try {

        if (req.body.id !== undefined) {

            let result = await Item.deleteOne({
                _id: req.body.id,
                user_id: req.user_id
            });

            // after delete retrive all items
            result = await Item.find({});

            res.status(200).json({
                success: true,
                result: result
            });

        } else {
            throw new ReferenceError('Id not passed');
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: "failed to delete item"
        });
    }
});

// get all list
// note to get all list using post method because to get jwt token in payload
// to make generic
router.post('/all', async (req, res) => {
    try {

        const result = await Item.find({});
        res.json({
            success: true,
            result: result
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: "failed to retrive list"
        });
    }
});



module.exports = router;