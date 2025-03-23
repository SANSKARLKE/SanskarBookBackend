const connectToMongo = require("./db");
require("dotenv").config();
const cors = require("cors");
connectToMongo();
const express = require("express");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const name = "sanskar";

app.use(express.json());

app.get(`/${name}`, (req, res) => {
  res.send(`this was sent by ${name} yo`);
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`);
});
