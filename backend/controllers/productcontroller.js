const Product = require('../models/productsModel');
const bs = require('body-parser');
const ErrorHandler = require('../seeder/errorHandler')
const catchasyncError = require('../middleware/catchasyncError')
const APIfeature = require('../seeder/apifeatures');
const { errorMonitor } = require('nodemailer/lib/xoauth2');

exports.getProducts = catchasyncError(async (req, res, next) => {
  try {
    // Query the database to retrieve all products
    let countperpage = 4;
    // const apifeat = new APIfeature(Product.find(), req.query).search().filter().page(countperpage);

    let buildQuery = () => {
      return new APIfeature(Product.find(), req.query).search().filter()
    }
    // const products = await apifeat.query;
    const filteredProductsount = await buildQuery().query.countDocuments({})
    const totalProductsCount = await Product.countDocuments({})
    let productsCount = totalProductsCount

    if (filteredProductsount !== totalProductsCount) {
      productsCount = filteredProductsount
    }
    const products = await buildQuery().page(countperpage).query;
    // await new Promise(resolve => setTimeout(resolve, 1000))

    // return next(new ErrorHandler('Unable to show the products due to some issues'));
    res.status(200).json({
      products,
      count: productsCount,
      countperpage

    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
// create Product-/api/v1/product/new
exports.newProduct = catchasyncError(
  async (req, res, next) => {
    const p = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      ratings: req.body.ratings,
      Artist: req.body.Artist,
      stock: req.body.stock,
      quantity:req.body.quantity,
      user: req.user.id,
      createdAt: req.body.createdAt
    });
    const d = await p.save();
    res.status(201).json({
      success: "sucessfully added in database!",
      d

    })
  }
)

exports.getSingleprod = async (req, res, next) => {
  const prod = await Product.findById(req.params.id);
  if (!prod) {
    return next(new ErrorHandler('The product you searched,is not found', 400));
  }
  // await new Promise(resolve=>setTimeout(resolve,1000))
  res.status(200).json({
    success: true,
    prod
  })
}

exports.updateprod = async (req, res, next) => {
  try {
    const prod = await Product.findById(req.params.id);

    if (!prod) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Update the product
    const updatedProd = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Returns the updated product
        runValidators: true, // Run validation on the updated data
      }
    );

    res.status(200).json(updatedProd);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteprod = async (req, res, next) => {
  try {
    const prod = await Product.findById(req.params.id);

    if (!prod) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Delete the product
    await Product.findByIdAndRemove(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//review - api/v1/review
exports.revieworder = catchasyncError(async (req, res, next) => {
  const { productId, rating, coment } = req.body;

  const review = {
    user: req.user.id,
    rating,
    coment
  }

  const product = await Product.findById(productId);
  const isRevived = product.reviews.find(review => {
    return review.user.toString() == req.user.id.toString()
  })

  //finding user alreafy  reviewed
  if (isRevived) {
    //updating
    product.reviews.forEach(review => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = coment
        review.rating = rating
      }
    })


  }
  else {
    //creating new review
    product.reviews.push(review);
    product.numofReviews = product.reviews.length;
  }
  //to provide average rating of an product
  product.ratings = product.reviews.reduce((acc, review) => {
    return review.rating + acc;
  }, 0) / product.reviews.length;
  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    sucess: true
  })

})





