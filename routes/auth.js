const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../data/database');


const route = express.Router();

route.get('/sign-in', (req, res) => {
    res.render('sign-in')
});

route.get('/sign-up', (req, res) => {
    res.render('sign-up')
});


route.post('/sign-up',async (req, res) => {
    const data = req.body;

    if (!data.email) {
        console.log('Error: Invalid Email');
        return;
    } else if (!data['confirm-email']) {
        console.log('Error: Invalid Confirm-Email');
        return;
    } else if (data['confirm-email'] !== data.email) {
        console.log('Error: Email and Confirm-Email Mismatch');
        return;
    } else if (data.password.trim().length < 5) {
        console.log('Error: Password must be at least 5 characters');
        return;
    } else if (data['full-name'].trim().length < 4) {
        console.log('Error: Invalid Full Name');
        return;
    } else if (!data.street) {
        console.log('Error: Invalid Street');
        return;
    } else if (!data['code-postal']) {
        console.log('Error: Invalid Postal Code');
        return;
    } else if (!data.city) {
        console.log('Error: Invalid City');
        return;
    }else if(isNaN(data['code-postal'])){
        console.log('Error: Code-postal must be a number');
        return;
    }

    const checkEmail = await db.getDB().collection('users').findOne({email: data.email});
    if(checkEmail){
        console.log('Error: Existing Email !');
        return
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = {
        email: data.email,
        ['confirm-email']: data['confirm-email'],
        password: hashedPassword,
        ['full-name']: data['full-name'],
        street: data.street,
        ['code-postal']: data['code-postal'],
        city: data.city
    }
    
    const result = await db.getDB().collection('users').insertOne(user);

    if(!result){
        console.log('Error: Data not submitted');
        return;
    }

    res.redirect('/sign-in');
});


route.post('/sign-in',async (req, res) => {
    const data = req.body;
    if (!data.email) {
        console.log('Error: Invalid Email');
        return;
    };
    

    const checkEmail = await db.getDB().collection('users').findOne({email: data.email});
    if(!checkEmail){
        console.log('Error: Email not found!');
        return;
    }


    const passwordCheck = await bcrypt.compare(data.password, checkEmail.password)
    
    if(!passwordCheck){
        console.log('Error: Incorrect password!');
        return;
    };


    res.redirect('/');

});



module.exports = route;