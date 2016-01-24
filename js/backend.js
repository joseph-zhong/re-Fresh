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

function returnPostMateReq() {
    return {
        kind: "delivery_quote",
        id: "dqt_qUdje83jhdk",
        created: "2016-01-23T10:20:43Z",
        expires: "2016-01-26T10:09:03Z",
        fee: 799,
        currency: "usd",
        dropoff_eta: "2016-01-23T12:14:03Z",
        duration: 60
    };
}

function sendPostMatesQuote(pickup_address, dropoff_address) {
    var data = { "pickup_address": pickup_address, "dropoff_address" : dropoff_address, "stores": stores };
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
            alert("Data Saved: " + msg);
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