const Product = require("../models/productModel")




//Create product--ADMIN

exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body)

  res.status(201).json({
    success: true,
    product
  })
}


//Get all product
exports.getAllProducts = async (req, res) => {

  const products = await Product.find();

  res.status(200).json({
    success: true,
    products
  })
}

//update product
exports.updateProduct = async (req, res, next) => {

  let product = await Product.findById(req.params.id)

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found"
    })
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
}

//delete product

exports.deleteProduct = async (req, res, next) => {

  let product = await Product.findById(req.params.id)

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found"
    })
  } else {
    await product.remove()
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  })
}

//get single product
exports.getProductDetails = async (req, res, next) => {

  let product = await Product.findById(req.params.id)

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found"
    })
  }

  res.status(200).json({
    success: true,
    product
  })
}
