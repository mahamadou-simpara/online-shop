const express = require("express");
const multer = require("multer");
// const ejs = require('ejs');
const db = require("../data/database");
const { ObjectId } = require("mongodb");

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

route.get("/", async (req, res) => {
  const products = await db.getDB().collection("products").find().toArray();
  res.render("index", { products: products });
});

route.get("/admin", async (req, res) => {
  //   console.log(req.session.isAuth);
  //   console.log(req.session.user);
  if (!req.session.isAuth || !req.session.user.isAdmin) {
    res.redirect("404");

    return;
  }

  const products = await db.getDB().collection("products").find().toArray();
  //   console.log(products);
  res.render("admin", { products: products });
});

route.get("/cart", (req, res) => {
  const orders = req.session.items;

  let overAllAmount = 0;

 
  for (let i = 0; i < orders.length; i++) {
      let singlePrice = 0;
      const item = req.session.items[i];
      singlePrice = item.total;
      overAllAmount = (overAllAmount + singlePrice);
  }
  console.log(overAllAmount);

  res.render("cart", {orders: orders, overAllAmount: overAllAmount});
});

route.get("/detail/:id", async (req, res) => {
  const id = new ObjectId(req.params.id); 
  const product = await db.getDB().collection("products").findOne(id);
  let userID;
  if(!req.session.user){
    userID = 'guest';
  }else{
    userID = req.session.user.id;
  };
console.log(userID);

  res.render("detail", { product: product,  userID: userID});
});

route.get("/order",async (req, res) => {
  if (!req.session.isAuth) {
    res.redirect("404");
    return;
  }
  const userID = req.session.user.id

  
//   const result = await db.getDB().collection('orders').find({id: userID}).toArray();
//   console.log(result);

  res.render("orders", );
});

route.get("/manage-orders", (req, res) => {
  if (!req.session.isAuth || !req.session.user.isAdmin) {
    res.redirect("404");
    return;
  }
  res.render("manage-orders");
});

route.get("/add_product", (req, res) => {
  if (!req.session.isAuth || !req.session.user.isAdmin) {
    res.redirect("404");
    return;
  }
  res.render("add_product");
});

// route.get("/update_product/:id",async (req, res) => {
//     // if (!req.session.isAuth || !req.session.user.isAdmin) {
//     //   res.redirect("404");
//     //   return;
//     // }

//     const id = new ObjectId(req.params.id);
//     const product = await db.getDB().collection("products").findOne(id);

//     res.render("update_product", {product: product});
//   });

route.get("/update_product/:id", async (req, res) => {
  // if (!req.session.isAuth || !req.session.user.isAdmin) {
  //   res.redirect("404");
  //   return;
  // }

  const id = new ObjectId(req.params.id);
  const product = await db.getDB().collection("products").findOne(id);

  res.render("update_product", { product: product });
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
  if (!data.name || data.name.trim().length < 4) {
    console.log("Incorrect product name, Please check your product's name");
    return res.redirect("/update");
  }
  if (!data.summary || data.summary.trim().length < 4) {
    console.log(
      "Incorrect product summary, Please check your product's summary"
    );
    console.log(data);
    return res.redirect("/update");
  }

  if (!data.price || data.price <= 49) {
    console.log("Incorrect product price, Please check your product's price");
    console.log(data.price);
    return res.redirect("/update");
  }
  if (!data.description || data.description.trim().length < 5) {
    console.log(
      "Incorrect product descrpition, Please check your product's descrpition"
    );
    return res.redirect("/update");
  }

  const product = {
    name: data.name,
    summary: data.summary,
    price: data.price,
    description: data.description,
    path: file.path,
  };

  const result = await db.getDB().collection("products").insertOne(product);

  res.redirect("/admin");
});

route.post("/delete_product", async (req, res) => {
  const id = new ObjectId(req.body.deleteID);

  await db.getDB().collection("products").deleteOne({ _id: id });

  res.redirect("/admin");
});

route.post("/update/:id", upload.single("image"), async (req, res) => {
  const id = new ObjectId(req.params.id);
  const file = req.file;
  const data = req.body;
  if (!file) {
    console.log("Incorrect product image, Please check your product's image");
    return res.redirect(`/update_product/${req.params.id}`);
  }
  //
  if (!data.name || data.name.trim().length < 4) {
    console.log("Incorrect product name, Please check your product's name");
    return res.redirect(`/update_product/${req.params.id}`);
  }
  if (!data.summary || data.summary.trim().length < 4) {
    console.log(
      "Incorrect product summary, Please check your product's summary"
    );
    console.log(data);
    return res.redirect(`/update_product/${req.params.id}`);
  }

  if (!data.price || data.price <= 49) {
    console.log("Incorrect product price, Please check your product's price");
    console.log(data.price);
    return res.redirect(`/update_product/${req.params.id}`);
  }
  if (!data.description || data.description.trim().length < 5) {
    console.log(
      "Incorrect product descrpition, Please check your product's descrpition"
    );
    return res.redirect(`/update_product/${req.params.id}`);
  }

  const result = await db
    .getDB()
    .collection("products")
    .updateOne(
      { _id: id },
      {
        $set: {
          name: data.name,
          summary: data.summary,
          price: data.price,
          description: data.description,
          path: file.path,
        },
      }
    );

  console.log(result);

  res.redirect("/admin");
});

route.post('/order', (req, res) =>{

    console.log(req.body);
  
 
    // req.session.items = [];

    if (!req.session.items) {
        req.session.items = [];
    };

    try{


    // Add the new order to the array
    req.session.items.push({
        name: req.body.name,
        price: req.body.price,
        date: req.body.date,
        id:  req.body.id, 
        quantity: req.body.quantity,
        total: (+req.body.price * req.body.quantity)
    });

    req.session.save(() =>{
        res.redirect('/');
    });

} catch(error){
     console.log(error);
}

console.log('See');


});



route.post('/update-quantity',async (req, res) =>{

    const itemIdToUpdate = req.body.id;
    const newQuantity = req.body.quantity;

    if(newQuantity > 21){
        console.log('Please order products in quantities of 20 or fewer at a time');
        return;
    }

    if (!req.session.items) {
        return res.redirect('/cart'); // No items in session
    }

    // console.log(itemIdToUpdate);
    const itemIndex = req.session.items.findIndex(item => item.id === itemIdToUpdate);
   
    console.log(itemIndex);

    // const itemIndex = req.session.items.findIndex(item => item.id === itemIdToUpdate);
    // console.log(itemIndex);

    if (itemIndex !== -1) {
        req.session.items[itemIndex].quantity = newQuantity;
        req.session.items[itemIndex].total = (+req.session.items[itemIndex].quantity * req.session.items[itemIndex].price)
    };

    req.session.save(() =>{
        res.redirect('/cart');
    })
    // console.log(req.session.items);
});


route.get('/get-item', (req, res) => {
    const items = req.session.items

    res.json(items);
});


route.get('/get-user', (req, res) => {
    const user = req.session.isAuth
    let userState;

    if (!user) {
       userState = 'Guest';
    }else{
        userState = 'Customer'
    }

    res.json({userState});
});


route.post('/buy',async (req, res) => {
    if(req.body.userState !== 'Customer'){
        console.log('Not Allowed');
        return
    }

    if(req.session.items.length < 1){
        console.log('You don\'t have any item');
        res.redirect('/order');
        return; 
    }

    
   

   const order = {
    id: req.session.user.id,
    date: new Date(),
    items: req.session.items,
   };
//     req.session.items.push({
//     id: req.session.user.id,
//     date: new Date()
//    });

   
 

//    console.log(req.session.items);

    const result = await db.getDB().collection('orders').insertOne(order);

    console.log(result);

    req.session.items = [];

    res.redirect('/');

    // return res.redirect('/order');
});

module.exports = route;
