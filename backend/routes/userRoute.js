const express = require("express")
const { registeUser, loginUser } = require("../controllers/userController")
const router = express.Router()

router.route("/register").post(registeUser)
router.route("/login").post(loginUser)

module.exports = router 