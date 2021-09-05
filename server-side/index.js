const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const errorhandler = require("errorhandler");
const morgan = require("morgan");
const passport = require("passport");
const db = require("./services/db.Service");
const authRouter = require("./controllers/Auth.Controller");
const taskRouter = require("./controllers/Task.Controller");
const passportConfig = require("./middleware/Auth.Middleware");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "*",
    credentials: false,
  }),
);

app.use(passport.initialize());

app.use(errorhandler());

app.use(morgan("dev"));

app.use(express.json());
app.use(passport.session());

db.connectToDB();

app.use("/auth", authRouter);
app.use("/tasks", taskRouter);

app.listen(PORT, () => {
  console.log(`Server up and run on port: ${PORT}`);
});
