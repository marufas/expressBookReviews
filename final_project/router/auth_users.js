const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  for (const user of users) {
    if (user.username === username)
      return false
  }
  return true
}

const authenticatedUser = (username, password) => { //returns boolean
  for (const user of users) {
    if (user.username === username && user.password === password)
      return true
  }
  return false
}

regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).send(JSON.stringify({ message: `User ${username} created successfully!` }))
    } else {
      return res.status(404).send(JSON.stringify({ message: `User ${username} already exists!` }))
    }
  }
  return res.status(404).send(JSON.stringify({ message: `Valid username and password not provided.` }))
})

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send(JSON.stringify({ message: "Username or password missing" }));
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send(JSON.stringify({ message: `User ${username} successfully logged in` }));
  } else {
    return res.status(208).send(JSON.stringify({ message: "Invalid login, check username and password" }));
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;
  let book = books[isbn];
  const username = req.user.data
  if (book) {
    book.reviews[username] = review
    return res.status(200).send(JSON.stringify({ message: "Review added successfully!" }, null, 4));
  } else
    return res.status(404).send(JSON.stringify({ message: "Book not found!" }, null, 4));
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];
  const username = req.user.data
  if (book) {
    if (book.reviews[username] != undefined) {
      delete book.reviews[username]
      return res.status(200).send(JSON.stringify({ message: "Review deleted successfully!" }, null, 4));
    }
    return res.status(404).send(JSON.stringify({ message: "Review not found" }, null, 4));
  } else
    return res.status(404).send(JSON.stringify({ message: "Book not found!" }, null, 4));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
