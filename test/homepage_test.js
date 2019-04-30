const request = require('supertest');
const app = require('../app');
const assert = require('assert');

console.log('homepage test');

describe('test HOMEPAGE', () => {
    it('should return status of 200', done => {
        request(app)
            .get('/')
            .end((err, res) => {
                assert(res.status === 200);
                done();
            })
    })
})