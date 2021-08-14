const router = require("express").Router();
const { Category } = require("../utils/db");
const { check, validationResult } = require("express-validator");
const _p = require("../utils/promise_errors");

const categories = [
  check("name").exists(),
  check("icon").exists(),
  check("color").exists(),
];

router.post("/categories", categories, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let { name, icon, color } = req.body;
  let [ucErr, userCreated] = await _p(
    Category.create({
      name,
      icon,
      color,
    })
  );
  if (ucErr && !userCreated) {
    res.status(400).json({ error: true, message: ucErr.message });
  } else {
    res.json({ error: false, message: "User created" });
  }
});

router.get(`/categories`, async (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Category.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving .",
      });
    });
});

router.get("/categories/:id", async (req, res) => {
  const id = req.params.id;
  Category.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving  with id=" + id,
      });
    });
});

router.put("/categories/:id", async (req, res) => {
  const id = req.params.id;
  Category.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "category was updated successfully.",
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

router.delete("/categories/:id", async (req, res) => {
  const id = req.params.id;
  Category.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "category was delete successfully.",
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
