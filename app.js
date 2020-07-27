const express = require("express");
const mongoose = require("mongoose");
const router = require("./router");
const cors = require("cors");

const app = express();

mongoose.connect("mongodb://localhost:27017/TodoApi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
// mongoose.set("debug", true);
mongoose.connection.on("error", e => {
  console.error(`MongoDB error: ${e}`);
  process.exit(1);
});

app.use(
  cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    credentials: true
  })
);
app.set('trust proxy', 'loopback');

app.use("/", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server start on port: ${PORT}`);
});
