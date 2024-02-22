const Blog = require("../models/blog");
const Comment = require("../models/comment");

exports.postBlog = (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const content = req.body.content;

  Blog.create({
    title: title,
    author: author,
    content: content,
  })
    .then((blog) => {
      console.log(blog);
      return res.status(200).json({ blog: blog });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getBlog = (req, res, next) => {
  Blog.findAll().then((blogs) => {
    return res.json({ blogs: blogs });
  });
};

exports.postComment = (req, res, next) => {
  const blogId = req.body.blogId;
  const content = req.body.comment;

  Blog.findByPk(blogId)
    .then((blog) => {
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      return Comment.create({
        blogId,
        content,
      });
    })
    .then((comment) => {
      res.status(201).json({ comment });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getComment = (req, res, next) => {
  const blogId = req.params.blogId;
  Comment.findAll({ where: { blogId: blogId } })
    .then((comments) => {
      return res.json({ comments });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.commentId;
  Comment.findByPk(commentId).then((comment) => {
    return comment.destroy();
  }).then(() => {
    res.status(204).end(); 
  }).catch((err) => {
    console.error(err);
  });
};
