const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("owner");
    if (!listing) {
        req.flash("error","Listing Does not Exist..");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing=async (req, res) => {
    let response=await geoCodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    let listing = req.body.listing;
    let url=req.file.path;
    let filename=req.file.filename;
    // Extract and set the image URL
    
    let r = await new Listing(listing);
    r.owner=req.user._id;
    r.image={url,filename};
    r.geometry=response.body.features[0].geometry;
    let end=await r.save();
    console.log(end);
    req.flash("success","New Listing created..");
    res.redirect("/listings");
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if (!listing) {
        req.flash("error","Listing Does not Exist..");
        return res.redirect("/listings");
    }

    let originalImgUrl=listing.image.url;

    originalImgUrl=originalImgUrl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs",{listing,originalImgUrl});
}

module.exports.editListing=async (req, res) => {
    const { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file!=="undefined")
    {
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("update", "Listing Updated.");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("failure","Listing Deleted..");
    res.redirect("/listings");
}

module.exports.searchListings = async (req, res) => {
    const searchQuery = req.query.q;
    const listings = await Listing.find({
      $text: { $search: searchQuery }
    });
    res.render("listings/index.ejs", { allListings: listings });
  };