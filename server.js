//modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//routes
const Todos = require('./routes/todos');
const Auth = require('./routes/auth');

//config
const app = express()
const port = 3000

//db
mongoose.connect('mongodb://localhost/todos', {
    useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('DB Connected');
});

//middleware
app.use(bodyParser.json());

//routes
app.use('/api/todos', Todos);
app.use('/api/authenticate', Auth);
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));