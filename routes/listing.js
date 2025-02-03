const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js');
const listingController=require('../controllers/listing.js');
const multer=require('multer');
const {storage}=require('../cloudConfig.js');
const upload=multer({ storage });

// Route to get all listings & post new listing
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"), validateListing,wrapAsync(listingController.createListing));

//create
router.get("/new",isLoggedIn,listingController.renderNewForm);

//show , update & delete routes
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.patch(isLoggedIn, isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.editListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

router.get("/search", wrapAsync(listingController.searchListings));

module.exports=router;