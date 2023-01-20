require("express-async-errors");
require("dotenv").config();

// extra security packages
const rateLimiter = require("express-rate-limit");

const { json } = require("express");
const express = require("express");
const app = express();
const auth = require("./middlewares/authentication");

// NOT FOUND MIDDLEWARE
const notFoundMiddleware = require("./middlewares/not-found");
// middleware
app.use(json());

// routes
const authRouter = require("./routes/auth");
const noteRouter = require("./routes/note");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/note", auth, noteRouter);
app.use(notFoundMiddleware);

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
);

// server
const port = process.env.PORT || 5000;
const connectDB = require("./db/connect");
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
