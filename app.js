const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate =require("ejs-mate");

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

app.get("/",(req,res)=>{
         res.send("Hi, I am root");
});
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
app.get("/listing/new", (req, res) => {
    res.render("new.ejs");
});

//Create Route
app.post("/listing",async(req,res)=>{
    // let {title,description,image,price,country,location} =req.params;
    // let listing =req.body.listing;
    const newListing = new Listing(req.body.listing);
   await newListing.save();
    // console.log(listing);
    res.redirect("/listing");
});
//edit form 
app.get("/listing/:id/edit",async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs",{listing});
});

//update route
app.put("/listing/:id", async (req,res)=>{
    let {id} =req.params;
    
    if (req.body.listing) {
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
      } else {
        // Handle the case where listing is missing in the request body
        res.status(400).send("Bad request: Listing data is missing");
      }
    res.redirect(`/listing/${id}`);
});

//Listing Route
app.get("/Listing",async (req,res)=>{
    const allListings = await Listing.find({})
    res.render("index.ejs",{allListings});
    
});
//Detete route
app.delete("/listing/:id",async (req,res)=>{
    let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listing");
});



//Show Route
app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format");
    }

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        
        res.render("show.ejs", {listing});
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


    
app.listen(8080,()=>{
    console.log("app is listing at port 8080");
});