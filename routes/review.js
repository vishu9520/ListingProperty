const express =require("express");
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utlis/wrapAsync.js");
const ExpressError= require("../utlis/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const Review =require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview =(req,res,next)=>{
    let { error } =reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

//Delete Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess"," review deleted!");
    res.redirect(`/listing/${id}`);
}));

//for review
router.post("/",validateReview, wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id); // Add 'await' here

    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("sucess","New review created!");
    console.log("New review saved");
    res.send("New review saved");
}));

module.exports=router;