const express = require("express")
const { registeUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getUsersDetails, getSingleUser, updateUserRole, deleteSingleUser } = require("../controllers/userController")
const router = express.Router()
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")

router.route("/register").post(registeUser)
router.route("/login").post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logout)

router.route("/me").get(isAuthenticatedUser, getUserDetails)
router.route("/password/update").put(isAuthenticatedUser, updatePassword)
router.route("/me/update").put(isAuthenticatedUser, updateProfile)

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getUsersDetails)
router.route("/admin/users/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)

router.route("/admin/users/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
router.route("/admin/users/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteSingleUser)


module.exports = router 