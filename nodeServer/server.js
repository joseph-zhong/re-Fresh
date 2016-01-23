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
};

var abrv = {'bf' : 'beef',
  'mlk' : 'milk',
  'chckn': 'chicken',
  'bcn': 'bacon',
  'slmn': 'salmon',
  'ppls' : 'apples',
  'rngs' : 'oranges',
  'ptts' : 'potatoes',
  'brccl' : 'broccoli',
  'brd' : 'bread'};

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

router.route('/abrv/:abrv')
	.get(function(req, res){
		var result = (match(req.params.abrv));
		if (result == null) {
			res.json("No Match found");
		} else {
			res.json(result + " and the expiration date is in " + groceries[result][0] + " day(s)");
		}

	});


app.use('/api', router);


function match(text){
	var len=text.length;
	var minLength=100;
	var result="";
	var w = getClosestWord(text, groceries);
	var a = getClosestWord(text, abrv);
	var resultingClosestWord;
	
	if (w[1] < a[1]) {
		resultingClosestWord = w;
	} else {
		resultingClosestWord = [abrv[a[0]], a[1]];
	}

	if (resultingClosestWord[1] >= text.length - 1) {
		return null;
	}

	console.log(resultingClosestWord);

	return resultingClosestWord[0];
	
	/*for(var grocery in groceries){
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
	} */

//	return result;
}

function getClosestWord(w, dict) {
	var minDis = -1;
	var minWord = "";
	for (var grocery in dict) {
		var dis = getEditDistance(w, grocery);
		//console.log(grocery + " the dist is " + dis);
		if (minDis == -1 || minDis > dis) {
			minDis = dis;
			minWord = grocery;
		}
	}

	return [minWord, minDis];
}

/*function getClosestAbrev(w) {
	var minDis = -1;
	var minWord = "";
	for (var grocery in abrv) {
		grocery = abrv[grocery];
		var dis = getEditDistance(w, grocery);
		//console.log(grocery + " the dist is " + dis);
		if (minDis == -1 || minDis > dis) {
			minDis = dis;
			minWord = grocery;
		}
	}

	return [minWord, minDis];
} */

function levenshteinDistance (s, t) {
    if (!s.length) return t.length;
    if (!t.length) return s.length;

    return Math.min(
        levenshteinDistance(s.substr(1), t) + 1,
        levenshteinDistance(t.substr(1), s) + 1,
        levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
    ) + 1;
}

function getEditDistance(a, b){
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};

function removeAllVowels() {
	var arr = [];
	for (var g in groceries) {
		var res = "";
		for (var i = 0; i < g.length; i++) {
			//console.log(g[i]);
			var c = g[i];
			if (['a', 'e', 'i', 'o', 'u'].indexOf(c.toLowerCase()) == -1) {
				res += g[i];
			}
		}
		arr.push(res);
	}
	console.log(arr);
}


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server on: ' + port);
