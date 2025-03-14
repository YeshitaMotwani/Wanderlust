const Listing=require("./models/listing");
const Review=require("./models/review");

const {listingSchema,reviewSchema}=require("./utils/schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create/edit/delete listing");
        return res.redirect("/login");
    }
    next();
}
// Middleware to validate listing
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(404, errMsg);
    } else {
      next();
    }
};

// Middleware to validate review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
module.exports.saveRedirectedUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        req.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=(req,res,next)=>{
    const { id } = req.params;
        let listing=Listing.findById(id);
        if(!currUser && !listing.ownder._id.equals(res.locals.currUser._id)){
            req.flash("error","You are not the owner of this listing!");
            return res.redirect(`/listings/${id}`);
        }
    next();
}

module.exports.isReviewOwner=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);

  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this listing");
    res.redirect(`/listings/${id}`);
  }
  next();
}