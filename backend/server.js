const app = require("./app")

const dotenv = require("dotenv")
const connectDatabase = require("./config/database")

//handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to the uncaught Exception`);


  process.exit(1)
})

//Config

dotenv.config({ path: "backend/config/config.env" })

connectDatabase()

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
})


//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to the unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1)
  })
})