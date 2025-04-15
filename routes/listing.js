const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const { render } = require("ejs");
const upload=multer({storage});
// new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.createListing));

// filters
router.get("/privacy/pri",(req,res)=>{
  res.render("./listings/privacy.ejs");
})
router.get("/terms/ter",(req,res)=>{
  res.render("./listings/terms.ejs")
})
router.get("/filter/trending", async (req, res) => {
    const somelistings = await Listing.find().limit(5);
    res.render("./listings/showing.ejs", { somelistings });
});
router.get("/filter/rooms", async (req, res) => {
    const somelistings = await Listing.find({
        $or: [
            { title: /loft|apartment|house|brownstone|room|studio|villa|condo|flat|suite|residence|unit|penthouse/i },
            { description: /apartment|cozy|downtown|canal|modern|central|spacious|compact|urban|walkable|minimalist/i }
          ]
    });
    res.render("./listings/showing.ejs", { somelistings });
  });
  router.get("/filter/mountains", async (req, res) => {
    const somelistings = await Listing.find({
      $or: [
        { title: /mountain|cabin|retreat|wood|log|chalet|alps|hills|forest|banff|tahoe|hilltop/i },
        { description: /mountain|nature|hiking|scenic|wooded|peaceful|adventure|trail|outdoor|snowy|panoramic/i }
      ]
    });
    res.render("./listings/showing.ejs", { somelistings });
  });
  router.get("/filter/arctic", async (req, res) => {
    const somelistings = await Listing.find({
      $or: [
        { title: /arctic|snow|igloo|northern|polar|ice|glacier|white|frost|montana|scotland|alaska/i },
        { description: /snow|chilly|winter|cozy|hot tub|cold|northern lights|fireplace|blanket|glacier|frozen/i }
      ]
    });
    res.render("./listings/showing.ejs", { somelistings });
  });
  router.get("/filter/pools", async (req, res) => {
    const somelistings = await Listing.find({
      $or: [
        { title: /pool|beach|villa|bungalow|resort|island|coast|bay|bali|phuket|greece|oceanfront|maldives|lagoon/i },
        { description: /pool|sea|sunset|tropical|relax|sun|waterfront|waves|sand|blue|infinity pool|paradise/i }
      ]
    });
    res.render("./listings/showing.ejs", { somelistings });
  });
  router.get("/filter/camping", async (req, res) => {
    const somelistings = await Listing.find({
      $or: [
        { title: /camp|camping|tent|yurt|outdoor|glamping|camper|rv|nature|retreat|wilderness/i },
        { description: /campfire|tent|stars|sleeping bag|forest|woods|adventure|trail|nature|bonfire|scenic|wildlife/i }
      ]
    });
    res.render("./listings/showing.ejs", { somelistings });
  }); 
  router.get("/filter/topcities", async (req, res) => {
    const somelistings = await Listing.find({
      $or: [
        { title: /apartment|condo|studio|flat|loft|high-rise|downtown|urban|city|New York|Paris|Tokyo|London|Dubai|Singapore|Los Angeles|Berlin|Rome|Barcelona|Chicago/i },
        { description: /downtown|central|metro|skyscraper|nightlife|public transport|urban|shopping|city view|hub|business district|New York|Paris|Tokyo|London|Dubai|Singapore|Los Angeles|Berlin|Rome|Barcelona|Chicago/i }
      ]
    });
    res.render("./listings/showing.ejs", { somelistings });
  });
  router.get("/filter/search", async (req, res) => {
    const searchTerm = req.query.searchTerm || "";
  
    if (!searchTerm.trim()) {
      return res.render("./listings/showing.ejs", { somelistings: [] });
    }
  
    const regex = new RegExp(searchTerm, "i"); // case-insensitive
  
    const somelistings = await Listing.find({
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
        { country: regex }
      ]
    });
    
    res.render("./listings/showing.ejs", { somelistings });
  });
  
  
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//edit form
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;
