const request = require('supertest');
const assert = require('assert');
const app = require('../../app');
const Store = require('../../models/Store');

describe('store model TEST', () => {
    it('should filter out only properties in the model', done => {
        const burger = { name: 'burger king', description: 'best at burger' , tags: [ 'Open Late', 'Wifi' ], price: 100, city: 'Ha Noi', location: { address: 'hanoi', coordinates: [10, 20] } };
        request(app)
        .post('/add')
        .send(burger)
        .end((err, res) => {
            Store.findOne({ name: burger.name })
            .then(store => {
                assert(!store.price);
                assert(!store.city);
                done();
            })
        })
    })
    
    it('should produce a slug before saving document to DB', done => {
        const burger = { name: 'burger king', description: 'best at burger' , tags: [ 'Open Late', 'Wifi' ], location: { address: 'hanoi', coordinates: [10, 20] } };
        request(app)
        .post('/add')
        .send(burger)
        .end((err, res) => {
            Store.findOne({ name: burger.name })
                .then(store => {
                    console.log('slug: ', store.slug);
                    assert(store.slug === 'burger-king');
                    done();
                })
        })
    })

    it('should make `name` property as required on saving to db', done => {
        const burger = { name: undefined, description: 'best at burger' , tags: [ 'Open Late', 'Wifi' ], location: { address: 'hanoi', coordinates: [10, 20] } };
        request(app)
        .post('/add')
        .send(burger)
        .end((err, res) => {
            assert(res.status !== 200);
            Store.findOne({ description: burger.description })
            .then(store => {
                assert(!store);
                done();
            })
        })
    })

    it('should remove spaces before and after `name` as well as `description`', done => {
        const burger = { name: ' burger king   ', description: '  best at burger  ', tags: [ 'Open Late', 'Wifi' ], location: { address: 'hanoi', coordinates: [10, 20] } };
        request(app)
            .post('/add')
            .send(burger)
            .end((err, res) => {
                Store.findOne({ description: burger.description.trim() })
                .then(store => {
                    assert(store.name === burger.name.trim());
                    done();
                })
            })
    })

    // should make slug of each store always unique, 
    // when store-name is changed (create or update), recalculate slug
    // case 1: store-name -> store-name-2
    // case 2: store-name, store-name-2 -> store-name-3
    // case 3: store-name-2 -> store-name-3
})