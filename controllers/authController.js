const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/',
    failureFlash: true,
    successFlash: true
})

// exports.login = passport.authenticate('local', {
//     failureRedirect: '/login',
//     successRedirect: '/abc'
// })

exports.showLoginForm = (req, res, next) => {
    res.render('login', { title: 'Login' });
}

exports.logout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}

exports.mustLoginFirst = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must login first!');
        return res.redirect('back');
    }
    next();
}