const express = require('express');
const routes = require('./routes/route')
const path = require('path');
const db = require('./data/database')
// const ejs = require('ejs');



const app = express();
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(routes);


db.connectDB().then(() => {
    app.listen(3000, function(){
        console.log('App\'s running onn 3000!');
    });
})