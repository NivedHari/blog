const express = require("express");
const cors = require("cors");

const sequelize = require("./utils/database");

const BlogController = require('./controllers/blog');

const Blog = require("../backend/models/blog");
const Comment = require("./models/comment");

const app = express();

const PORT = 8000;
app.use(cors());

app.use(express.json());

app.post("/api/blogs", BlogController.postBlog);
app.get("/api/blogs", BlogController.getBlog);
app.post('/api/comments',BlogController.postComment);
app.get('/api/comments/:blogId',BlogController.getComment);
app.delete('/api/comments/:commentId',BlogController.deleteComment);

Blog.hasMany(Comment);
Comment.belongsTo(Blog);

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", PORT);
    });
  })
  .catch((err) => console.log(err));
