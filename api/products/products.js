const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const multer = require('multer');
const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename : function(req, file, cb)  {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const upload = multer({storage: storage});

route.get('/', (req, res, next) => {
    console.log('Handling get all products request');
    Product
        .find()
        .select('_id name price productImage')
        .exec()
        .then(result => {
            res.status(200);
            res.json({
                'status' : 'true',
                'connection' : 'Alive',
                'message' : 'These are all the products',
                'metadata' : {
                    'count' : result.length,
                    
                },
                'Products' : result,
            })
        })
        .catch(err => {
            console.log(err);
            res.status(404);
            res.json({
                'status' : false,
                'message' : err.message
            })
        })
    
});

route.get('/:productId', (req, res, next) => {
    console.log('Handling get pprodict by id request');

    let foundItem ; 
    Product
        .findById(req.params.productId)
        .exec()
        .then(product => {
            console.log(product);
            foundItem = product;
            res.status(200);
            let id = req.params.productId
            res.json({
                'status' : 'True',
                'sent ID' : req.params.productId,
                'product' : foundItem
            })
        })
        .catch(err => { 
            console.log(err); 
            res.status(400);
            let id = req.params.productId
            res.json({
                'status' : 'false',
                'sent ID' : req.params.productId,
                'error' : err.message
            })
        })

    
})

route.post('/', upload.single('productImage'),(req, res, next) => {
    console.log(req.file);
    console.log('Handling post product requesst');
    let name = req.body.name;
    let price = req.body.price;
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage : req.file.filename
    })
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(200);
            res.json({
                'status': 'success',
                'prduct' : product
            }) 
        })
        .catch(err => {
            console.log(err);
            res.status(500);
            res.json({
                'status': 'failed',
                'prduct' : product,
                'error' : err
            }) 
        });
    
})

route.delete('/:productId', (req, res, next) => {
    console.log('Handling DELETE product request');
    let id = req.params.productId;

    Product
        .deleteOne({_id : id})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200);
            res.json({
                'status' : 'success',
                'result' : result,
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                'error' : err
            })
        })
})

route.patch('/:productId', (req, res, next) => {
    console.log('Handling PATCH request');
    const id = new mongoose.Types.ObjectId(req.params.productId);

    let updateOps = {};
    for (let key in req.body) {
        updateOps[key] = req.body[key];
    }
    const updatedvals = {$set : updateOps};
    // const updatedvals = {$set : {name: req.body.name, price: req.body.price}};
    Product
        .updateOne({_id : id}, updatedvals)
        .then(result => {
            console.log(result);
            res.status(200);
            res.json({
                'status': true,
                'updated vals': updatedvals,
                'result' : result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400);
            res.json({
                'status' : false,
                'message' : err.message,
            })
        })

})

module.exports = route