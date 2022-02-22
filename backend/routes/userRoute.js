const express = require("express")
const { registeUser, loginUser, logout, forgotPassword, resetPassword } = require("../controllers/userController")
const router = express.Router()

router.route("/register").post(registeUser)
router.route("/login").post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logout)

module.exports = router 