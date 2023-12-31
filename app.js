const express = require('express');
const app = express();

const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose= require('mongoose');;

const productsRoute = require('./api/products/products');
const ordersRoute = require('./api/orders/orders');
const userRoute = require('./api/users/users');

app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const uri = "mongodb+srv://camel:"+process.env.ATLAS_MONGO_SERVERAPI_PW+"@nodeapi.joodu4k.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri);

// app.use((req, res, next) => {
//     res.header('Allow-Control-Access-Origin' , '*');
//     res.header('Access-Control-Allow-Header','Origin, X-Requested-With, Content Type, Accept, Authorization');

//     if(req.method == 'OPTIONS'){
//         res.header('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE, PATCH');
//         res.status(200).json({});
//     }
// })

app.use('/products', productsRoute);
app.use('/orders', ordersRoute);
app.use('/user', userRoute);


app.use('/', (req, res, next) => {
    res.status(200).json({
        "status" : 'success',
        'messaage'  : "true",
        'page' :'Homepage',
    })
})

module.exports = app;

// const 