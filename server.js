var path = require('path');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var items;
var page;
var fs = require('fs');

items = fs.readFileSync("data.json", "utf8");

//console.log(items);
var itemsParsed = JSON.parse(items);
//console.log(itemsParsed);
fs.readFile("index.html", "utf8", 
            function(error,data){
                if(error) throw error; // если возникла ошибка
            	page = data;
});

app.get('/', function (req, res) {
  res.send(page);
});
app.post('/', function (req, res) {
	//console.log("post");
  res.json(items);
});

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());
app.post("/addinterval", urlencodedParser, function (request, response) {
	if(!request.body) return response.sendStatus(400);
	var users;
	users = fs.readFileSync("users.json", "utf8");
	users = JSON.parse(users);
	users.forEach(function(item, i, arr) {
		if(item.content === request.body.username){
			users[i].intervals.push(request.body.interval);
		}
	});
	fs.writeFileSync("users.json", JSON.stringify(users, "", 4));
	response.send("");
});
app.post("/deleteinterval", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    var users;
	users = fs.readFileSync("users.json", "utf8");
	users = JSON.parse(users);
	users.forEach(function(item, i, arr) {
		if(item.content === request.body.username){
			item.intervals.forEach(function(itemI, j, arrr) {
				if(itemI.start === request.body.interval.start && itemI.end === request.body.interval.end) {
					users[i].intervals.splice(j, 1);
				}
			});
		}
            
          });
	fs.writeFileSync("users.json", JSON.stringify(users, "", 4));
	response.send("");
});
app.post("/adduser", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    var users;
	users = fs.readFileSync("users.json", "utf8");
	users = JSON.parse(users);
	var userObject = {group:(users.length+1),content:request.body.username, intervals:[]};
	users.push(userObject);
	fs.writeFileSync("users.json", JSON.stringify(users, "", 4));
	response.send("");
});
app.post("/deleteuser", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    //console.log(request.body);
    var users;
	users = fs.readFileSync("users.json", "utf8");
	users = JSON.parse(users);
	users.forEach(function(item, i, arr) {
		if(item.content === request.body.username){
			//console.log("Found!")
			users.splice(i, 1);
		}
            
          });
	fs.writeFileSync("users.json", JSON.stringify(users, "", 4));
	response.send("");
});



app.get('/users', function (req, res) {
	var users;
	users = fs.readFileSync("users.json", "utf8");
	res.send(JSON.parse(users));
});
app.get('/intervals', function (req, res) {
	var jtmp;
	var users;
	users = fs.readFileSync("users.json", "utf8");
	users = JSON.parse(users);
	users.forEach(function(item, i, arr) {
		if(item.content === req.query.name){
			//console.log("Found!")
			jtmp = item.intervals;			
		}            
          });
	//console.log(jtmp);
	res.send(jtmp);

});



app.get('/items', function (req, res) {
  res.send(itemsParsed);
});

app.listen(process.env.PORT || 8080, function(){
  //console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
