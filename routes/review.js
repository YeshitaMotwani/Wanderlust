const express=require("express");
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const {reviewSchema}=require("../utils/schema.js");
const Review=require("../models/review.js");
const {isReviewAuthor,isLoggedIn,validateReview}=require("../middleware.js");
const reviewController=require('../controllers/reviews.js');

//Reviews - Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReviews));
  
  //Delete Review Route
  // Uncomment the below line and try later
  // router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReviews));

  module.exports=router;
  