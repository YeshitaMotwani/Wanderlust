if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/expressError.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const Review=require("./models/review.js");
// const {listingSchema,reviewSchema}=require("./utils/schema.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const passport=require("passport");
const LocalStrategy = require("passport-local");

// const newLocalStrategy=require("passport-local-mongoose");
const User=require("./models/user.js");
const UserRouter=require("./routes/user.js");
const userController=require("./controllers/users.js");
console.log("Testing userController:", userController);

const session=require("express-session");
const flash=require("connect-flash");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOptions=
{
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.engine("ejs",ejsMate);

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

app.use("/",UserRouter);
app.use("/listings",listings);
app.use("/reviews",reviews);


app.use("/demouser",async(req,res)=>{
  let fakeUser=new User({
    email:"student@gmail.com",
    username:"delta-student"
  });
  let registeredUser=await User.register(fakeUser,"helloWorld");
  res.send(registeredUser);
});
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error", {
    layout: "layouts/boilerplate",
    message,
    body: "This is some content for the error page body",
  });
});

app.get("/", (req, res) => {
  res.render("layouts/boilerplate", { body: "Welcome to Wanderlust" });
});


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

// app.get("/listings/error", (req, res) => {
//   res.render("listings/error", { layout: "layouts/boilerplate", message: "An error occurred", body: "This is some content for the error page body" });
// });


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});