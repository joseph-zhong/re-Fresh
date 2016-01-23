// All required utils for the app 
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var Parse = require('node-parse-api').Parse;

var options = {
	app_id : "2TEGFm48tpsJ7Ki02AbOsXKTbQZKzhc4RFhR7S7p",
	api_key : "tFMOzm7J01GxnoPbGrHDAXGCsrGoeGrZR0Sao7Ny"
};

var parse = new Parse(options);

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
  'brd' : 'bread'
};

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

//var path = require('path');

app.get('/', function(req, res) {
	console.log("omg");
	res.sendFile("index.html");
});

/*router.route('/')
	.get(function(req, res) {
		console.log("route");
		//res.sendFile(path.join(__dirname, 'index.html'));
		//res.sendFile(path.join(__dirname, 'index.html'));
		//res.sendFile('index.html', { root: __dirname });
		//res.sendfile(res.sendfile('/index.html', {root: __dirname }));

		res.sendFile(path.join(__dirname + '/index.html'));
});*/
//
//router.get('/site/index.html', function(req, res){
//	res.sendFile(path.join(__dirname, '/site', 'index.html'));
//	//res.sendfile(res.sendfile('/site/index.html', {root: __dirname }));
//});

// needs an abreviation to look up (:abrv)
router.route('/abrv/:abrv')
	.get(function(req, res){
		var result = (match(req.params.abrv));
		if (result == null) {
			res.json("No Match found");
		} else {
			res.json(result + " and the expiration date is in " + groceries[result][0] + " day(s)");
		}

	});

// needs a data field in the body with the list from the OCR algorithm 
router.route('/add/multiple')
	.post(function(req, res) {
		var data = req.body.data;
		var prods = determineProducts(data);
		for (var prod in prods) {
			/*var expirationd = getNDaysFromNow(groceries[prod][0]);
			var lifetime = groceries[prod][0];
			var jsonObj = {
				"name" : name,
				"expDate" : expirationd,
				"lifetime" : lifetime
			}*/

			addItemToParse(prod);
		}

		res.json("done");
	});

router.route('/add/single')
	.post(function(req, res) {
		var name = match(req.body.name);
		if (name == null) {
			res.json("Provide a valid name");
			res.send();
		} else {
			var expirationd = getNDaysFromNow(groceries[name][0]);
			var lifetime = groceries[name][0];
			var descrp = req.body.description;
			var jsonObj = {
				"name" : name,
				"expDate" : expirationd,
				"lifetime" : lifetime,
				"description" : descrp
			}

			parse.insert('items', josnObj, function (err, response) {
			  console.log(response);
			});
		}

		res.json("done");
	});

// post needs fields for each col in parse (name, expiration date, lifetime)
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

	if (resultingClosestWord[1] > Math.min(text.length / 2 , resultingClosestWord[0].length / 2 )) {
		return null;
	} else {

		return resultingClosestWord[0];
	}
	
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


function determineProducts(list) {
	var dict  = {};
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var res = match(item);
		if (res != null) {
			console.log(item + " is also known as: " + res);
			if (res in dict) {
				dict[res]++;
			} else {
				dict[res] = 1;
			}
		} else {
			//console.log(item + " has no match.");
		}
	}

	return dict;
}

function getClosestWord(w, dict) {
	var minDis = -1;
	var minWord = "";                                                
	for (var grocery in dict) {
		var dis = getEditDistance(w.toLowerCase(), grocery.toLowerCase());
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

function addItemToParse(food) {
	var item = {
		"name" : food,
		"expDate" : getNDaysFromNow(groceries[food][0]),
		"lifetime" : groceries[food],
		"description" : "",
		"category" : ""
	}

	parse.insert('foodEntry', item, function (err, response) {
	  console.log(response);
	});
}

function getNDaysFromNow(n) {
	var a = new Date();
	a.setDate(a.getDate() + n);
	return a;
}

/*var test = ["‘I‘INEIIIINIIHIIIIIL", "1", "\h", "1", "Save", "money.", "Live", "better.", 
			"I", "085R)S$EOIR", "30588", "Ran", "13059", "FHIR", "LHKES", "PnRKuRY", "FHIRFRX", 
			"vn", "22033", "a", "518", "2016", "0=a", "00004960", "16:", "11", "1R1", "0190", "8/8", "BRST", 
			"L3", "020646690943", "F", "43", "1", "8/5", "BRST", "L3", "020546611017", "F", "T", "g", "SUBTOTAL", 
			"60", "7", "6/5", "BRST", "L3", "020546640937", "F", "37", "i", "a/s", "BRST", "L3", "020646600949", 
			"F", "49", "6", "n/s", "BRST", "L3", "020646681031", "F", "1", "3", ";", "a/s", "BRST", "Ls", 
			"020546681075", "F", "1", ".7", ".", "SUBTOTRL", "6", "6", ";", "nc", "CELERY", "SE", "006210000218",
			 "F", ".", "no", "CELERY", "SE", "006210000218", "F", "HCC/SCH", "PICK", "006210000602", "F", 
			 "HCC/SCH", "PICK", "006210000602", "F", "CHICKN", "BROTH", "006100013279"];*/

var test = ["W§", "BRUCERV", "§", "2!;", "Mixed", "Nuts", "19,99", "1550", "x", "125,00/kg", "yitKat", "A-Fingev", "45g“", "7,00", "Trnp.", "Apple", "Juice", "7501", "11,00", "0119‘", "Cam", "Flakes", "7500", "8%", "25,50", "m1.\§v|15n", "§m", "chicken", "%", "42,00", "262g", "W", "Banana", "Chiqulta", "9,20", "452g", "x", "18,50/kg", "urange", "7,35", "2850", "x", "21,00/kg", "Mushroum", "6,85", "170g", "x", "as", "nu/kg"];
/*console.log(determineProducts(test));*/

var prods = determineProducts(test);
		for (var prod in prods) {
			/*var expirationd = getNDaysFromNow(groceries[prod][0]);
			var lifetime = groceries[prod][0];
			var jsonObj = {
				"name" : name,
				"expDate" : expirationd,
				"lifetime" : lifetime
			}*/

			addItemToParse(prod);
		}

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server on: ' + port);
