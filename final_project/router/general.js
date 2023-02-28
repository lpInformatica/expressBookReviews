const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } else {
	  if (!username || !password) {
		  return res.status(404).json({message: "Username and/or password not provided. You can't register"});		  
	  }
  }
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let bookWithISBN = books[isbn];	
  if (bookWithISBN) {
	return res.send(bookWithISBN);
  } else {
	return res.send(`Cannot find book with ISBN ${isbn}`);
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  const authorKeys = Object.keys(books);
  let authorFound = [];
  authorKeys.forEach(key => {
	  if (books[key].author === author) {
		  authorFound.push(books[key]);
	  }
  });
  if (authorFound.length > 0) {
	  return res.send(authorFound);
  } else {
 	  return res.send(`Cannot find books by author ${author}`);
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titleKeys = Object.keys(books);
  let titleFound = [];
  titleKeys.forEach(key => {
	  if (books[key].title === title) {
		  titleFound.push(books[key]);
	  }
  });
  if (titleFound.length > 0) {
	  return res.send(titleFound);
  } else {
 	  return res.send(`Cannot find books titled ${title}`);
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookWithISBN = books[isbn];
  if (bookWithISBN) {
	const reviews = bookWithISBN.reviews;
  	if (reviews) {
		return res.send(reviews);
  	} else {
		return res.send(`Cannot find review for the book with ISBN ${isbn}`);
  	}
  } else {
	return res.send(`Cannot find book with ISBN ${isbn}`);
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
