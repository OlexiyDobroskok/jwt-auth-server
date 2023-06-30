require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const logger = require("./utils/logger");
const usersRouter = require("./routes/users-router");
const { unknownEndpoint, errorHandler } = require("./utils/middleware");

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to DB was succeed");
  } catch (error) {
    logger.error(error);
  }
};

dbConnect();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/users", usersRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
