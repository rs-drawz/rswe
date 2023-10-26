const express = require('express');
const { newOrder, getsingleprod, getloginuserorder, allorders, updatecurrentorder, deleteorder } = require('../controllers/orderController');
const router = express.Router();
const { isAuthenticateUser, authorzerole } = require('../middleware/authentiacte-route')

router.route('/order/new').post(isAuthenticateUser, newOrder);
router.route('/order/:id').get(isAuthenticateUser, getsingleprod);
router.route('/myorders').get(isAuthenticateUser, getloginuserorder);

//admin
router.route('/my-all-orders').get(isAuthenticateUser, authorzerole('admin'), allorders);
router.route('/my-order/:id').put(isAuthenticateUser, authorzerole('admin'), updatecurrentorder)
                            .delete(isAuthenticateUser, authorzerole('admin'),deleteorder );

module.exports = router;