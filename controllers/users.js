const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
//Signup
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup");
}

module.exports.signup=wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
})

//Login

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=passport.authenticate('local', 
    { failureRedirect: '/login',failureFlash:true },
    wrapAsync(
        async(req,res)=>{
        req.flash("success","Welcome back to Wanderlust");
}));

//Logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err)
            return next(err);
        req.flash("success","You are logged out now!");
        let redirectUrl=res.locals.redirectUrl;
        res.redirect(redirectUrl);
    })
}


// const User = require("../models/user.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const passport = require("passport");

// // Signup
// module.exports.renderSignupForm = (req, res) => {
//     res.render("users/signup"); // ✅ Corrected path
// };

// module.exports.signup=async (req, res) => {
//     try {
//         let { username, email, password } = req.body;
//         const newUser = new User({ email, username }); // ✅ Removed password from here
//         const registeredUser = await User.register(newUser, password); // ✅ Corrected registration
//         console.log(registeredUser); // ✅ Fixed incorrect console log
//         req.flash("success", "Welcome to Wanderlust!");
//         res.redirect("/listings");
//     } catch (e) {
//         req.flash("error", e.message);
//         res.redirect("/signup");
//     }
// };
// console.log("Signup function:", module.exports.signup);
// // Login
// module.exports.renderLoginForm = (req, res) => {
//     res.render("users/login"); // ✅ Corrected path
// };

// module.exports.login = (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//         if (err) return next(err);
//         if (!user) {
//             req.flash("error", "Invalid username or password");
//             return res.redirect("/login");
//         }
//         req.logIn(user, (err) => {
//             if (err) return next(err);
//             req.flash("success", "Welcome back to Wanderlust!");
//             res.redirect("/listings");
//         });
//     })(req, res, next);
// };

// // Logout
// module.exports.logout = (req, res, next) => {
//     req.logout((err) => {
//         if (err) return next(err);
//         req.flash("success", "You are logged out now!");
//         let redirectUrl = res.locals.redirectUrl || "/listings"; // ✅ Fixed reference to res.locals
//         res.redirect(redirectUrl);
//     });
// };

