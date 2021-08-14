const express = require("express");
const bp = require("body-parser");
const signup = require("./controllers/signup.js");
const login = require("./controllers/login.js");
const categories = require("./controllers/categories");
const products = require("./controllers/products");
const app = express();

app.use(bp.json());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(signup);
app.use(login);
app.use(categories);
app.use(products);

const __port = process.env.PORT || 5000;
app.listen(__port, () => {
  console.log(`application port:${__port}`);
});
