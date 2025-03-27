const express =require("express");
const router = express.Router();
const wrapAsync= require("../utlis/wrapAsync.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const ExpressError= require("../utlis/ExpressError.js");
const Listing = require("../models/listing.js");



const validateListing = (req, res, next) => {
    let { error } =listingSchema.validate(req.body);
    
    if(error){
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

//Index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({})
    res.render("index.ejs",{allListings});
    
}));
//new route
router.get("/new", (req, res) => {
    res.render("new.ejs");
});

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("show.ejs",{listing});
}))

//Create Route

router.post("/",  validateListing,
    wrapAsync(async(req,res,next)=>{
       let result= listingSchema.validate(req.body);
       console.log(result);
       if(result.error){
        throw new ExpressError(400,result.error);
       }
        const newListing = new Listing(req.body.listing);
       
        await newListing.save();
        res.redirect("/listing");
  
    
}));
//update route
router.put("/:id", validateListing, wrapAsync(async (req,res)=>{ 
    
    let {id} =req.params;
    
    
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    res.redirect(`/listing/${id}`);
}));
module.exports=router;