const express = require('express');
const app = express();
const path = require('path');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const morgan = require('morgan');

mongoose.set('debug', true);

// Connect to database
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
    mongoose.connection.on('open', () => {
        console.log(`Connected to ${process.env.DB_URL}`)
    })
    mongoose.connection.on('error', () => {
        console.log(`Ooops! Can not connect to database`);
    })
}

// serve public files
app.use('/public', express.static(path.join(__dirname, 'public')));

// import all of our models
require('./models/Store');
require('./models/User');
require('./models/Review');

// morgan logging requests
app.use(morgan('tiny')); 

// Set template folder
app.set('views', path.join(__dirname, 'views'));

// Set template engine
app.set('view engine', 'pug');

app.use(cookieParser('secret'));

// make form properties available in req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// config passport
require('./config/passport')(passport);

// Pass variables to template
app.use((req, res, next) => {
    res.locals.siteName = helpers.siteName;
    res.locals.produceMap = helpers.produceMap;
    res.locals.fromNow = helpers.fromNow;
    res.locals.flashes = req.flash();
    res.locals.MAP_API_KEY = process.env.MAP_API_KEY;
    res.locals.user = req.user || null;
    next();
})

// routes handling
app.use('/', require('./routes'));

// not found 
app.use(errorHandlers.notFound);

// validation errors
app.use(errorHandlers.validationErrors);

// development errors handling
app.use(errorHandlers.developmentErrors);

module.exports = app;