const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require("path")
const cookieParser = require('cookie-parser')
const app = express();

const jwt = require('jsonwebtoken')
const Product = require('./moddel/product')
require('dotenv').config();
const userRoute = require('./route/user')
const categoryRoute= require('./route/category')
const productRoute = require('./route/product')
const orderRoute = require('./route/order')
const multer = require('multer')
const uploadRoute = require('./route/upload')
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const fs = require('fs')
const mime = require('mime-types');
const handler= require('./middleware/handler')
const User = require('./moddel/user')


app.use(express.json());
app.use(cookieParser());

// const allowedOrigins = ['http://localhost:3000'];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true 
// }));
  
  

  
  const DB = process.env.MONGO
  
  
  app.use("/users", userRoute)
  app.use("/category",categoryRoute)
  app.use( "/products"    ,productRoute)
  app.use('/uploads', uploadRoute)
  app.use('/orders', orderRoute)
  app.use('/uploads',express.static(__dirname + '/uploads') )

  app.get('/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT })
  })


app.use(express.static(path.join(__dirname, './frontend/build')))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname,'./frontend/build/index.html' ))
})



  mongoose
  .connect(DB)
  .then(result => {
    app.listen(4500);
    console.log('working');
  })
  .catch(err => {
    console.log(err);
  });