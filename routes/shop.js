const express = require("express");
const multer = require("multer");
// const ejs = require('ejs');
const db = require("../data/database");
const {ObjectId} = require('mongodb');

const route = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

route.get("/",async (req, res) => {
const products = await db.getDB().collection("products").find().toArray();
  res.render("index", {products: products});
});

route.get("/admin",async (req, res) => {
  console.log(req.session.isAuth);
  console.log(req.session.user);
  if (!req.session.isAuth || !req.session.user.isAdmin) {
    res.redirect("404");
    
    return;
  };

  const products = await db.getDB().collection("products").find().toArray();
  console.log(products);
  res.render("admin", {products: products});
});

route.get("/cart", (req, res) => {
  res.render("cart");
});

route.get("/detail", (req, res) => {
  res.render("detail");
});

route.get("/order", (req, res) => {
  if (!req.session.isAuth) {
    res.redirect("404");
    return;
  }
  res.render("orders");
});

route.get("/manage-orders", (req, res) => {
  if (!req.session.isAuth || !req.session.user.isAdmin) {
    res.redirect("404");
    return;
  }
  res.render("manage-orders");
});

route.get("/update", (req, res) => {
  if (!req.session.isAuth || !req.session.user.isAdmin) {
    res.redirect("404");
    return;
  }
  res.render("update");
});

route.get("/401", (req, res) => {
  res.render("401");
});

route.get("/404", (req, res) => {
  res.render("404");
});

route.get("/500", (req, res) => {
  res.render("500");
});

route.post("/add-product", upload.single("image"), async (req, res) => {
  const data = req.body;
  const file = req.file;
  // console.log(data);
  // console.log(file);

  if (!file) {
    console.log("Incorrect product image, Please check your product's image");
    return res.redirect("/update");
  }
// 
  if(!data.name || data.name.trim().length < 4){
      console.log('Incorrect product name, Please check your product\'s name');
      return res.redirect('/update');
  };
  if(!data.summary || data.summary.trim().length < 4){
      console.log('Incorrect product summary, Please check your product\'s summary');
      console.log(data);
      return res.redirect('/update');
  };

  if(!data.price || data.price <= 49){
      console.log('Incorrect product price, Please check your product\'s price');
      console.log(data.price);
      return res.redirect('/update');
  };
   if(!data.description || data.description.trim().length < 5){
          console.log('Incorrect product descrpition, Please check your product\'s descrpition');
          return res.redirect('/update');
      };

  const product = {
    name: data.name,
    summary: data.summary,
    price: data.price,
    description: data.description,
    path: file.path,
  }

  const result = await db.getDB().collection("products").insertOne(product);

  res.redirect("/admin");
});

route.post('/delete_product',async (req, res) =>{
 const id = new ObjectId(req.body.deleteID);

 await db.getDB().collection('products').deleteOne({_id: id});

 res.redirect('/admin');
})

module.exports = route;
