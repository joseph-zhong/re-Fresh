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


function getStoreCoordinates() {
    if(!homeCoordinates) {
        console.error("WARNING: home coordinates not set -- must call getLocation first!");
        return;
    }
    console.log("xxxxxxx" + homeCoordinates.lat);
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
            console.log("stores: " + stores);
        }
        else {
            console.error("Something went wrong in retrieving nearby stores: " + status);
        }
    });
}

// gets user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("asdfasdfasdfa" + position.coords.latitude);
            var loc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log(loc);
            homeCoordinates = loc;
            revGeocode();
        }, function() {
            console.log('failed to get location...');
        });
    } else {
        console.error("Browser doesn't support Geolocation");
    }
}

function revGeocode() {
    if(homeCoordinates) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location': homeCoordinates}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    console.log("successfully reversed geocode");
                    homeAddress = results[1].formatted_address;
                    console.log("homeAddress: " + homeAddress);
                    getStoreCoordinates();
                } else {
                    console.error('No results found');
                }
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    }
}

// , stores, name, homeAddress
function sendPostMatesReq(product, descript, name) {
    var data = { "product": product, "descript": descript, "stores": stores,
        "name": name };
    console.log("data: " + data);
    console.log("stores: " + stores);
    console.log("product: " + product);
    console.log("descript: " + descript);
    console.log("name: " + name);
    console.log("homeAddress: " + homeAddress);
    //$.post("https://re-fresh1.herokuapp.com/api/postmates", {
    //    "product": product,
    //    "descript": descript,
    //    "stores": stores,
    //    "name": name,
    //    "homeAddress": homeAddress
    //}).done(function(success) {
    //    console.log("Successfully created delivery: " + success);
    //});

    $.ajax({
        method: "POST",
        url: "https://re-fresh1.herokuapp.com/api/postmates",
        data: data
    })
    .done(function(msg) {
        alert("Data Saved: " + msg);
    });

    console.log('after');
}

stores = [
    '300 E Baltimore Ave, Lansdowne, PA 19050, United States',
    '4001 Walnut St, Philadelphia, PA 19104, United States',
    '1501 N Broad St #5, Philadelphia, PA 19122, United States',
    '202 Market St, Philadelphia, PA 19106, United States',
    '339 Bainbridge St, Philadelphia, PA 19147, United States',
    '1312 Walnut St, Philadelphia, PA 19107, United States',
    '2535 Aramingo Ave, Philadelphia, PA 19125, United States',
    '3440 Market St, Philadelphia, PA 19104, United States',
    '7901 Lansdowne Avenue, Upper Darby, PA 19082, United States',
    '3901 M St, Philadelphia, PA 19124, United States',
    '7720 West Chester Pike, Upper Darby, PA 19082, United States',
    '3401 Lancaster Ave, Philadelphia, PA 19104, United States',
    '2900 S 70th St, Philadelphia, PA 19142, United States',
    '1215 Filbert St, Philadelphia, PA 19107, United States',
    '2101 S 10th St, Philadelphia, PA 19148, United States',
    '6375 Lebanon Ave, Philadelphia, PA 19151, United States',
    '116 West Township Line Road, Havertown, PA 19083, United States',
    '314 Horsham Rd, Horsham, PA 19044, United States',
    '5834 Pulaski Ave, Philadelphia, PA 19144, United States',
    '1700 Admiral Wilson Blvd, Merchantville, NJ 08109, United States']

function mainBackend() {
    var objs = sendPostMatesQuote(stores[parseInt(Math.random() * stores.length)], homeAddress);
    while(!objs) {}
    return objs;
}

function sendPostMatesQuote(pickup_address, dropoff_address) {
    //var data = { "pickup_address": pickup_address, "dropoff_address" : dropoff_address, "stores": stores };
    var data = { "pickup_address": pickup_address, "dropoff_address" : stores[parseInt(Math.random() * stores.length + 1)]};

    console.log("pickup_address: " + pickup_address);
    console.log("dropoff_address: " + dropoff_address);
    console.log("stores: " + stores);
    console.log("homeAddress: " + homeAddress);
    $.ajax({
            method: "POST",
            url: "https://re-fresh1.herokuapp.com/api/postmatesQuote",
            data: data
        })
        .done(function(msg) {
            return msg;
        });

    console.log('after');
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