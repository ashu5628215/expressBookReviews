const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const reqIsbn = req.params.isbn;
    if (books[reqIsbn]) {
        res.send(JSON.stringify(books[reqIsbn]));
    } else {
        res.status(404).json({message: "Book not found"});
    }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const reqUser = req.params.author.toLowerCase();
  let resBooks = [];
  for (const isbn of Object.keys(books)) {
    if (books[isbn].author.toLowerCase() === reqUser) {
        resBooks.push({
            "isbn": isbn,
            "title": books[isbn].title,
            "author": books[isbn].author });
    }
  }
  if (resBooks.length > 0) {
    res.send({"booksbyauthor": resBooks});
  } else {
    res.status(404).json({message: "No Book found for author: " + reqUser});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const reqTitle = req.params.title.toLowerCase();
  let resBooks = [];
  for (const isbn of Object.keys(books)) {
    if (books[isbn].title.toLowerCase() === reqTitle) {
        resBooks.push({
            "isbn": isbn,
            "title": books[isbn].title,
            "author": books[isbn].author });
    }
  }
  if (resBooks.length > 0) {
    res.send({"booksbytitle": resBooks});
  } else {
    res.status(404).json({message: "No Book found for title: " + reqTitle});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const reqIsbn = req.params.isbn;
    if (books[reqIsbn]) {
        res.send(books[reqIsbn].reviews);
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
