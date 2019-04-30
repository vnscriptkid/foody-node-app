exports.notFound = (req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
}

exports.validationErrors = (err, req, res, next) => {
    // if there's no validation errors from mongoose, pass err to next middleware
    if (!err.errors) {
        return next(err);
    }
    // otherwise
    const errKeys = Object.keys(err.errors);
    errKeys.forEach(key => req.flash('error', err.errors[key].message));
    res.redirect('back');

}

exports.developmentErrors = (error, req, res, next) => {
    console.log('\x1b[31m%s\x1b[0m', 'dev error handler');
    res.status(error.status || 500).render('error', { error });
}

exports.catchErrorsAsync = (fn) => {
    return (req, res, next) => {
        return fn(req, res, next).catch(next);
    }
}