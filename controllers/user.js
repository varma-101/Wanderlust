const User=require('../models/user.js');


module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.createUser=async(req,res,next)=>
{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        let registerdUser=await User.register(newUser,password);
        req.login(registerdUser,(err)=>{
            if(err)
            {
                return next(err);
            }
            req.flash("success", "Successfully registered!"); // Example success message
            res.redirect("/listings");
        })
    } 
    catch(err)
    {
            req.flash("error",err.message);
            return res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginUser=async(req,res)=>{
    req.flash("success","Welcome Back..");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutUser=(req,res,next)=>{
    req.logOut((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","Logged out");
        res.redirect("/listings");
    })
}