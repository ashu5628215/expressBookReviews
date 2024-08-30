const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || username.length < 1 || !password || password.length < 1) { 
    return res.status(400).json({ message: "Invalid input: Username or password." });
  }

  let eUser = users.filter((user)=>(user.username === username && user.password===password));
  if (eUser.length > 0) {
    return res.status(409).json({message: "User already exists."}) 
  }
    
  users.push({"username": username, "password":password})
  return res.status(200).json({message: "Customer registered succesfully. Now you can login!!"})

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const fetchBooksPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books); // Resolve with the books data
        }, 500); // Simulate a 500ms delay 
      });
    
      fetchBooksPromise
        .then(booksData => {
          res.json(booksData); // Send books as JSON on success
        })
        .catch(error => {
          res.status(500).json({ message: "Error fetching books" }); // Handle errors
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    const fetchBookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject({ message: "Book not found with this ISBN." });
            }
        }, 500); // Simulating a 500ms delay 
    });
  
    fetchBookPromise
        .then(book => {
            res.json(book); 
        })
        .catch(error => {
            res.status(404).json(error); 
        });
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const reqUser = req.params.author.toLowerCase();
  const fetchBookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        let resBooks = [];
        for (const isbn of Object.keys(books)) {
            if (books[isbn].author.toLowerCase() === reqUser) {
                resBooks.push({
                    "isbn": isbn,
                    "title": books[isbn].title,
                    "author": books[isbn].author });
            }
        }
        if (resBooks.length > 0 ) {
            resolve(resBooks);
        } else {
            reject({message: "No books found."});
        }
    }, 500);
  });
  fetchBookPromise
  .then(books => {
      res.json(books); 
  })
  .catch(error => {
      res.status(404).json(error); 
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const reqTitle = req.params.title.toLowerCase();
  const fetchBookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        let resBooks = [];
        for (const isbn of Object.keys(books)) {
            if (books[isbn].title.toLowerCase() === reqTitle) {
                resBooks.push({
                    "isbn": isbn,
                    "title": books[isbn].title,
                    "author": books[isbn].author });
            }
        }
        if (resBooks.length > 0 ) {
            resolve(resBooks);
        } else {
            reject({message: "No books found."});
        }
    }, 500);
  });
  fetchBookPromise
  .then(books => {
      res.json(books); 
  })
  .catch(error => {
      res.status(404).json(error); 
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const fetchBookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn].reviews);
            } else {
                reject({ message: "Book not found with this ISBN." });
            }
        }, 500);  
    });
    fetchBookPromise
    .then(reviews => {
        res.json(reviews); 
    })
    .catch(error => {
        res.status(404).json(error); 
    });

});

module.exports.general = public_users;
