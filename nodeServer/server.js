// All required utils for the app 
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

var groceries = {
	"beef" : [1,2],
	"milk" : [5, 7],
	"chicken" : [1,2],
	"bacon" : [7, 14],
	"salmon" : [1, 2],
	"apples" : [10, 14],
	"oranges" : [14, 21],
	"potatoes" : [21, 35],
	"broccoli" : [7, 14],
	"bread" : [5, 7]
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('API Being Accessed');
	next();
});

router.get('/', function(req, res){
	res.json({message: "working"});
});

router.route('/route/abrv')
	.get(function(req, res){
		match(req.params.abrv);
	});


app.use('/api', router);


function match(text){
	var len=text.length;
	var minLength=100;
	var result="";
	for(var grocery : groceries){
		var pointer=0;
		for(i=0;i<grocery.length;i++){
			if(text.charAt(pointer)==grocery.charAt(i)){
				pointer+=1
			}
		}
		if(pointer==len&&grocery.length-len<minLength){
			minLength=grocery.length-len;
			result=grocery;
		}
	}
	return result;
}

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server on: ' + port);