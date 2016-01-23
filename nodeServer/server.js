// All required utils for the app 
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

//var cbBikeEntry = require('./app/models/cbBikeEntry');
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
		
	})


app.use('/api', router);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server on: ' + port);