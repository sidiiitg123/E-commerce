const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncError")

const User = require("../models/userMOdel")
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail.js")
const crypto = require("crypto")
const cloudinary = require("cloudinary")

exports.registeUser = catchAsyncErrors(async (req, res, next) => {

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale"
  })
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
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

//Get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user
  })
})

//update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password")

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400))
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password doesn't match", 400))
  }
  user.password = req.body.newPassword

  await user.save()


  sendToken(user, 200, res)
})

//update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email
  }

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id)
    const imageId = user.avatar.public_id
    await cloudinary.v2.uploader.destroy(imageId)

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale"
    })
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    }

  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true
  })
})

//get all users(admin)
exports.getUsersDetails = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })
})


//Get single user details(admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    user
  })
})


//update user role(admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400))
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully"
  })
})

//delete single user(admin)
exports.deleteSingleUser = catchAsyncErrors(async (req, res, next) => {

  const user = await User.find({ _id: req.params.id })

  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400))
  }
  //we will remove cloudinary later
  await User.remove({ _id: req.params.id })

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  })
})