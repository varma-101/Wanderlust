const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const {validateReview}=require('../middleware.js');
const {isLoggedIn,isAuthor}=require('../middleware.js');
const reviewController=require('../controllers/review.js');

//Reviews post
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Reviews
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;
