const app = require('../app')
const supertest = require('supertest');
const mongoose = require('mongoose')
const request = supertest(app);
const User = require('../models/user');

describe('validate jwd', () => {
    //delete user collection
    //create user
    //login user, get jwt
    //get todolist

    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/todos`
        await mongoose.connect(url, {
            useNewUrlParser: true
        });
        await User.deleteMany()
    });

    afterAll(async () => {
        // Removes the User collection
        await User.deleteMany()
    });

    it('Should create user to database', async done => {
        const res = await request.post('/api/authenticate/create')
            .send({
                name: 'Admin',
                email: 'admin@itpeoplecorp.com',
                password: 'admin'
            })

        // Searches the user in the database
        const user = await User.findOne({
            email: 'admin@itpeoplecorp.com'
        });
        expect(user.email).toBe('admin@itpeoplecorp.com');
        expect(user.name).toBeTruthy()
        expect(user.password).toBeTruthy()

        done()
    });

    it('Should generate jwd and get list', async done => {
        const res = await request.post('/api/authenticate/login')
            .send({
                email: 'admin@itpeoplecorp.com',
                password: 'admin'
            })

        expect(res.body.jwt).toBeTruthy();


        const list = await request.get('/api/todos/').set('Authorization', res.body.jwt);
        console.log(list.body);
        expect(list.body.success).toBeTruthy()
        done()
    });
});