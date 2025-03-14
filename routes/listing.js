const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listing = require("../models/listing.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const upload=multer({dest:'uploads'});
const storage=require("../cloudConfig.js");

//Index Route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createNewListing));
  
  //New Route
  router.get("/new", isLoggedIn,listingController.renderNewForm);
  
  //Show Route
  router.route("/:id")
  .get(wrapAsync(listingController.renderShowForm))
  .put(isLoggedIn,isOwner,wrapAsync(listingController.updateRoute))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
  
  //Edit Route
  router.get("/:id/edit", isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.renderEditForm));
  module.exports=router;
  