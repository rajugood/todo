const app = require('./app.js');
const port = 3000

//load default user
require('./seed');
app.listen(port);