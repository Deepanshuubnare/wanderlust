// if(process.env.NODE_ENV !="production"){
// require('dotenv').config();
// }
require('dotenv').config(); // Make sure this is on line 1
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const Review=require("./models/review.js");
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js");
const port=8080;
const dbUrl=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connection is created!")
}).catch((err)=>{
    console.log(err);
})

async function main() {
  await mongoose.connect(dbUrl);
}
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("error in Mongo Session!",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000 ,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use((req, res, next) => {                           
    const err = new ExpressError(404, "Page not found");
    next(err);
});

app.use((err,req,res,next)=>{
    let {status = 500, message = "Something went wrong!"}=err;
    res.status(status).render("error.ejs",{message});
})
 app.listen(port,()=>{
    console.log("app is working");
})
