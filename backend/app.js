const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./middleware/error")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")

app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: true }))

//Route imports

const product = require("./routes/productRoute")

const user = require("./routes/userRoute")
const order = require("./routes/orderRoute")

app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", order)

app.use(errorMiddleware)

module.exports = app