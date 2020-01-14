const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    item:{
        type: String
    },
    user_id:{
        type: String
    }
},{ timestamps: {  } });

const item = module.exports = mongoose.model('item', ItemSchema);