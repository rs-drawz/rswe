const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            // require:true
        },
        country: {
            type: String,
            // required:true
        },
        quantity: {
            type: String,
            // require: true
        },
        city: {
            type: String,
            // required:true
        },
        phoneNo: {
            type: String,
            // required:true
        },
        postalCode: {
            type: String,
            // required:true
        }
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        // required:true,
        ref: 'User'
    },
    orderItems: [{
        name: {
            type: String,
            // required:true
        },
        quantity: {
            type: String,
            // required:true
        },
        image: {
            type: String,
            // required:true
        },
        price: {
            type: Number,
            // required:true
        },
        product: {
            type: mongoose.SchemaTypes.ObjectId,
            // required:true,
            ref: 'Product'
        }
    }],
    itemPrice: {
        type: Number,
        // required:true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        // required:true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        // required:true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        // required:true,
        default: 0.0
    },
    paidAt: {
        type: Date
    },
    delliveriedAt: {
        type: Date,
    },
    orderStatus: {
        type: String,
        // required:true,
        default: 'processing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

let orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel; 