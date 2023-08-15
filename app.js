const express = require("express");
const shop = require("./routes/shop");
const auth = require("./routes/auth");
const path = require("path");
const multer = require("multer");
const db = require("./data/database");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session");
var bodyParser = require('body-parser')


const SessionStore = MongoDBStore(session);

const store = new SessionStore({
  uri: "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1",
  databaseName: "online-shop",
  collection: "mySession",
});

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: "Keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(function (req, res, next) {
  const isAuth = req.session.isAuth;
  if (!isAuth) {
    return next();
  }

  res.locals.isAuth = isAuth;
  const isAdmin = req.session.user.isAdmin;
  if (!isAdmin) {
    return next();
  }

  res.locals.isAdmin = isAdmin;
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(auth);
app.use(shop);


app.use(function(req, res, nest){
  res.redirect('/500')
});

db.connectDB().then(() => {
  app.listen(3000, function () {
    console.log("App's running onn 3000!");
  });
});
