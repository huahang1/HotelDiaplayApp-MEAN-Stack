var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function (req,res) {

    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    //remember to put the "Point" instead of "point", otherwise this point can not be recognized as GeoJson point
    var point = {
        type:"Point",
        coordinates:[lng, lat]
    };

    console.log('point: ',point);

    var geoOptions = {
        spherical :true,
        maxDistance:2000,
        num:5
    };

    //the first parameter for the geoNeat at mongoose should be an array or GeoJson point object, if you just use the legacy array, the result is not accurate at all
    Hotel
        .geoNear(point, geoOptions,function (err,results,stats) {
            if (err){
                console.log('err: ', err);
                res
                    .status(400)
                    .json(err);
            }
            console.log('Geo results: ', results);
            console.log('Geo stats: ', stats);
            res
                .status(200)
                .json(results);
        });
};

module.exports.hotelsGetAll = function (req,res) {

    console.log('req users: ', req.user);

    console.log('get the hotels');
    console.log('req param: ', req.query);

    var offset = 0;
    var count = 5;
    var maxCount = 10;

    if(req.query && req.query.lng && req.query.lat){
        runGeoQuery(req,res);
        return;
    }

    if (req.query && req.query.offset){
        //here 10 means the number converted is based on decimal
        offset = parseInt(req.query.offset,10);
    }

    if (isNaN(offset) || isNaN(count)){
        res
            .status(400)
            .json({"message":"offset or count has to be number"});
        return;
    }

    if (req.query && req.query.count){
        count = parseInt(req.query.count,10);
    }

    console.log('Hotel: ', Hotel);

    if (count > maxCount){
        res
            .status(400)
            .json({
                "message":"limit of " + maxCount + " exceed"
            });
        return;
    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function (err,hotels) {
            if (err){
                console.log('err: ', err);
                res
                    .status(400)
                    .json(err);
            }
            console.log('hotels: ', hotels);
            res
                .status(200)
                .json(hotels);
        });


};

module.exports.hotelsGetOne = function (req,res) {

    var hotelId = req.params.hotelId;

    console.log('get hotelId: ', hotelId);

    Hotel
        .findById(hotelId)
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
                        "message":"not hotel found for this specific hotelId"
                    });
            }
            console.log('doc: ', doc);
            res
                .status(200)
                .json(doc);
        });
};

var _splitArray = function (input) {
    var output;
    if (input && input.length > 0){
        output = input.split(";");
    }else{
        output = [];
    }
    return output;
};

module.exports.hotelsAddOne = function (req,res) {

    Hotel
        .create({
            name:req.body.name,
            description:req.body.description,
            stars:req.body.stars,
            services:req.body.services,
            photos:req.body.photos,
            currency:req.body.currency,
            location:{
                address:req.body.address,
                coordinates:[
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ]
            }

        },function (err,hotel) {
            if (err){
                console.log('err creating hotel');
                res
                    .status(400)
                    .json(err);
            }
            console.log('Hotel created: ', hotel);
            res
                .status(201)
                .json(hotel);
        })
};

module.exports.hotelsUpdateOne = function (req,res) {
    var hotelId = req.params.hotelId;

    console.log('get hotelId: ', hotelId);

    Hotel
        .findById(hotelId)
        .select('-reviews -rooms')
        .exec(function (err,doc) {

            var response = {
                status:200,
                message:doc
            };

            if (err){
                console.log('err: ', err);
                response.status = 500;
                response.message = err;
            }
            if (!doc){
                response.status = 404;
                response.message = "HotelId not found";
            }

            if (response.status !== 200){
                res
                    .status(response.status)
                    .json(response.message);
            }else{
                    doc.name = req.body.name;
                    doc.description = req.body.description;
                    doc.stars = parseInt(req.body.stars,10);
                    doc.services = _splitArray(req.body.services);
                    doc.photos = _splitArray(req.body.photos);
                    doc.currency = req.body.currency;
                    doc.location = {
                        address:req.body.address,
                        coordinates:[
                            parseFloat(req.body.lng),
                            parseFloat(req.body.lat)
                        ]
                };

                    doc.save(function (err,hotelUpdated) {
                        if (err){
                            res
                                .status(500)
                                .json(err);
                        }else{
                            res
                                .status(204)
                                .json({
                                    "message":"updated successfully"
                                });
                        }
                    })
            }

        });
};

module.exports.hotelsDeleteOne = function (req,res) {
  var hotelId = req.params.hotelId;

  Hotel
      .findByIdAndRemove(hotelId)
      .exec(function (err,hotel) {
          if(err){
              res
                  .status(404)
                  .json(err);
          }else{
              console.log('hotel deleted id: ', hotelId);
              res
                  .status(204)
                  .json({
                      "message":"successfully deleted"
                  })
          }

      })
};