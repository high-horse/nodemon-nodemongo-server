const express = require('express');
const route = express.Router();

const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

route.get('/', (req, res, next) => {
    console.log('Get all Orders');
    Order
        .find()
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then(result => {
            res.status(200).json({
                'status' : true,
                'count' : result.length,
                'orders': result.map(order =>{
                    return {
                        'order'  : order,
                        'request' : {
                            'http': 'GET',
                            'URL': 'http://localhost:3000/orders/'+order._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                'status' :false,
                'message' : err.message,
                'error' : err
            })
        })
});

route.get('/:orderId', (req, res, next) => {
    Order
        .findById(req.params.orderId)
        .select('_id product quantity')
        .exec()
        .then(result => {
            res.status(200).json({
                'status' :'success',
                'order' : result,
                'request': {
                    'http' : 'GET, POST',
                    'url' : 'http://localhost/3000/orders/'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                'status' : 'error',
                'message' : err.message,
                'error' : error
            })
        });
})

route.post('/', (req, res, next) => {

    if (!mongoose.Types.ObjectId.isValid(req.body.productId)) {
        return res.status(400).json({
            'status': 'failed',
            'message': 'Invalid product ID'
        });
    }
    Product
        .findById(req.body.productId)
        .then(product => {
            if(!product) {
                // throw new Error('No such product found');
                return res.status(404).json({
                    'status' : 'failed ! no such product found .'
                })  ;    
            }
            const order = new Order({
                _id : new mongoose.Types.ObjectId,
                product : req.body.productId,
                quantity : req.body.quantity
            });
            return order.save()
        })
        .then(result => {
            res.status(201).json({
                'status' : 'success',
                'message' : 'new order created successfully',
                'created order' : result,
            });
        })
        .catch(err => {
            res.status(500).json({
                'status' : 'failed ! no such product found ..',
                'message' : err.message,
                'error': err
            })
        })
})

route.delete('/:id', (req, res, next) => {
    Order.findByIdAndRemove(req.params.id)
        .exec()
        .then(result => {
            res.status(201).json({
                'status' : 'success',
                'message' : 'Order deleted successfully',
                'created order' : result,
                'request' : {
                    'purpose' : 'create new order',
                    'http' : 'POST',
                    'url' : 'http://localhost/3000/orders/',
                    'body' : {
                        'productId': 'Prouct id',
                        'quantity': 'Number'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                'status' : 'failed',
                'message' : err.message,
                'error': err
            })
        })
})

module.exports = route;