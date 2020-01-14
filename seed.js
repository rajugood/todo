const User = require('./models/user');

User.count({email:'admin@itpeoplecorp.com'}, function(err, count){
    if(count == 0){
        let newUser = new User({
            name: 'Admin',
            email: 'admin@itpeoplecorp.com',
            password: 'admin'
        });
        newUser.save();
    }
});
