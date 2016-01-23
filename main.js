$(document).ready(function() {
	Parse.initialize("2TEGFm48tpsJ7Ki02AbOsXKTbQZKzhc4RFhR7S7p", "4NwSuMMl959KJaLsmvf96hBU3NQEx7X4oiICPc6i");
	loadItems(); 
});

function loadItems() {
	var items = Parse.Object.extend("foodEntry");
	var query = new Parse.Query(items);
	query.find({
		success: function(results) {
			if(results.length === 0) {
				window.location.href = "empty.html";
			} else {
				for (var i = 0; i < results.length; i++) {
					var object = results[i];
					var item = $("#template").clone();
					var timeLeft=Date.parse(object.get("expDate"))-Date.now();
					var daysLeft=Math.floor(timeLeft/86400000);
					//console.log(timeLeft);
					//console.log(daysLeft);
					var dateString="";
					if(daysLeft < 7) {
						dateString = daysLeft + "d";
					} else if(daysLeft >= 7 && daysLeft <= 31) {
						dateString = Math.round(daysLeft/7) + "w";
					} else {
						dateString = Math.round(daysLeft/31) + "m";
					}
					item.attr("id", object.get("id"));
					item.find('.itemname').html(capitalize(object.get("name")));
					item.find('.itemdescription').html(capitalize(object.get("description")));
					item.find('.small').removeClass("p30");
					var percentLeft = 100-round(daysLeft/object.get("lifetime"))*100;
					item.find('.small').addClass("p"+(percentLeft));
	 				item.find('.small').append('<span>'+dateString+'</span>');
					item.find('.small').removeClass("red");
					if(percentLeft < 35) {
						color = "green";
					} else if(percentLeft >= 35 && percentLeft <= 65) {
						color = "yellow";
					} else {
						color = "red";
					}
					item.find('.small').addClass(color);
					item.find('.icon').css('background-image', "url('images/" + object.get('category') + ".png')");
					item.appendTo("body");
					item.show();
				}
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function round(num) {
    return Math.ceil(num * 100) / 100;
}

// js functiont that takes parse parameters and returns 2h etc.