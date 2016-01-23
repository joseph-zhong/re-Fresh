/**
 * Created by Joseph on 1/23/16.
 */

var homeCoordinates;
var homeAddress;
var stores = [];
var map;
var service;

/**
 * USAGE:
 * 1) getLocation() to retrieve current coordinates
 * 2) revGeocode() to convert current coordinates to address
 * 2) getStoreCoordinates() to retrieve nearby stores' addresses
 */

function getStoreCoordinates() {
    //homeCoordinates = getLocation();
    //console.log(homeCoordinates);
    if(!homeCoordinates) {
        console.error("WARNING: home coordinates not set -- must call getLocation first!");
        return;
    }
    var currLoc = new google.maps.LatLng(homeCoordinates.lat, homeCoordinates.lng);
    //console.log(currLoc);
    // may be unnecessary
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

    service = new google.maps.places.PlacesService(document.getElementById('map'));
    service.textSearch(request, callback);
}

// callback for textSearch
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            stores.add(results[i]);
        }
    }
    else {
        console.error("Something went wrong in retrieving nearby stores: " + status);
    }
}

// gets user's location
function getLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var loc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log(loc);
            homeCoordinates = loc;
        }, function() {
            console.log('failed to get location...');
            // failed...
        });
    } else {
        // Browser doesn't support Geolocation
        console.error("Browser doesn't support Geolocation");
    }
}

function revGeocode() {
    if(homeCoordinates) {
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': homeCoordinates}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    console.log("successfully reversed geocode");
                    homeAddress = results[1].formatted_address;
                } else {
                    console.error('No results found');
                }
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    }
}