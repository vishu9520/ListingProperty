const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        require:true,

    },
    description:String,
    image:{
        type:Object,
        default:"https://unsplash.com/photos/a-narrow-alleyway-between-two-buildings-in-an-old-town-kUUUeq47sqgk",
       set:(v)=> v=== ""?"https://unsplash.com/photos/a-narrow-alleyway-between-two-buildings-in-an-old-town-kUUUeq47sqgk":v,

    },
    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports =Listing;