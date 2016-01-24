$(document).ready(function() {
	Parse.initialize("2TEGFm48tpsJ7Ki02AbOsXKTbQZKzhc4RFhR7S7p", "4NwSuMMl959KJaLsmvf96hBU3NQEx7X4oiICPc6i");
	loadItems(); 
	checkRecipe();
});

function loadItems() {
	var items = Parse.Object.extend("foodEntry");
	var query = new Parse.Query(items);
	query.find({
		success: function(results) {
			if(results.length === 0) {
				window.location.href = "empty.html";
			} else {
				results.sort(function(a, b) {
					return Date.parse(a.get("expDate")) -  Date.parse(b.get("expDate"));
				});
				for(var i = 0; i < results.length; i++) {
					var object = results[i];
					var item = $("#template").clone();
					var timeLeft=Date.parse(object.get("expDate"))-Date.now();
					var daysLeft=Math.floor(timeLeft/86400000);
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
					// CHANGE TO 12 OR SOMETHING
					if(timeLeft/3600000 < 48) {
						item.find('.orderbutton').css('display', 'inline-block');
						item.find('.orderbutton').attr("id", object.id);
					}
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

function reorder(element) {
	element.style.backgroundImage = "url('images/loading.gif')";
	element.style.backgroundSize = "22px 20px";
	element.style.backgroundPosition = "12px 10px";
 	setTimeout(function() {
		displayReorder(element);
	}, 2000);
}

function displayReorder(element) {
	//alert(element.previousSibling.innerHTML);
	var data = returnPostMateReq();
	//console.log(data);
	//console.log(element);
	var time = Date.parse(data.dropoff_eta) - Date.parse(data.created);
	var startTime = Date.now()/60000;
	var minutes = Math.round(time/60000);
	//element.style.backgroundColor = "green";
	element.style.backgroundImage = "none";
	element.innerHTML = "ETA " + minutes + " mins";
	window.setInterval(function() {
		updateTime(startTime, minutes, element);
	}, 60000);
}

function updateTime(startTime, minutes, element) {
	var newMinutes = Math.round(minutes - ((Date.now()/60000) - startTime));
	element.innerHTML = newMinutes + " mins remaining...";
	var postName = $(element).closest('.item').children('.itemname').html();
	var postDescription = $(element).closest('.item').children('.itemdescription').html();
	if(Date.now() > (startTime + minutes)) {
		$.post("http://re-fresh1.herokuapp.com/api/add/single", {
			name: postName,
			description: postDescription
		})
		.done(function(data) {
			$.post("http://re-fresh1.herokuapp.com/api/delete", {
				id: element.id
			})
			.done(function(data) {
				window.location.reload();
			});
		});
	}
}

function checkRecipe() {
	$.get("https://re-fresh1.herokuapp.com/api/recommend/recipe", function(data) {
		if(data) {
			var div = document.getElementById("recipediv");
			div.style.display = "block";
			div.innerHTML += "Looks like your ";
			for(var i = 0; i < data.usedIngreds.length; i++) {
				if(i == 0) {
					div.innerHTML += capitalize(data.usedIngreds[i]);
				} else if(i == data.usedIngreds.length-1) {
					div.innerHTML += " and " + capitalize(data.usedIngreds[i]);
				} else {
					div.innerHTML += ", " + capitalize(data.usedIngreds[i]);
				}
			}
			if(data.usedIngreds.length == 1) {
				div.innerHTML += " is expiring soon! Here are a few recipies.";
			} else { 
				div.innerHTML += " are expiring soon! Here are a few recipies.";
			}
			console.log(data);
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