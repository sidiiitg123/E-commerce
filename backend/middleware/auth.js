const ErrorHandler = require("../utils/errorHandler")
const jwt = require("jsonwebtoken")
const User = require("../models/userMOdel")
const catchAsyncErrors = require("./catchAsyncError")


isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401))
  }

  const decodeData = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decodeData.id)

  next()

  // console.log(token)
})

authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(
        `Role: ${req.user.role} is not allowed to access resource`
      ,))
    }
    next()
  }
}

module.exports = { isAuthenticatedUser, authorizeRoles }