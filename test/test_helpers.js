const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost/foody_test';

before(done => {
    mongoose.connect(DB_URL, { useNewUrlParser: true });
    mongoose.connection
        .once('open', () => {
            console.log('Connect to TEST DB successfully!');
            done();
        })
        .on('error', (err) => {
            console.warn('Can not connect to TEST DB');
        })
})

beforeEach(done => {
    const {stores} = mongoose.connection.collections;

    stores.drop()
        .then(() => console.log('Drop `stores` collection') || done())
        .catch(err => console.log('Can not drop `stores` collection') || done());

})

