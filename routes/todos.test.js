const app = require('../app')
const supertest = require('supertest');
const mongoose = require('mongoose')
const request = supertest(app);
const Item = require('../models/item');
const User = require('../models/user');

describe('validate todo crud', () => {
    //add item
    //update item
    //delete item
    let jwtToken = '';
    let itemId = '';

    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/todos`
        await mongoose.connect(url, {
            useNewUrlParser: true
        });
        await Item.deleteMany();
        await User.deleteMany();

        const res = await request.post('/api/authenticate/create')
            .send({
                name: 'Admin',
                email: 'admin@itpeoplecorp.com',
                password: 'admin'
            });

        const tokenres = await request.post('/api/authenticate/login')
            .send({
                email: 'admin@itpeoplecorp.com',
                password: 'admin'
            });
        jwtToken = tokenres.body.jwt;

    });

    afterAll(async () => {
        
        await Item.deleteMany()
        await User.deleteMany()
    });

    it('Should create list item', async done => {
        const res = await request.post('/api/todos/').set('Authorization', jwtToken)
            .send({
                item: "First item"
            })

        const item = await Item.findOne({
            item: 'First item'
        });
        expect(item.item).toBe('First item');
        itemId = item._id;
        done()
    });

    it('Should update list item', async done => {
        const res = await request.put('/api/todos/').set('Authorization', jwtToken)
            .send({
                item: "First item updated",
                id: itemId
            })

        const item = await Item.findOne({
            item: 'First item updated'
        });
        expect(item.item).toBe('First item updated');

        done()
    });

    it('Should delete list item', async done => {
        const res = await request.delete('/api/todos/').set('Authorization', jwtToken)
            .send({

                id: itemId
            })

        const item = await Item.count({
            item: 'First item updated'
        });

        expect(item).toBe(0);

        done()
    });

});