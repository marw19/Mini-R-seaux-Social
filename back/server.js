require("./config/db");
require("dotenv").config();

const express = require("express");
const rateLimit = require("express-rate-limit");
const auth_router = require("./routes/authentication");
const user_router = require("./routes/users");
const forget_passowrd = require("./routes/forgetPassword");
const roleRouter = require("./routes/role");
const postRouter = require("./routes/posts");

const port = process.env.PORT || process.env.port;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(
  cors({
    origin: process.env.urlCors,
  })
);

// number query by minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use("/api/authentication", auth_router);
app.use("/api/users", user_router);
app.use("/api/forget-password", forget_passowrd);
app.use("/api/roles", roleRouter);
app.use("/api/posts", postRouter);

app.listen(port, () => console.log(`Server on ${port}...`));
