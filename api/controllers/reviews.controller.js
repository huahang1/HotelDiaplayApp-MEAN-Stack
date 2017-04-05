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
                res.status(500);
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
            console.log('returned hotel: ', hotel);
            var review = hotel.reviews.id(reviewId);
            res
                .status(200)
                .json(review);
        });
};