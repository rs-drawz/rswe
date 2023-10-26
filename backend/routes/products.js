const express = require('express')
const { getProducts, newProduct, getSingleprod, updateprod, deleteprod, revieworder } = require('../controllers/productcontroller')
const router = express.Router();
const { isAuthenticateUser,authorzerole } = require('../middleware/authentiacte-route')

router.route('/products').get(getProducts)
router.route('/product/new').post(isAuthenticateUser,authorzerole('admin','artist'),newProduct)
router.route('/product/:id').get(getSingleprod)
router.route('/product/update/:id').post(isAuthenticateUser,authorzerole('admin','artist'),updateprod),
router.route('/product/delete/:id').delete(isAuthenticateUser,authorzerole('admin','artist'),deleteprod),
router.route('/review').post(isAuthenticateUser,authorzerole('admin','artist'),revieworder)


module.exports = router  