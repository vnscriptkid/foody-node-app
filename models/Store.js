const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const slug = require('slugs');

// const pointSchema = new Schema({
//     type: {
//         type: String,
//         default: 'Point'
//     },
//     coordinates: [{
//         type: Number,
//         required: 'You must supply coordinates!'
//     }],
//     address: {
//         type: String,
//         required: 'You must supply an address!'
//     }
// })

const storeSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name!'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates!'
        }],
        address: {
            type: String,
            required: 'You must supply an address!'
        }
    },
    photo: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: "You must supply author for a store"
    }
})

storeSchema.set('autoIndex', false);

storeSchema.index({
    name: 'text',
    description: 'text' 
})

storeSchema.index({
    location: '2dsphere'
})

storeSchema.virtual('reviews', {
    ref: 'review',
    localField: '_id',
    foreignField: 'store'
})

// pre save middleware
    storeSchema.pre('save', function(next) {
        if (!this.isModified('name')) {
        return next();
    }
    this.slug = slug(this.name);
    const regExp = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    this.constructor.find({ slug: regExp })
        .then(stores => {
            const max = findMaxSlugNumber(stores, this.slug);
            this.slug = `${this.slug}${max === 0 ? '' : '-' + (max + 1)}`;
            next();
        })
}) 

// TODO: purify data input from user avoid script injection

function findMaxSlugNumber(stores, slug) {
    if (stores.length === 0) return 0;
    if (stores.length === 1 && stores[0].slug === slug) {
        return 1;
    }
    let max = 0;
    stores.forEach(({ slug }) => {
        const numOfSlug = parseInt(slug[slug.length - 1]);
        if (numOfSlug && numOfSlug > max) {
            max = numOfSlug;
        }
    })
    return max;
}

storeSchema.statics.getTagsAndCounts = function() {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } }
    ])
}

storeSchema.statics.calculateTopStores = function() {
    return this.aggregate([
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'store',
                as: 'reviews'
            }
        },
        {
            $match: {
                'reviews.0': { $exists: true }
            }
        },
        {
            $project: {
                averageRating: {
                    $avg: '$reviews.rating'
                },
                name: true,
                slug: true,
                description: true,
                tags: true,
                created: true,
                location: true,
                author: true,
                photo: true,
                reviews: true
            }
        },
        {
            $sort: { averageRating: -1 }
        },
        {
            $limit: 10
        }
    ])
}

const Store = mongoose.model('store', storeSchema);

Store.on('index', function(err) {
    if (err) {
        console.warn('Indexing error: ', err);
    }
    console.log('Indexing `stores` collection done!');
})

storeSchema.pre('find', function(next) {
    console.log('+++++++++++++++++++++ find is called NOW!');
    next();
})

module.exports = Store;