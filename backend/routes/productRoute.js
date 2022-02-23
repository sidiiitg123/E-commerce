const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllProductReviews, deleteProductReview } = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")

const router = express.Router();

router.route("/products").get(getAllProducts)


router.route("/admin/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)

router.route("/admin/products/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)

router.route("/admin/products/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)

router.route("/products/:id").get(getProductDetails)

router.route("/review").put(isAuthenticatedUser, createProductReview)

router.route("/review").get(getAllProductReviews)

router.route("/review").delete(isAuthenticatedUser, deleteProductReview)


module.exports = router