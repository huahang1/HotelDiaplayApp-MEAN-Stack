var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function (req,res) {
    var hotelId = req.params.hotelId;

    console.log('hotelId: ', hotelId);

    //use findById to get 0 or 1 as the number of return results
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err,doc) {
            if (err){
                console.log('err: ', err);
                res
                    .status(400)
                    .json(err);
            }
            if (!doc){
                res
                    .status(404)
                    .json({
                        "message":"no reviews found for this specific hotelId"
                    })
            }
            console.log('doc: ',doc);
            res
                .status(200)
                .json(doc);
        });
};

/*
use mongo shell to set ObjectId for reviews, command db.hotel.update and put $set:{reviews.0._id:ObjectId()},
this creates a reference for each review and the hotel; remember to add the {multi:true} to apply this change
*/


module.exports.reviewsGetOne = function (req,res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log('get reviewId: ', reviewId, " hotelId: ", hotelId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err,hotel) {
            if (err){
                res
                    .status(400)
                    .json(err);
            }
            if (!hotel){
                res
                    .status(404)
                    .json({
                        "message":"no hotel found for this specific hotelId"
                    })
            }
            console.log('returned hotel: ', hotel);

            var review = hotel.reviews.id(reviewId);

            if (!review){
                res
                    .status(404)
                    .json({
                        "message":"no review found for this specific hotel"
                    })
            }

            res
                .status(200)
                .json(review);
        });
};

var _addReview = function (req,res,hotel) {

    hotel.reviews.push({
        name:req.body.name,
        rating:parseInt(req.body.rating,10),
        review: req.body.review
    });

    //save the sub document material
    hotel.save(function (err,hotelUpdated) {
       if(err){
           console.log('err: ',err);
           res
               .status(500)
               .json(err);
       } else{
           res
               .status(200)
               .json(hotelUpdated.reviews[hotelUpdated.reviews.length -1]);
       }
    });
};


module.exports.reviewsAddOne = function (req,res) {

    var hotelId = req.params.hotelId;

    console.log('hotelId: ', hotelId);

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err,doc) {
            var response = {
                status:200,
                message:[]
            };
            if (err){
                console.log('err: ',err);
                response.status = 500;
                response.message = err;
            }else{

                if (!doc){
                    console.log('Hotel id not found');
                    response.status = 404;
                    response.message = "hotel ID" + hotelId + " not found"
                }

                if (doc){
                    console.log('doc found: ', doc);
                    _addReview(req, res, doc);
                }else{
                    res
                        .status(response.status)
                        .json(response.message);
                }
            }
        });
};

module.exports.reviewsUpdateOne = function (req,res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reiewId;
    console.log('put reviewId: ', reviewId, ' hotelId: ', hotelId);

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err,hotel) {
            var thisReview;
            var response={
                status:200,
                message:{}
            };
            if (err){
                console.log('err: ',err);
                response.status = 500;
                response.message = err;
            }else{
                if (!hotel){
                    response.status = 404;
                    response.message = "the hotelId does not exist"
                }else{
                    thisReview = hotel.reviews.id(reviewId);
                    if (!thisReview){
                        response.status = 404;
                        response.message = "the review for this hotel does not exist"
                    }
                    if (response.status !== 20){
                        res
                            .status(response.status)
                            .json(response.message);
                    }else{
                        thisReview.name = req.body.name;
                        thisReview.rating = parseInt(req.body.rating,10);
                        thisReview.review = req.body.review;
                        hotel.save(function (err,hotelUpdated) {
                            if (err){
                                res
                                    .status(500)
                                    .json(err);
                            }else{
                                res
                                    .status(204)
                                    .json({
                                        'message':'successfully updated this review'
                                    });
                            }
                        });
                    }
                }
            }
        });
};

module.exports.reviewsDeleteOne = function (req,res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reiewId;
    console.log('put reviewId: ', reviewId, ' hotelId: ', hotelId);

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err,hotel) {
            var thisReview;
            var response={
                status:200,
                message:{}
            };
            if (err){
                console.log('err: ',err);
                response.status = 500;
                response.message = err;
            }else{
                if (!hotel){
                    response.status = 404;
                    response.message = "the hotelId does not exist"
                }else{
                    thisReview = hotel.reviews.id(reviewId);
                    if (!thisReview){
                        response.status = 404;
                        response.message = "the review for this hotel does not exist"
                    }
                    if(response.status !== 200){
                        res
                            .status(response.status)
                            .json(response.message);
                    }else {
                        //delete this specific review
                        thisReview.remove();
                        hotel.save(function (err,hotelUpdated) {
                            if (err){
                                res
                                    .status(500)
                                    .json(err);
                            }else{
                                res
                                    .status(204)
                                    .json({
                                        'message':'successfully deleted this review'
                                    });
                            }
                        });
                    }
                }
            }
        });
};