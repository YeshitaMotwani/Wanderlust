const Listing=require("../models/listing");
// const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
// const mapToken=process.env.MAP_TOKEN;
// const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm=(req, res) => {
    if(!req.isAuthenticated()){
      req.flash("error","You must be logged in to create a new listing!")
      return res.redirect("/login");
    }
    res.render("listings/new.ejs");
}

module.exports.renderShowForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    }).populate("owner");
    
    console.log(listing);
    
    if(!listing){
      req.flash("error","The Listing you requested was not found!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

module.exports.createNewListing = async (req, res) => {
    const { title, description, price, image } = req.body;
    let url=req.file.path;
    let filename=req.file.filename;
    let result=listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
      throw new ExpressError(400,result.error.listing);
    }
    const newListing = new Listing({
      title,
      description,
      price,
      image: {
        url: image.url,
        filename: image.filename
      }
    });
    if(!req.body.listing){
      throw new ExpressError(400,"Send valid data for listing");
    }
    try {
      newListing.owner=req.user._id;
      newListing.image={url,filename};
      // let response=await geocodingClient.forwardGeocode({
      //   query:req.body.listing.location,
      //   limit:1
      // }).send();

      // newListing.geometry=response.body.features[0].geometry;
      // console(response.body.features[0].geometry);
      await newListing.save();
      res.send("Done!");

      req.flash("success","New Listing was created!");
      res.redirect("/");
    } catch (e) {
      console.error(e);
      res.status(400).send("Error creating listing");
    }
  }


module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","The Listing you requested was not found!");
      res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing });
  }

module.exports.updateRoute=async (req, res) => {
    try {
      const { id } = req.params;
      let listing=Listing.findById(id);
      if(!currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
      }
      if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
      }
      // const { listing } = req.body;
      const updatedListing = await Listing.findByIdAndUpdate(id, listing, {
        new: true,
        runValidators: true,
      });
      if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
      }
      if (!updatedListing) {
        return res.status(404).send("Listing not found");
      }
      res.redirect(`/${id}`);
      req.flash("success","Listing was updated!");
    } catch (err) {
      console.error("Error updating listing:", err);
      res.status(400).send("Error updating listing");
    }
  }

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing was deleted!");
    res.redirect("/listings");
}