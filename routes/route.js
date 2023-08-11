const express = require('express');

const route = express.Router();


route.get('/', (req, res) => {
    res.render('index')
});

route.get('/admin', (req, res) => {
    res.render('admin')
});

route.get('/cart', (req, res) => {
    res.render('cart')
});

route.get('/detail', (req, res) => {
    res.render('detail')
});

route.get('/order', (req, res) => {
    res.render('orders')
});

route.get('/sign-in', (req, res) => {
    res.render('sign-in')
});

route.get('/sign-up', (req, res) => {
    res.render('sign-up')
});

route.get('/update', (req, res) => {
    res.render('update')
});


module.exports = route;