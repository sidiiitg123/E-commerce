const Product = require("../models/productModel")

const ErrorHandler = require("../utils/errorHandler")

const catchAsyncErrors = require("../middleware/catchAsyncError")
const ApiFeatures = require("../utils/apiFeatures")

//Create product--ADMIN

exports.createProduct = catchAsyncErrors(
  async (req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body)

    res.status(201).json({
      success: true,
      product
    })
  }
)


//Get all product
exports.getAllProducts = catchAsyncErrors(async (req, res) => {

  const resultPerPage = 5
  const productCount = await Product.countDocuments()

  const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)
  // const products = await Product.find();
  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productCount
  })
})

//update product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

  let product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler("Product not found", 404))
  } else {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })
  }
  res.status(200).json({
    success: true,
    product
  })
})

//delete product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

  let product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler("Product not found", 404))
  } else {
    await product.remove()
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  })
})

//get single product
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {

  let product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler("Product not found", 404))
  }

  res.status(200).json({
    success: true,
    product
  })
})
