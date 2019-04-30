const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const storeControllers = require('../controllers/storeControllers');
const userControllers = require('../controllers/userControllers');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router.get('/', storeControllers.homePage); 

router.get('/add', authController.mustLoginFirst, storeControllers.addStore);

// create a new store
router.post('/add', authController.mustLoginFirst, storeControllers.upload, storeControllers.resize, storeControllers.createStore);

// update and existing store
router.post('/add/:storeId', authController.mustLoginFirst, userControllers.mustBeAuthor, storeControllers.upload, storeControllers.resize, storeControllers.updateStore);

router.get('/stores', storeControllers.getStoreList);

router.get('/stores/page/:page', storeControllers.getPaginatedStores);

router.get('/hearts', authController.mustLoginFirst, storeControllers.getHeartedStores);

router.get('/stores/:storeId/edit', authController.mustLoginFirst, userControllers.mustBeAuthor, storeControllers.editStore);

router.get('/stores/:storeId/heart', authController.mustLoginFirst, userControllers.heartStore);

router.get('/stores/:slug', storeControllers.getStoreBySlug);

router.get('/tags', storeControllers.getTagFilter);

router.get('/tags/:tagName', storeControllers.getStoresByTagName)

router.get('/map', storeControllers.mapStores);

router.get('/top', storeControllers.getTopStores);

// auth

router.get('/login', authController.showLoginForm);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/register', userControllers.showRegisterForm);

router.post('/register', 
    userControllers.checkRegister(),
    userControllers.validateRegister, 
    userControllers.register,
    authController.login
)

// account

router.get('/account/edit', authController.mustLoginFirst, userControllers.editAccount);

router.post('/account', authController.mustLoginFirst, userControllers.updateAccount);

router.post('/forgot', userControllers.forgot)

router.get('/reset/:token', userControllers.showResetForm);

router.post('/reset/:token', userControllers.resetPassword);

// reviews

router.post('/reviews/:storeId', authController.mustLoginFirst, storeControllers.StoreIdIsValid, reviewController.reviewStore);

// api - return json data

router.get('/api/search', storeControllers.searchStores);

module.exports = router;