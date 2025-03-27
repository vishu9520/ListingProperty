const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review =require

const listingSchema = new Schema({
    title:{
        type:String,
        require:true,

    },
    description:String,
    image:{
        type:Object,
        default:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
       set:(v)=> 
        v=== ""?"https://unsplash.com/photos/a-narrow-alleyway-between-two-buildings-in-an-old-town-kUUUeq47sqgk"
         :v,

    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports =Listing;