const express = require("express");
const router = express.Router({mergeParams:true});
const app = express();
const mongoose = require("mongoose");
const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate =require("ejs-mate");
const wrapAsync= require("./utlis/wrapAsync.js");
const ExpressError= require("./utlis/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy =require("passport-local");
const User =require("./models/user.js");
const userRouter =require("./routes/user.js");

const { listingSchema,reviewSchema } = require("./schema.js");

const Review =require("./models/review.js");
const review = require("./models/review.js");

const listings =require("./routes/listing.js");
const reviews =require("./routes/review.js");


async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
    .then(()=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err);
    })
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"mysuperetcode",
    resave :false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};


app.get("/", async (req, res) => {
    try {
        const listing = await Listing.findOne();  // Fetch a sample listing
        console.log(listing);
        res.send("Hi, I am root");
    } catch (error) {
        console.error("Error fetching listing:", error);
        res.status(500).send("Error fetching listing");
    }
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    // console.log(res.locals.success);
    next();
});

app.get("/demouser",async(req,res)=>{
    let fakeUser = new User({
        email:"student@gmail.com",
        username:"delta-student"
    });
    let registeredUser =await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})

app.use("/listing",listings);
app.use("/listing/:id/reviews",reviews);
app.use("/",userRouter)
//validate review
// const validateReview =(req,res,next)=>{
//     let { error } =reviewSchema.validate(req.body);
//     if(error){
//         let errMsg= error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
//     }
// };
// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location :"Calangute,Goa",
//         country:"India",
//     })
//    await sampleListing.save();
//    console.log("sample was save");
//    res.send("successful testing");
// });


//new Route
// app.get("/listing/new", (req, res) => {
//     res.render("new.ejs");
// });

//middleware



//Create Route

// app.post("/listing",  validateListing,
//     wrapAsync(async(req,res,next)=>{
//        let result= listingSchema.validate(req.body);
//        console.log(result);
//        if(result.error){
//         throw new ExpressError(400,result.error);
//        }
//         const newListing = new Listing(req.body.listing);
       
//         await newListing.save();
//         res.redirect("/listing");
  
    
// }));


// //edit form 
// app.get("/listing/:id/edit",wrapAsync(async (req,res)=>{
//     let {id} =req.params;
//     const listing = await Listing.findById(id);
//     res.render("edit.ejs",{listing});
// }));

//update route
// app.put("/listing/:id", validateListing, wrapAsync(async (req,res)=>{ 
    
//     let {id} =req.params;
    
    
//         await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
//     res.redirect(`/listing/${id}`);
// }));

//Index Route
// app.get("/Listing",wrapAsync(async (req,res)=>{
//     const allListings = await Listing.find({})
//     res.render("index.ejs",{allListings});
    
// }));
//Detete route
// app.delete("/listing/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   res.redirect("/listing")
// }));


// //for review
// app.post("/listing/:id/reviews",validateReview, wrapAsync( async (req, res) => {
//     let listing = await Listing.findById(req.params.id); // Add 'await' here

//     if (!listing) {
//         return res.status(404).send("Listing not found");
//     }

//     let newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     console.log("New review saved");
//     res.send("New review saved");
// }));
// //Delete Route
// app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;
    
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listing/${id}`);
// }));



//Show Route
// app.get("/listing/:id",wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("show.ejs",{listing});
// }))






// app.get("/listing/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).send("Invalid ID format");
//     }

//     try {
//         const listing = await Listing.findById(id);
//         if (!listing) {
//             return res.status(404).send("Listing not found");
//         }
        
//         res.render("show.ejs", {listing});
//     } catch (err) {
//         console.error(err);
        
//         res.status(500).send("Server Error");
//     }
// }));

//middle ware for error handling 

app.all("*",(req,res,next)=>{
    next (new ExpressError(404,"Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something Went Wrong!"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});


// app.all('*', (req, res, next) => {
//     res.status(404).json({ error: "The requested page was not found." });
// });


    
app.listen(8080,()=>{
    console.log("app is listing at port 8080");
});

//validation is not working properly for page now working 
