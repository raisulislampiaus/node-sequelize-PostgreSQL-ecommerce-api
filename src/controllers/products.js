const router = require("express").Router();
const { Products } = require("../utils/db");
const { check, validationResult } = require("express-validator");
const _p = require("../utils/promise_errors");
const multer = require("multer");
const path = require("path");

const products = [
  check("name").exists(),
  check("brand").exists(),
  check("image").exists(),
  check("price").exists(),
  check("description").exists(),
  check("reviews").exists(),
  check("category_id").exists(),
];

router.post("/products", products, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let { name, brand, description, price, reviews, category_id, image } =
    req.body;
  let [ucErr, userCreated] = await _p(
    Products.create({
      name,
      brand,
      image,
      description,
      price,
      reviews,
      category_id,
    })
  );
  if (ucErr && !userCreated) {
    res.status(400).json({ error: true, message: ucErr.message });
  } else {
    res.json({ error: false, message: "User created" });
  }
});

router.get(`/products`, async (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Products.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving .",
      });
    });
});

router.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  Products.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving  with id=" + id,
      });
    });
});

router.put("/products/:id", async (req, res) => {
  const id = req.params.id;
  Products.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Products was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update  with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating  with id=" + id,
      });
    });
});

router.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  Products.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Products was delete successfully.",
        });
      } else {
        res.send({
          message: `Cannot delete  with id=${id}. Maybe  was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error delete  with id=" + id,
      });
    });
});
module.exports = router;
