const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Blog = sequelize.define('blogs',{
    title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
})

module.exports = Blog;