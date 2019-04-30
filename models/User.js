const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongodbErrorHandler = require('mongoose-mongodb-errors')
const passportLocalMongoose = require('passport-local-mongoose');
const md5 = require('md5');

const userSchema = new Schema({
    name: {
        type: String,  
        trim: true,
        required: 'You must provide `name` field!'
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: 'You must provide `email` field!',
        // validate: {
        //     validator: function(value) {
        //         return value.indexOf('x') !== -1;
        //     },
        //     msg: 'Email must have at least one `x` ch    aracter!'
        // }
    },
    resetToken: String,
    expireTime: Date,
    hearts: [{
        type: Schema.Types.ObjectId,
        ref: 'store'
    }]
})

userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://www.gravatar.com/avatar/${hash}?s=40`;
});

userSchema.plugin(mongodbErrorHandler);
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('user', userSchema);