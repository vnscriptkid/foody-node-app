const { body, validationResult } = require('express-validator/check');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const Store = mongoose.model('store');
const _ = require('lodash');
const uuid = require('uuid/v4');
const { promisify } = require('es6-promisify');
const { sendResetToken } = require('../config/nodemailer');

exports.checkRegister = () => {
    return [
        body('name').trim().exists({ checkFalsy: true }).withMessage('Please provide name field!'),
        body('email').exists().isEmail().withMessage('Email provided is not valid!').normalizeEmail(),
        body('password').exists().isLength({ min: 6, max: 20 }).withMessage('Password Length must be between 6 and 20'),
        body('confirmPassword').exists().custom((value, { req }) => value === req.body.password).withMessage('Passwords don\'t match')
    ]
}

exports.validateRegister = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errors = result.array();
        req.flash('error', errors.map(err => err.msg));
        return res.render('register', { title: 'Register', flashes: req.flash(), user: req.body })
    }
    next();
}

exports.register = (req, res, next) => {
    User.register(new User({ email: req.body.email, name: req.body.name }), req.body.password)
        .then(newAccount => {
            next();
        })
        .catch(next);
}

exports.showRegisterForm = (req, res, next) => {
    res.render('register', { title: 'Register' });
}

exports.editAccount = (req, res, next) => {
    res.render('editUser', { title: 'Update Account' });
}

exports.updateAccount = (req, res, next) => {
    const updates = _.pick(req.body, ['name', 'email']);
    console.log('update user: ', req.user);
    console.log('with data: ', updates);
    User.findOneAndUpdate({ _id: req.user.id }, updates, { new: true, runValidators: true })
        .then(updated => {
            req.flash('success', 'Updated Account successfully!');
            res.redirect('back');
        })
        .catch(next);
}

exports.forgot = (req, res, next) => {
    // 1. Extract email to reset from req.body
    const email = req.body.email;

    // 2. Does that email exist in db?
    User.findOne({ email })
        .then(result => {
            if (!result) {
                // 2.1. No. Redirect back. Flash a message
                req.flash('error', 'Email provided does not exist!');
                return res.redirect('back');
            }
            // 2.2. Yes. Attach resetToken and expireTime to that email in db. Send token to email. Redirect back and flash that email has been sent
            result.resetToken = uuid();
            result.expireTime = Date.now() + 3600000; // one hour from now
            return result.save();
        })
        .then(user => { 
            // TODO: Send email with token
            return sendResetToken(user.email, user.resetToken, user.name);
        })
        .then(result => {
            console.log('Sending mail result: ', result);
            req.flash('success', 'A token was sent to provided email!');
            res.redirect('/');
        })
        .catch(next);
}

exports.showResetForm = (req, res, next) => {
    const token = req.params.token;
    // 1. find user with that token and valid expireTime
    User.findOne({ 
        resetToken: token, 
        expireTime: { $gt: Date.now() } 
    })
        .then(result => {
            if (!result) {
                req.flash('error', 'Token provided is invalid!');
                return res.redirect('/');
            }
            res.render('resetPassword', { title: 'Reset Password', token })
        })
        // 1.1. Not found. Flash error invalid token. Redirect back
        // 1.2. Found one. render the form to reset. pass along with token to template
}

exports.resetPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
        resetToken: token, 
        expireTime: { $gt: Date.now() }
    })
        .then(user => {
            if (!user) {
                req.flash('error', 'Token provided is invalid!');
                return res.redirect('/');
            }
            const { password, passwordConfirm } = req.body;
            if (password !== passwordConfirm) {
                req.flash('error', 'Passwords do not match!');
                return res.redirect('back');
            }
            return user.setPassword(password);
        })
        .then(user => {
            user.resetToken = undefined;
            user.expireTime = undefined;
            return user.save();
        })
        .then(user => {
            req.login(user, (err) => {
                if (err) return next(err);
                req.flash('success', 'Changed password successfully!');
                return res.redirect('/');
            })
        })
        .catch(next);
}

exports.mustBeAuthor = (req, res, next) => {
    const storeId = req.params.storeId;
    Store.findOne({ _id: storeId })
        .then(store => {
            console.log('store: ', store);
            if (!store) {
                req.flash('error', 'Can not find the store with given Id');
                res.redirect('back');
                return;
            }
            if (!store.author || store.author.toString() !== req.user.id) {
                req.flash('error', 'You are not authorised!');
                res.redirect('back');
                return;
            }
            next();
        })
        .catch(next);
}

exports.heartStore = (req, res, next) => {
    const storeId = req.params.storeId;
    const operator = req.user.hearts.map(storeId => storeId.toString()).includes(storeId) 
        ? 
        { $pull: { hearts: storeId } } 
            : 
        { $addToSet: { hearts: storeId } };

    Store.findOne({ _id: storeId })
        .then(store => {
            if (!store) return res.send('storeId is invalid!');
            return User.findOneAndUpdate(
                { _id: req.user.id }, 
                operator,
                { new: true, runValidators: true }
            );
        })
        .then(updated => {
            res.send(updated);
        })
        .catch(next);
    
}