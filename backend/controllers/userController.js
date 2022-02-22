const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncError")

const User = require("../models/userMOdel")
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail.js")
const crypto = require("crypto")

exports.registeUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilepicUrl"
    }
  })
  sendToken(user, 201, res)
})

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body

  //checking if user has given password and email

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password"))

  }

  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401))
  }

  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401))
  }
  sendToken(user, 200, res)
})

exports.logout = catchAsyncErrors(async (req, res, next) => {

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: "Logged Out"
  })
})

//Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandler("User not found", 404))
  }

  //Get reset password token
  const resetToken = await user.getResetPasswordToken()
  // console.log(resetToken);

  await user.save({ validateBeforeSave: false })

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

  const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\n.If you have not requested this email then,please ignore it`

  try {
    await sendEmail({
      email: user.email,
      subject: "amazon password recovery",
      message
    })

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`
    })

  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(error.message, 500))

  }

})

//Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

  //creating token hash
  const resetPasswordToken = crypto.createHash("sha256").update(
    req.params.token
  ).digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })


  if (!user) {
    return next(new ErrorHandler("Reset Password token is invalid or expired!!", 400))
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 400))
  }
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  sendToken(user, 200, res)

})