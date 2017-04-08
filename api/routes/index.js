var express = require('express');
var router = express.Router();

var ctrlHotels = require('../controllers/hotels.controller');
var ctrlReviews = require('../controllers/reviews.controller');
var ctrlUsers = require('../controllers/users.controller');

//add authentication for each request
router
    .route('/hotels')
    .get(ctrlUsers.authenticate,ctrlHotels.hotelsGetAll)
    .post(ctrlHotels.hotelsAddOne);

router
    .route('/hotels/:hotelId')
    .get(ctrlHotels.hotelsGetOne)
    .put(ctrlHotels.hotelsUpdateOne)
    .delete(ctrlHotels.hotelsDeleteOne);

//review route
router
    .route('/hotels/:hotelId/reviews')
    .get(ctrlReviews.reviewsGetAll)
    .post(ctrlReviews.reviewsAddOne);

router
    .route('/hotels/:hotelId/reviews/:reviewId')
    .get(ctrlReviews.reviewsGetOne)
    .put(ctrlReviews.reviewsUpdateOne)
    .delete(ctrlReviews.reviewsDeleteOne);

//Authentication
router
    .route('/users/register')
    .post(ctrlUsers.register);

router
    .route('/users/login')
    .post(ctrlUsers.login);

module.exports = router;