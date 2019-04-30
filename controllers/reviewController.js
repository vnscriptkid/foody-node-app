const mongoose = require('mongoose');
const Review = mongoose.model('review');
const _ = require('lodash');

exports.reviewStore = (req, res, next) => {
    const storeId = req.params.storeId;
    const { text, rating } = _.pick(req.body, 'text', 'rating');
    const review = new Review({
        text,
        rating,
        author: req.user.id,
        store: storeId
    })

    review.save()
        .then(result => {
            // res.send(result);
            res.redirect('back');
        })
        .catch(next);
}