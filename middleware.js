const Listing = require('./models/listing.js');
const Review=require('./models/review.js');
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('./schema.js');


module.exports.isLoggedIn=(req,res,next)=>
{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You have to be Logged in..");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings"); // Added return to stop further execution
    }

    if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have access to modify this listing.");
        return res.redirect(`/listings/${id}`); // Added return to stop further execution
    }

    next(); // Proceed to the next middleware or route handler
};


module.exports.isAuthor = async (req, res, next) => {
    const { reviewId, id: listingId } = req.params; // Assuming you also have listingId in params
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect(`/listings/${listingId}`); // Ensure correct redirect
    }

    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have access.");
        return res.redirect(`/listings/${listingId}`); // Ensure correct redirect
    }

    next(); // Proceed to the next middleware or route handler
};


module.exports.validateListing =(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
}

module.exports.validateReview =(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
}