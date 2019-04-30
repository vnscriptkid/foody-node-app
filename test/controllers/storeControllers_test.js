const request = require('supertest');
const assert = require('assert');
const app = require('../../app');
const Store = require('../../models/Store');

describe('store Controllers test', () => {
    it('should handle GET to /add', (done) => {
        request(app)
            .get('/add')
            .end((err, res) => {
                console.log(res.status);
                assert(res.status === 200);
                done();
            })
    })

    it('should handle POST to /add', (done) => {
        const burger = { name: 'burger king', description: 'best at burger' , tags: [ 'Open Late', 'Wifi' ], location: { address: 'hanoi', coordinates: [10, 20] } };
        request(app)
            .post('/add')
            .send(burger)
            .end((err, res) => {
                Store.findOne({ name: burger.name })
                    .then(store => {
                        assert(store.description === burger.description);
                        done();
                    })
            })
    })
})