/**
 * Created by Joseph on 1/23/16.
 *
 * USAGE:
 * 1) getLocation() to retrieve current coordinates
 * 2) revGeocode() to convert current coordinates to address
 * 3) getStoreCoordinates() to retrieve nearby stores' addresses
 *
 */

var homeCoordinates;
var homeAddress;
var stores = [];
var map;
var service;


function getStoreCoordinates(product, descript) {
    if(!homeCoordinates) {
        console.error("WARNING: home coordinates not set -- must call getLocation first!");
        return;
    }
    var currLoc = new google.maps.LatLng(homeCoordinates.lat, homeCoordinates.lng);
    map = new google.maps.Map(document.getElementById('map'), {
        center: currLoc,
        zoom: 15
    });

    var request = {
        location: currLoc,
        openNow: true,
        radius: '6000',
        query: 'grocery stores'
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                stores.push(results[i]);
            }
            console.log(stores);
            console.log("product: " + product);
            console.log("descript: " + descript);
        }
        else {
            console.error("Something went wrong in retrieving nearby stores: " + status);
        }
    });
}

// gets user's location
function getLocation(product, descript) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var loc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log(loc);
            homeCoordinates = loc;
            revGeocode(product, descript);
        }, function() {
            console.log('failed to get location...');
        });
    } else {
        console.error("Browser doesn't support Geolocation");
    }
}

function revGeocode(product, descript) {
    if(homeCoordinates) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location': homeCoordinates}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    console.log("successfully reversed geocode");
                    homeAddress = results[1].formatted_address;

                    getStoreCoordinates(product, descript);
                } else {
                    console.error('No results found');
                }
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    }
}

// product, descript, stores, name, homeAddress
function sendPostMatesReq(product, descript, name) {
    var data = { "product": product, "descript": descript, "stores": stores,
                "name": name, "homeAddress": homeAddress };
    $.post("https://re-fresh1.herokuapp.com/api/postmates", data,
    function(success) {
        console.log("Successfully created delivery: " + success);
    });
}

function getRecommendedRecipes(callback) {
    var request = new XMLHttpRequest();
    request.onload = callback;
    ajax.open("GET", "https://re-fresh1.herokuapp.com/api/recommend/recipe", true);
    ajax.send();
}

function getRecipeInfo(id, callback) {
    var request = new XMLHttpRequest();
    request.onload = callback;
    ajax.open("GET", "https://re-fresh1.herokuapp.com/api/recipe/" + id, true);
    ajax.send();
}