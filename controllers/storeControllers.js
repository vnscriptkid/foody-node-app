const mongoose = require('mongoose');
const Store = mongoose.model('store');
const User = mongoose.model('user');
const uuid = require('uuid/v4');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Jimp = require('jimp');

exports.resize = (req, res, next) => {
    if (!req.file || !req.file.mimetype.startsWith('image')) {
        return next();
    } 
    // create a unique name for file
    const extension = req.file.mimetype.split('/')[1];
    const fileName = uuid() + '.' + extension;
    // attach file to req.body
    req.body.photo = fileName;
    // resize the file
    Jimp.read(req.file.buffer)
        .then(image => {
            const dest = path.join(__dirname, '..', 'public', 'uploads', 'photos', fileName);
            return image.resize(200, Jimp.AUTO)
                .write(dest);
        })
        .then(image => next())
        .catch(next);
}

exports.upload = multer().single('avatar');

exports.homePage = (req, res) => {
    res.render('index', { title: 'Home Page' });
}

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
}

exports.editStore = (req, res, next) => {
    const storeId = req.params.storeId;
    Store.findOne({ _id: storeId })
        .then(store => res.render('editStore', { title: 'Edit Store', store }))
        .catch(next)
}

exports.createStore = (req, res, next) => {
    const store = new Store(req.body);
    // add author with current logged in user
    store.author = req.user.id;
    store.save()
        .then(result => {
            req.flash('success', `Successfully created \`${store.name}\` store!`);
            res.redirect('/');
        })
        .catch(next);
}

exports.getStoreList = (req, res, next) => {
    // Store.find({})
    //     .then(stores => {
    //         res.render('storeList', { stores, title: 'Stores' });
    //     })
    //     .catch(next);
    res.redirect('/stores/page/1');
}

exports.updateStore = (req, res, next) => {
    const storeId = req.params.storeId;
    req.body.location.type = 'Point';
    Store.findOne({ _id: storeId })
        .then(foundStore => {
            foundStore = Object.assign(foundStore, req.body);
            return foundStore.save();
        })
        .then(updatedStore => {
            req.flash('success', `Successfully updated store \`${updatedStore.name}\`! <a href="/stores/${updatedStore.id}">See now</a>`);
            res.redirect(`/stores/${storeId}/edit`)
        })
        .catch(next);
}

exports.getStoreBySlug = (req, res, next) => {
    const slug = req.params.slug;
    Store.findOne({ slug: slug })
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .exec(function(err, foundStore) {
            if (err) return next(err);
            res.render('store', { title: 'Store', store: foundStore })
        })
        // .then(foundStore => {
        //     res.render('store', { title: 'Store', store: foundStore })
        // })
        // .catch(next)
}

// TODO: combine getTagFilter and getStoresByTagName to make code DRY

exports.getTagFilter = (req, res, next) => {
    const tagsQuery = Store.getTagsAndCounts()
    const storesQuery = Store.find({ });

    Promise.all([ tagsQuery, storesQuery ])
        .then(result => {
            const tags = result[0];
            const stores = result[1]
            res.render('tags', { title: 'Tags', tags, stores });
        })
    
}

exports.getStoresByTagName = (req, res, next) => {
    const tag = req.params.tagName;
    const tagsQuery = Store.getTagsAndCounts();
    const storesQuery = Store.find({ tags: tag });

    Promise.all([ tagsQuery, storesQuery ])
        .then(result => {
            const tags = result[0];
            const stores = result[1];
            res.render('tags', { title: 'Filter', tags, stores, selectedTag: tag });
        })
        .catch(next);
}

exports.searchStores = (req, res, next) => {
    const q = req.query.q;

    Store.find({
        $text: { $search: q }
    }, {
        score: { $meta: 'textScore' }
    })
    .sort({
        score: { $meta: 'textScore' }
    })
    .limit(5)
    .then(stores => {
        res.send(stores);
    })
}

exports.mapStores = (req, res, next) => {
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    Store.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates,
                },
                $maxDistance: 200000 // 80km
            }
        }
    })
    .then(stores => {
        res.render('map', { title: 'Map', stores })
    })
}

exports.getHeartedStores = (req, res, next) => {
    // res.send({ it: 'worked!' })
    // User.find({ _id: req.user.id })
    //     .populate('hearts')
    //     .exec((err, result) => {
    //         if (err) return next(err);
    //         res.send(result);
    //     })
    Store.find({ _id: { $in: req.user.hearts } })
        .then(stores => {
            res.render('storeList', { title: 'Hearted Store', stores })
        })
        .catch(next);

    // user: { hearts: [{heartId}, {heartId}] }
}

exports.StoreIdIsValid = (req, res, next) => {
    Store.findOne({ _id: req.params.storeId })
        .then(store => {
            if (!store) {
                req.flash('error', 'Store Not Found');
                return res.redirect('back');
            }
            next();
        })
}

exports.getTopStores = (req, res, next) => {
    Store.calculateTopStores()
        .then(stores => res.render('topStores', { stores, title: 'Top 10 highly-rated Stores' }))
        .catch(next);
}

exports.getPaginatedStores = (req, res, next) => {
    const page = parseInt(req.params.page) || 1;
    const limit = 1;
    const skip = limit * page - limit;
    
    const storesPromise = Store
    .find({})
    .skip(skip)
    .limit(limit);
    
    const countPromise = Store.countDocuments();
    
    Promise
    .all([ storesPromise, countPromise ])
    .then(([stores, count]) => {
        if (!stores.length) {
            const finalPage = Math.ceil(count / limit);
            req.flash('error', 'Page is unreachable! We\'ve redirected you to the final page!');
            res.redirect(`/stores/page/${finalPage}`);
            return;
        }
        res.render('storeList', { title: 'Stores', stores, page, total: count, limit })
    })
    .catch(next);
}