const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } 
  return false;
};

async function getBookByISBN(isbn) {
  let bookWithISBN = books[isbn];	
  if (bookWithISBN) {
	  return bookWithISBN
  }
  return error;
};

async function getBooksByTitle(title) {
  const titleKeys = Object.keys(books);
  let booksByTitle = [];
  titleKeys.forEach(key => {
	  if (books[key].title === title) {
		  booksByTitle.push(books[key]);
	  }
  });
  if (booksByTitle.length > 0) {
  	  return booksByTitle;
  }
  return error;
};

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});    
    }
  } else {
	  if (!username || !password) {
		  return res.status(400).json({message: "Username and/or password not provided. You can't register"});		  
	  }
  }
  return res.status(500).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop - Promise version
public_users.get('/', function(req, res) {
  //Write your code here
  let allBooksPromise = new Promise((resolve, reject) => {
	let bookList = JSON.stringify(books, null, 4);
	if (bookList) {
		resolve(bookList);
	} else
	reject("Cannot get book list");
  });
  allBooksPromise.then(successMessage => res.status(200).json(successMessage)).catch(errorMessage => res.status(404).json({message: errorMessage}));
  //return res.status(300).json({message: "Yet to be implemented"});
});

/*
// Get the book list available in the shop - sync version
public_users.get('/', function(req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});
});
*/

// Get book details based on ISBN - async-await version
public_users.get('/isbn/:isbn', async function(req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  try {
  	let bookWithISBN = await getBookByISBN(isbn);	
	return res.status(200).json(bookWithISBN);
  } catch (error) {
	return res.status(404).json({message: `Cannot find book with ISBN ${isbn}`});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });

// Get book details based on ISBN - sync version
/*
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
*/
  
// Get book details based on author - Promise version
public_users.get('/author/:author', function(req, res) {
  //Write your code here
  const author = req.params.author;
  let booksByAuthorPromise = new Promise((resolve, reject) => {
    const authorKeys = Object.keys(books);
    let booksByAuthor = [];
    authorKeys.forEach(key => {
      if (books[key].author === author) {
	    booksByAuthor.push(books[key]);
      }
    });
    if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
    }
    reject(`Cannot find books by author ${author}`);
  });
  booksByAuthorPromise.then(successMessage => res.status(200).json(successMessage)).catch(errorMessage => res.status(404).json({message: errorMessage}));
  //return res.status(300).json({message: "Yet to be implemented"});
});

/*
// Get book details based on author - sync version
public_users.get('/author/:author', function(req, res) {
  //Write your code here
  const author = req.params.author;
  const authorKeys = Object.keys(books);
  let booksByAuthor = [];
  authorKeys.forEach(key => {
	  if (books[key].author === author) {
		  booksByAuthor.push(books[key]);
	  }
  });
  if (booksByAuthor.length > 0) {
	  return res.send(booksByAuhtor);
  } else {
 	  return res.send(`Cannot find books by author ${author}`);
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});
*/

// Get all books based on title - async-await version
public_users.get('/title/:title', async function(req, res) {
  //Write your code here
  const title = req.params.title;
  try {
  	let booksByTitle = await getBooksByTitle(title);	
	return res.status(200).json(booksByTitle);
  } catch (error) {
 	return res.status(404).json({message:`Cannot find books titled ${title}`});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

/*
// Get all books based on title - sync version
public_users.get('/title/:title', function(req, res) {
  //Write your code here
  const title = req.params.title;
  const titleKeys = Object.keys(books);
  let booksByTitle = [];
  titleKeys.forEach(key => {
	  if (books[key].title === title) {
		  booksByTitle.push(books[key]);
	  }
  });
  if (booksByTitle.length > 0) {
	  return res.send(booksByTitle);
  } else {
 	  return res.send(`Cannot find books titled ${title}`);
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});
*/

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookWithISBN = books[isbn];
  if (bookWithISBN) {
	const reviews = bookWithISBN.reviews;
  	if (reviews) {
		return res.status(200).json(reviews);
  	} else {
		return res.status(404).json({message: `Cannot find review for the book with ISBN ${isbn}`});
  	}
  } else {
	return res.status(404).json({message: `Cannot find book with ISBN ${isbn}`});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
