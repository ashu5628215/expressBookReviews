const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {"username": "ashu", "password": "test"}
];

const isValid = (username)=>{ //returns boolean
    return users.find(user => user.username === username && user.password === password);
}

const authenticatedUser = (username,password)=>{ //returns boolean
   let usersList = Object.values(users);
   let user = usersList.find(b => b.username==username)
  if (user) {
    // check if the provided password matches the password in our records
    if (users.password === password) {
      // username and password match, return true
      return true;
    }
  }
  // username and/or password do not match, return false
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide a valid username and password' });
  }
  const user = users.find(u => u.username === username && u.password === password);

  // Check if username and password match
  if (username === user.username && password === user.password) {
    const accessToken = jwt.sign({ username, userPassword: password }, "secretKey", { expiresIn: '1h' });

    // Store the access token in the session
    req.session.accessToken = accessToken;

    return res.status(200).json({ message: 'Login successful',accessToken });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

regd_users.get("/auth/review/", (req,res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Access token exists, verify it
  try {
    const decodedToken = jwt.verify(req.session.accessToken, "secretKey");
    const { username } = decodedToken;
    return res.status(200).json({ message: `Hello ${username}, you are authenticated to access this route.` });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.userName;

  let filtered_book = books[isbn]

  if (filtered_book) {
      if(review) {
       filtered_book['reviews'][username] = review;
          books[isbn] = filtered_book;
      }
      res.send(`The review has been added/updated by ${username}.`);
  }
  else{
      res.send("Unable to find this ISBN!");
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.userName;

    if (!isbn) {
        return res.status(400).json({ message: "Missing ISBN." });
    }
    if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
    }

    const bookReviews = books[isbn].reviews; // Get the reviews object for the book

    // Check if user has a review for this book
    if (!bookReviews || !bookReviews[username]) {
    return res.status(404).json({ message: "Review not found for this user and book." });
    }

    // Delete the review
    delete bookReviews[username]; 
    books[isbn].reviews = bookReviews

    // Send a success message
    res.send(`The review has been deleted by ${username}.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
