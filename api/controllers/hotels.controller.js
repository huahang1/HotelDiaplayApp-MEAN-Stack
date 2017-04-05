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
                res.status(500);
            }
            console.log('Geo results: ', results);
            console.log('Geo stats: ', stats);
            res
                .status(200)
                .json(results);
        });
};

module.exports.hotelsGetAll = function (req,res) {

    console.log('get the hotels');
    console.log('req param: ', req.query);

    var offset = 0;
    var count = 5;

    if(req.query && req.query.lng && req.query.lat){
        runGeoQuery(req,res);
        return;
    }

    // var db = dbconn.get();
    // var collection = db.collection('hotel');

    if (req.query && req.query.offset){
        //here 10 means the number converted is based on decimal
        offset = parseInt(req.query.offset,10);
    }

    if (req.query && req.query.count){
        count = parseInt(req.query.count,10);
    }

    console.log('Hotel: ', Hotel);

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function (err,hotels) {
            if (err){
                console.log('err: ', err);
                res.status(500);
            }
            console.log('hotels: ', hotels);
            res
                .status(200)
                .json(hotels);
        });

    // collection
    //     .find()
    //     .skip(offset)
    //     .limit(count)
    //     //without the toArray, it will cause the error called "converting circular structure to json"
    //     .toArray(function (err,docs) {
    //         console.log('find hotels: ', docs.length);
    //         res
    //             .status(200)
    //             .json(docs);
    //     });

};

module.exports.hotelsGetOne = function (req,res) {

    // var db = dbconn.get();
    //
    // var collection = db.collection('hotel');

    var hotelId = req.params.hotelId;

    console.log('get hotelId: ', hotelId);

    Hotel
        .findById(hotelId)
        .exec(function (err,doc) {
            if (err){
                console.log('err: ', err);
                res.status(500);
            }
            console.log('doc: ', doc);
            res
                .status(200)
                .json(doc);
        });

};

module.exports.hotelsAddOne = function (req,res) {

    var db = dbconn.get();
    var collection = db.collection('hotel');

    var newHotel;

    console.log('POST new hotel');
    if (req.body && req.body.name && req.body.stars){
        newHotel = req.body;
        newHotel.stars = parseInt(req.body.stars,10);
        console.log('newHotel: ', newHotel);

        //sae this to database
        collection.insertOne(newHotel,function (err,response) {
            if (err){
                console.log('err: ', err);
                res.status(500);
            }
            console.log('response.ops: ',response.ops);
            res
                .status(200)
                .json(response.ops);
        });

    }else{
        console.log('Data missing from the req.body');
        res
            .status(400)
            .json({message:'Required data missing from body'});
    }


};