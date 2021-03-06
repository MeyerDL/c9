var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./model/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")

// requiring routes
var commentsRoutes      = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//seedDB(); //seed the database

//Passport Configuration

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});