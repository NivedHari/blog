document.addEventListener("DOMContentLoaded", function () {
  loadBlogs();
});

function loadBlogs() {
  fetch("http://localhost:8000/api/blogs")
    .then((res) => res.json())
    .then((data) => {
      data.blogs.forEach((blog) => {
        addBlogToList(blog);
        fetchCommentsForBlog(blog.id);
      });
    })
    .catch((err) => console.error(err));
}

function addBlogToList(blog) {
  var li = document.createElement("li");
  li.classList.add("blogItem");
  var title = document.createElement("h3");
  title.textContent = blog.title;
  li.appendChild(title);

  var expandButton = document.createElement("button");
  expandButton.className = 'expandBtn';
  expandButton.textContent = "+";
  li.appendChild(expandButton);

  var author = document.createElement("p");
  author.textContent = `Author: ${blog.author}`;
  author.style.display = "none";
  li.appendChild(author);

  var content = document.createElement("p");
  content.textContent = blog.content;
  content.style.display = "none";
  li.appendChild(content);
  li.id = `blog-${blog.id}`;

  var commentForm = document.createElement("form");
  var commentInput = document.createElement("input");
  var commentButton = document.createElement("button");
  commentInput.type = "text";
  commentInput.placeholder = "Add a comment";
  commentButton.type = "submit";
  commentButton.textContent = "Comment";
  commentForm.appendChild(commentInput);
  commentForm.appendChild(commentButton);
  commentForm.style.display = "none";

  li.appendChild(commentForm);

  expandButton.addEventListener("click", function () {
    if (content.style.display === "none") {
      content.style.display = "block";
      author.style.display = "block";
      expandButton.textContent = "-";
      commentForm.style.display = "block";
      commentList.style.display = "block";
      fetchCommentsForBlog(blog.id);
    } else {
      content.style.display = "none";
      author.style.display = "none";
      expandButton.textContent = "+";
      commentForm.style.display = "none";
      commentList.style.display = "none";
    }
  });

  li.id = `blog-${blog.id}`;
  document.getElementById("blogList").appendChild(li);

  commentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var comment = commentInput.value;
    var blogId = blog.id;

    var commentData = {
      comment,
      blogId,
    };

    fetch("http://localhost:8000/api/comments", {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        addCommentToList(data.comment, blogId);
        commentInput.value = "";
      })
      .catch((err) => console.error(err));
  });
}
function addCommentToList(comment, blogId) {
  var blogItem = document.getElementById(`blog-${blogId}`);
  if (blogItem) {
    var commentLi = document.createElement("li");
    commentLi.textContent = comment.content;

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = 'btnDelete';
    deleteButton.addEventListener("click", function () {
      deleteComment(comment.id);
      commentLi.remove();
    });

    commentLi.appendChild(deleteButton);
    var commentForm = blogItem.querySelector("form"); 
    var displayStyle = commentForm.style.display;
    commentLi.style.display = displayStyle;
    blogItem.appendChild(commentLi);

    var expandButton = blogItem.querySelector("button");
    expandButton.addEventListener("click", function () {
      if (commentLi.style.display === "none") {
        commentLi.style.display = "block";
      } else {
        commentLi.style.display = "none";
      }
    });
  }
}
function deleteComment(commentId) {
  fetch(`http://localhost:8000/api/comments/${commentId}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        console.log("Comment deleted");
      } else {
        console.error("Failed to delete");
      }
    })
    .catch((err) => console.error(err));
}

function fetchCommentsForBlog(blogId) {
  fetch(`http://localhost:8000/api/comments/${blogId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.comments) {
        data.comments.forEach((comment) => {
          addCommentToList(comment, blogId);
        });
      }
    })
    .catch((err) => console.error(err));
}

document
  .getElementById("blogForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var title = document.getElementById("blogTitle").value;
    var author = document.getElementById("blogAuthor").value;
    var content = document.getElementById("blogContent").value;

    var blog = {
      title,
      author,
      content,
    };

    fetch("http://localhost:8000/api/blogs", {
      method: "POST",
      body: JSON.stringify(blog),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        addBlogToList(data.blog);
        document.getElementById("blogForm").reset();
      })
      .catch((err) => console.error(err));
  });
