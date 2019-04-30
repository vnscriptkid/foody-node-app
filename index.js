// const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// mongoose.Promise = global.Promise;

// start app
const app = require('./app');
app.set('port', process.env.PORT || 7777); 

const server = app.listen(app.get('port'), () => {
    console.log(`Express running on PORT ${server.address().port}`)
})