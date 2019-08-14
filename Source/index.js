// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-1 algorithm
var sha1 = require('sha1');

// include the mysql module
var mysql = require("mysql");
var loggedIn = false;

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "removed",
  saveUninitialized: true,
  resave: false}
));

var con = mysql.createConnection({
  host: "removed",
  user: "removed", 
  password: "removed", 
  database: "removed", 
  port: "removed"
});


var ServerPort = 9071;
app.listen(ServerPort, () => console.log('Listening on port ' + ServerPort + "!"));

// // GET method route for the favourites page.
// It serves favourites.html present in client folder
app.get('/favourites',function(req, res) {
	
	if(loggedIn){
		res.sendFile(__dirname + "/favourites.html");
	}
	else {
		res.redirect('/loginpage');
	}
});

// GET method route for the addPlace page.
// It serves addPlace.html present in client folder
app.get('/addPlace',function(req, res) {
	 // ADD DETAILS...
	 // Session not open, redirect to login
	 if(loggedIn){
	 	 res.sendFile(__dirname + "/addPlace.html");
	 }
	 else {
		res.redirect('/loginpage'); 	
	}
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/loginpage',function(req, res) {
  // ADD DETAILS...
  res.sendFile(__dirname + '/loginpage.html');
});

// GET method to return the list of favourite places
// The function queries the table tbl_places for the list of places and sends the response back to client
app.get('/getListOfFavPlaces', function(req, res) {
  // ADD DETAILS...
  var sql = `SELECT * FROM tbl_places`;
 		con.query("SELECT * FROM tbl_places", function(err, result) {
    		if(err) {
      		throw err;
    		}
			res.send(JSON.stringify(result));   
		});
});


// POST method to insert details of a new place to tbl_places table
app.post('/postPlace', function(req, res) {
  // ADD DETAILS...
  /* var sql = `CREATE TABLE tbl_places(place_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                       place_name VARCHAR(20),
                                       addr_line1 VARCHAR(35),
                                       addr_line2 VARCHAR(35),
                                       open_time TIME,
                                       close_time TIME,
                                       add_info VARCHAR(35),
                                       add_info_url VARCHAR(35))`;*/
 	var placename = req.body.placename;
 	var address1 = req.body.addressline1;
 	var address2 = req.body.addressline2;
 	var starttime = req.body.opentime;
 	var closetime = req.body.closetime;
 	var additionalinfo = req.body.additionalinfo;
 	var additionalinfourl = req.body.additionalinfourl;
 	var rowToBeInserted = {
 		place_name: placename,
 		addr_line1: address1,
 		addr_line2: address2,
 		open_time: starttime,
 		close_time: closetime,
 		add_info: additionalinfo,
 		add_info_url: additionalinfourl
 		};
 		var sql = `INSERT tbl_places SET ?`;
 		con.query(sql, rowToBeInserted, function(err, result) {
    		if(err) {
      		throw err;
    		}   	
    	});
	res.redirect("/favourites"); 
 });


// POST method to validate user login
// upon successful login, user session is created
app.post('/validateLoginDetails', function(req, res) {
  // ADD DETAILS...
  var user = req.body.userBox;
  var pw = req.body.passwordBox;
  var pwHash = sha1(pw);
  var sql = `SELECT acc_login FROM tbl_accounts`;
  var validateduser = false;
  var validatedpassword = false;
  con.query('SELECT acc_login FROM tbl_accounts', function(err, result) {
    if(err) {
      throw err;
    }
    if(result[0].acc_login == user){
		 validateduser = true;    
    }});
	con.query('SELECT acc_password FROM tbl_accounts', function(err, result) {
    if(err) {
      throw err;
    }
    console.log(result[0].acc_password);
    if(result[0].acc_password == pwHash){
		validatedpassword = true;    
    }
    	if(validatedpassword && validateduser){
    	res.redirect("/favourites");
  		req.session.value = 1;
  		loggedIn = true;
  		console.log("creating session after successful validation");
  	}
  	else {
		res.send("Failed validation");
  	}});
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  // ADD DETAILS...
  loggedIn = false;
  req.session.destroy();
  res.redirect("/loginpage");
});

// middle ware to server static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
  res.status(404).send("404 not found");
});

