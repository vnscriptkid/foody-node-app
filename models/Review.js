const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    text: {
        type: String,
        required: 'Your review must have a text' 
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: 'You must supply an author'
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'store',
        required: 'You must supply a store'
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('review', reviewSchema);