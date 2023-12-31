const express = require('express');
const route = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

route.post('/signup', (req, res, next) => {
    User
        .find({email : req.body.email})
        .exec()
        .then(result => {
            if(result.length > 0) {
                res.status(509).json({
                    message : 'The email already eists.'
                })
            } else {
                bcryptjs.hash(req.body.password, 10 , (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            email: req.body.email,
                            password : hash 
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(200).json({
                                    'message': 'New user Created',
                                    'user-details': result,
                                })
                            }).catch(err =>{
                                res.status(500).json({
                                    message: err.message,
                                    error: err
                                });
                            })
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message,
                error: err
            })
        });    
});

route.delete('/:userId', (req, res, next) => {
    let userId = req.params.userId;
    User
        .deleteOne({ _id : userId})
        .exec()
        .then(result => {
            if(result.deletedCount > 0) {
                res.status(200).json({
                    message : "user deleted successfully",
                    'deleted id' : userId,
                    'result' : result,
                })
            } else {
                return res.status(404).json({
                    message: 'User not found',
                });
            }
            
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error deleting user.',
                error: err
            })
        })
})

route.get('/getUsers', (req, res, next) => {
    User
        .find()
        .exec()
        .then(result => {
            res.status(200).json({
                message : "all registered users",
                'result' : result,
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error deleting user.',
                error: err
            })
        });
})

// route.post('/login', (req, res, next) => {
//     User
//         .findOne({ email: req.body.email })
//         .exec()
//         .then(user => {
//             if (!user) {
//                 return res.status(404).json({message: 'Auth failed'});
//             }
//             bcryptjs
//                 .compare(req.body.password, user.password)
//                 .then(match => {
//                     if (match) {
//                         const token = jwt.sign({
//                                 email : user.email,
//                                 userId : user._id,
//                             }, 
//                             process.env.JWT_KEY,
//                             {
//                                 expiresIn: "1h"   
//                             }
//                         )
//                         return res.status(200).json({
//                             message: 'Auth success',
//                             token: token
//                         });
//                     } else {
//                         return res.status(404).json({message: 'Auth failed'});
//                     }
//                 })
//                 .catch(err => {
//                     return res.status(404).json({message: 'Auth failed'});
//                 })
//         })
//         .catch(err => {
//             return res.status(404).json({message: 'Auth failed'});
//         });
// })

// route.post('/login', (req, res, next) => {
//     User
//         .findOne({ email: req.body.email })
//         .exec()
//         .then(user => {
//             if (!user) {
//                 return res.status(401).json({ message: 'Auth failed' });
//             }
//             bcryptjs
//                 .compare(req.body.password, user.password)
//                 .then(match => {
//                     if (match) {
//                         const token = jwt.sign({
//                                 email : user.email,
//                                 userId : user._id,
//                             }, 
//                             process.env.JWT_KEY,
//                             {
//                                 expiresIn: "1h"   
//                             }
//                         )
                        
//                         return res.status(200).json({
//                             message: 'Auth success',
//                             'token': token,
//                         });
//                     } else {
//                         return res.status(401).json({ message: 'Auth failed' });
//                     }
//                 })
//                 .catch(err => {
//                     return res.status(500).json({ message: 'Auth failed' });
//                 })
//         })
//         .catch(err => {
//             return res.status(500).json({ message: 'Auth failed' });
//         });
// })


route.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Auth failed: User not found' });
            }
            return bcryptjs.compare(password, user.password)
                .then(match => {
                    if (!match) {
                        throw new Error('Auth failed: Password does not match');
                    }
                    const token = jwt.sign(
                        { email: user.email, userId: user._id },
                        process.env.JWT_KEY,
                        { expiresIn: "1h" }
                    );
                    return res.status(200).json({
                        message: 'Auth success',
                        token,
                    });
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: err.message, 'error': err });
        });
});



module.exports = route;