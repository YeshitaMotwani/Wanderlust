// const {saveRedirectedUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");


// //Sign up route

// router.get("/signup",(req,res,next)=>{
//     res.render("users/signup.ejs");
// });

// router.get("/signup",userController.signup);


// //Login Route
// router.get("/login",(req,res)=>{
//     res.render("users/login.ejs");
// });


// //Logout route
// router.get("/logout",userController.logout);

// const express=require("express");
// const User=require("../models/user");
// const wrapAsync=require("../utils/wrapAsync");
// const router=express.Router();
// const passport=require("passport");
// const user = require("../models/user");


// //Signup
// router.route("/signup")
//     .get(userController.renderSignupForm)
//     .post(userController.signup);

// //Login Route
// router.route("/login")
//     .get(userController.renderLoginForm)
//     .post(userController.login);

// //Logout Route
// router.get("/logout",userController.logout);



const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// const userController = require("../controllers/users.js");
console.log("userController:", userController);

console.log("Wrapped signup:", wrapAsync(userController.signup));
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", { 
        failureRedirect: 'login', 
        failureFlash: true, 
    }),
    userController.login
);
// .post(saveRedirectUrl, userController.login); // ✅ Only use userController.login

router.get("/logout", userController.logout);

module.exports = router;