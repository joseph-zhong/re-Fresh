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
					item.attr("id", object.id);
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
	event.stopPropagation();
	if(element.style.backgroundImage !== "none") {
		element.style.backgroundImage = "url('images/loading.gif')";
		element.style.backgroundSize = "22px 20px";
		element.style.backgroundPosition = "12px 10px";
		mainBackend();
	 	setTimeout(function() {
			displayReorder(element);
		}, 9000);
	} else {
		return false;
	}
}

function displayReorder(element) {
	//alert(element.previousSibling.innerHTML);
	console.log(obj);
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
		$.post("https://re-fresh1.herokuapp.com/api/add/single", {
			name: postName,
			description: postDescription
		})
		.done(function(data) {
			$.post("https://re-fresh1.herokuapp.com/api/delete", {
				isExpired: false,
				name: postName,
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
			//var div = document.getElementById("top");
			div.style.display = "block";
			div.innerHTML += "<span>Looks like your ";
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
				div.innerHTML += " is expiring soon! Here are a few recipes. Click for more info.</span>";
			} else { 
				div.innerHTML += " are expiring soon! Here are a few recipes. Click for more info.</span>";
			}
			var theID1 = data.data[0].id;
			div.innerHTML += "<br><img src='" + data.data[0].image+ "'><a target='_blank' id='recipe" + theID1 + "'><h1>" + data.data[0].title + "</h1></a>";
			var url = "https://re-fresh1.herokuapp.com/api/recipe/" + theID1;
			$.get(url, function(data2) {
				document.getElementById("recipe" + theID1).href = data2.link;
			});
			var theID2 = data.data[1].id;
			div.innerHTML += "<br><img src='" + data.data[1].image+ "'><a target='_blank' id='recipe" + theID2 + "'><h1>" + data.data[1].title + "</h1></a>";
			var url = "https://re-fresh1.herokuapp.com/api/recipe/" + theID2;
			$.get(url, function(data3) {
				document.getElementById("recipe" + theID2).href = data3.link;
			});
			/*for(var d = 0; d < 2; d++) {
				div.innerHTML += "<br><img src='" + data.data[d].image+ "'><a target='_blank' id='recipe" + theID + "'><h1>" + data.data[d].title + "</h1></a>";
				var url = "https://re-fresh1.herokuapp.com/api/recipe/" + theID;
				$.get(url, function(data2) {
					console.log(document.getElementById("recipe" + theID));
					document.getElementById("recipe" + theID).href = data2.link;
				});
			}*/
			console.log(data);
		}
	});
}

function hideRecipes() {
	document.getElementById("recipediv").style.display = "none";
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function round(num) {
    return Math.ceil(num * 100) / 100;
}

function triggerTouch(element) {
	if(element.className !== "item toggle") {
		var items = document.getElementsByClassName("item");
		for(var d = 0; d < items.length; d++) {
			items[d].className = "item";
		}
		$(element).toggleClass("toggle");
		document.getElementById("addbutton").style.display = "none";
		document.getElementById("deletebutton").style.display = "block";
		document.getElementById("deletebutton").style.backgroundImage = "url('images/delete.png')";
	} else {
		$(element).toggleClass("toggle");
		document.getElementById("addbutton").style.display = "block";
		document.getElementById("deletebutton").style.display = "none";
		document.getElementById("deletebutton").style.backgroundImage = "url('images/plus.png')";
	}
}

function deleteToggled() {
	var item = document.getElementsByClassName("toggle")[0];
	$.post("https://re-fresh1.herokuapp.com/api/delete", {
		isExpired: false,
		id: item.id
	})
	.done(function(data) {
		window.location.reload();
	});
}

// js functiont that takes parse parameters and returns 2h etc.