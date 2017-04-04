var express = require('express');
var router = express.Router();

var ctrlHotels = require('../controllers/hotels.controller');
var ctrlReviews = require('../controllers/reviews.controller');

router
    .route('/hotels')
    .get(ctrlHotels.hotelsGetAll);

router
    .route('/hotels/:hotelId')
    .get(ctrlHotels.hotelsGetOne);

router
    .route('/hotels/new')
    .post(ctrlHotels.hotelsAddOne);

//review route
router
    .route('/hotels/:hotelId/reviews')
    .get(ctrlReviews.reviewsGetAll);

router
    .route('/hotels/:hotelId/:reviewId')
    .get(ctrlReviews.reviewsGetOne);

module.exports = router;