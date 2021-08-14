const Sequelize = require("sequelize");

const CONNECTION_STRING =
  process.env.DATABASE || "postgres://postgres:piaus123@localhost:5432/test";
const db = new Sequelize(CONNECTION_STRING);

const User = db.define("users", {
  name: Sequelize.TEXT,
  email: {
    type: Sequelize.TEXT,
    unique: true,
  },
  password: Sequelize.TEXT,
});

const Category = db.define("category", {
  name: Sequelize.TEXT,
  icon: Sequelize.TEXT,
  color: Sequelize.TEXT,
});

const Products = db.define("products", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  brand: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  reviews: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

db.sync()
  .then((e) => {
    console.log(`Database Synced`);
  })
  .catch((e) => console.log(e.message));

module.exports = {
  db,
  User,
  Category,
  Products,
};
