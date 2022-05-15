import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import authRoute from "./routes/auth.js";
import hotelRoute from "./routes/hotels.js";
import usersRoute from "./routes/users.js";
import roomRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

// MIDDLEWARES
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/hotels", hotelRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/rooms", roomRoute);

// ERROR HANDLING
app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: error.stack,
  });
});

// DB CONNECTION
const { MONGODB_URI } = process.env;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("CONNECTED TO DB!"))
  .catch((error) => {
    console.log("DB NOT CONNECTED. EXITING NOW");
    console.log(error);
    process.exit(1);
  });

mongoose.connection.on("disconnected", () => {
  console.log("MONGODB DISCONNECTED!");
});

//   SERVER CONNECTION
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`BACKEND RUNNING ON PORT ${port}`);
});
