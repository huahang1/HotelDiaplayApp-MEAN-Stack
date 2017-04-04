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

module.exports.reviewsGetOne = function (req,res) {
    
}