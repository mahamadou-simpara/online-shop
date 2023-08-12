const express = require('express');
const shop = require('./routes/shop');
const auth = require('./routes/auth')
const path = require('path');
const db = require('./data/database');
// const ejs = require('ejs');



const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(auth);
app.use(shop);


db.connectDB().then(() => {
    app.listen(3000, function(){
        console.log('App\'s running onn 3000!');
    });
})