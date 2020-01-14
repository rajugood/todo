const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the database model
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
    }
});

// hash the password
UserSchema.methods.generateHash = function (password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
    console.log('password', password);
    console.log('this.password', this.password);

    return bcrypt.compareSync(password, this.password);
};



const User = module.exports = mongoose.model('user', UserSchema);