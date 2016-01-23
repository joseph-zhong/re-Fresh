$(document).ready(function() {
	Parse.initialize("2TEGFm48tpsJ7Ki02AbOsXKTbQZKzhc4RFhR7S7p", "4NwSuMMl959KJaLsmvf96hBU3NQEx7X4oiICPc6i");
	loadItems(); 
});

function loadItems() {
	var items = Parse.Object.extend("items");
	var query = new Parse.Query(items);
	query.find({
		success: function(results) {
			if(results) {
				window.location.href = "none.html";
			} else {
				for (var i = 0; i < results.length; i++) {
					var object = results[i];
					var item = $("#template").clone();
					item.attr("id", object.get("id"));
					item.find('.itemname').html(capitalize(object.get("name")));
					item.find('.itemdescription').html(capitalize(object.get("description")));
	 				item.find('.small').append('<span>t</span>');
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

// js functiont that takes parse parameters and returns 2h etc.