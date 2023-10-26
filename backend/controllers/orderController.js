const catchasyncError = require("../middleware/catchasyncError");
const Order = require('../models/orderModel');
const ErrorHandler = require("../seeder/errorHandler");
const Product = require("../models/productsModel")

//create New Order - api/v1/order/new
exports.newOrder = catchasyncError(async (req, res, next) => {
    const {
        orderItems,
        ShippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;


    const order = await Order.create({
        orderItems,
        ShippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
})

//getsingleproduct - api/v1/order/:id
exports.getsingleprod = catchasyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) {
        return next(new ErrorHandler(`Order not fount with this id:${req.params.id}`, 404))
    }
    res.status(200).json({
        sucess: true,
        order
    })
})

//get logginUser order - /api/v1/myorder
exports.getloginuserorder = catchasyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json({
        sucess: true,
        orders
    })
})

//getallorders - /api/v1/all-orders
exports.allorders = catchasyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totamnt = 0;

    orders.forEach(element => {
        totamnt += element.totalPrice;
    });

    res.status(200).json({
        sucess: true,
        totamnt,
        orders
    })
})

//order-current-status - /api/v1/order/:id
exports.updatecurrentorder = catchasyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (order.orderStatus == 'Delivered') {
        return next(new ErrorHandler(`order already delivered,id:${req.params.id} `, 400))
    }

    order.orderItems.forEach(async i => {
        await updatestock(i.product, i.quantity)
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        sucess: true
    })
});

//updating product stoc of each order item
async function updatestock(productId, quantity) {
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({ validateBeforeSave: false })
}

//admin-delete order -api/v1/order/:id
exports.deleteorder = catchasyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler(`Order not fount with this id:${req.params.id}`, 404))
    }

    await Order.deleteOne({ _id: req.params.id });
    
    res.status(200).json({
        sucess: true
    })

})


