const express = require('express');

const route = express.Router();


route.get('/', (req, res) => {
   
    res.render('index')
});

route.get('/admin', (req, res) => {
    console.log(req.session.isAuth);
    console.log(req.session.user);
    if(!req.session.isAuth ||
        !req.session.user.isAdmin){
        res.redirect('404');
        return;
    }
    res.render('admin')
});

route.get('/cart', (req, res) => {
    res.render('cart')
});

route.get('/detail', (req, res) => {
    res.render('detail')
});

route.get('/order', (req, res) => {
    if(!req.session.isAuth ){
        res.redirect('404');
        return;
    }
    res.render('orders')
});

route.get('/manage-orders', (req, res) => {
    if(!req.session.isAuth ||
        !req.session.user.isAdmin){
        res.redirect('404');
        return;
    }
    res.render('manage-orders')
});


route.get('/update', (req, res) => {
    if(!req.session.isAuth ||
        !req.session.user.isAdmin){
        res.redirect('404');
        return;
    }
    res.render('update');
});


route.get('/401', (req, res) => {
    res.render('401')
});

route.get('/404', (req, res) => {
    res.render('404')
});

route.get('/500', (req, res) => {
    res.render('500')
});

module.exports = route;