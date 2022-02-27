const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name cannot excced 30 charachter"],
    minLength: [4, "Name should have more than 4 charachter"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "PLease enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be greater than 8 charachter"],
    select: false

  },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

})

userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) {
    next()
  }

  this.password = await bcrypt.hash(this.password, 10)
})


//JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

userSchema.methods.comparePassword = async function (enteredPassword) {

  return await bcrypt.compare(enteredPassword, this.password)
}

//Generating password reset token
userSchema.methods.getResetPasswordToken = async function () {

  //generating token
  const resetToken = crypto.randomBytes(20).toString("hex")

  //Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

  return resetToken
}


module.exports = mongoose.model("user", userSchema)