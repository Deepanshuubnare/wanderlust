const Review=require("../models/review.js")
const Listing=require("../models/listing.js");
const summarizeText = require('../utils/summarizeReviews');
module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let {id}=req.params;
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
   const populatedListing = await Listing.findById(id).populate("reviews");
   const reviewComments = populatedListing.reviews
    .map(r => r.comment?.trim())
    .filter(Boolean);
   console.log("ALL reviews:",reviewComments);
  let summary = "Not enough review content to summarize.";
  if (reviewComments.length >= 1) {
    const combinedText = reviewComments.join(". ");
    summary = await summarizeText(combinedText);
  }
  listing.reviewSummary=summary;
 await listing.save();
    req.flash("success","New review is created!");
    res.redirect(`/listings/${id}`);
   };
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted!");
    res.redirect(`/listings/${id}`);
}