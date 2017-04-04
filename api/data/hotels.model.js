var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        required:true
    },
    review:{
        type:String,
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
});

var roomSchema = new mongoose.Schema({
    type:String,
    number:Number,
    descriptions:String,
    photos:[String],
    price:Number
});

var hotelSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    stars:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
    services:[String],
    description:String,
    photos:[String],
    currency:String,
    reviews:[reviewSchema],
    rooms:[roomSchema],
    location:{
        address:String,
        //always store coordinates longitude (E/W), latitude (N/S)
        coordinates:{
            type:[Number],
            index:'2dsphere'
        }
    }
});

//the first is the model name, the last is the collection name, remember to add the collection name, otherwise it can not select the right collection to get documents
mongoose.model('Hotel',hotelSchema,'hotel');