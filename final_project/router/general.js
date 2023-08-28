const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book)
    return res.status(200).send(JSON.stringify({ [isbn]: book }, null, 4));
  else
    return res.status(200).send({})
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  let filteredBooks = {}
  for (const [isbn, book] of Object.entries(books)) {
    if (book.author === author) {
      filteredBooks[isbn] = book;
    }
  }
  return res.status(200).send(JSON.stringify(filteredBooks, null, 4))
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  let filteredBooks = {}
  for (const [isbn, book] of Object.entries(books)) {
    if (book.title === title) {
      filteredBooks[isbn] = book;
    }
  }
  return res.status(200).send(JSON.stringify(filteredBooks, null, 4))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book)
    return res.status(200).send(JSON.stringify({ reviews: book.reviews }, null, 4));
  else
    return res.status(200).send({})
});

module.exports.general = public_users;
