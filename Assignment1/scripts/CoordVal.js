/*
    Program: CoordVal.js
    Programmer: Antonio Hernandez
    Date: February 11, 2025
    Purpose: Validate entries for latitude and longitude world map

*/

// required user to initialize variable
"use strict";

// obtain the quadrant value from latitude (North, South or Equator)
function getLatDirection (sLat){  //pass in the Latitude (string)

    // declare latitude variables
    // assigns a constant variable of 0 to the equator
    const EQUATOR = 0;
    // assigns default latitude quadrant to "North"
    let sHemi = "North";

    // verifies the quadrant
    // Sets the quadrant to “South” if the latitude is lower than the Equator.
    if (sLat < EQUATOR){
        sHemi = "South"
    // sets the quadrant to "Equator" if the latitude is equal to the Equator
    } else if (sLat == EQUATOR){ 
        sHemi = "Equator";
    }

    // returns the hemisphere
    return sHemi;
}

// obtain the quadrant value from the longitude (East, West, Prime Meridian)
function getLongDirection (sLong){

    // declare longitude variables
    // assigns a constant variable of 0 to the Prime Meridian    
    const PRIMEMER = 0;
    // sets the default longitude quadrant to East
    let sHemi = "East";

    // verifies the quadrant
    // sets the quadrant to West if the latitude is lower than the Prime Meridian
    if (sLong < PRIMEMER){
        sHemi = "West"
    // sets the quadrant to "Prime Meridian" if the latitude is equal to the Prime Meridian
    } else if (sLong == PRIMEMER){
        sHemi = "Prime Meridian";
    }

    // return hemisphere
    return sHemi;
    
}


// function that validates the latitude value
function isValidLat(sLat){

    // declare variables
     // Assign a variable for an error message, initialized to a blank string
    let sLatMsg = "";
    // Assign a variable to indicate if the latitude is valid, initialized to true
    let bValid = true;
    // Assign a variable for the latitude value (assume a floating point number). Set the variable by parsing the string passed in to the function
    let fLat   = parseFloat(sLat);
    // Assign constants for the minimum and maximum latitude values: -90 and 90.
    const MINLAT = -90, MAXLAT = 90;
    
    // checks to see if coordinate is valid.  If the latitude is not a valid floating point number
    if (isNaN(fLat) || fLat < MINLAT || fLat > MAXLAT){
    // Set the error message to “Latitude should be between -90 and 90”
        sLatMsg = "Latitude should be between -90 and 90!";
     // Set the validity to false
        bValid = false;
    }

    // If input is blank, display error message and sets validity to false
    if (sLat === "") {
        sLatMsg = "Latitude is not a valid float!";
        bValid = false;
    }
    // if input is not numeric, display error message and sets validity to false
    else if (isNaN(fLat)) {
        sLatMsg = "Latitude is not a valid float!";
        bValid = false;
    }

    //  Set the Latitude error message label (i.e. id="laterr") text to the value of the error message
    document.getElementById("laterr").innerHTML = sLatMsg;

    // return value specifying if the latitude is valid or not.
    return bValid;

}

// function that validates the longitude value
function isValidLong(sLong){

    // declare variables
     // Assign a variable for an error message, initialized to a blank string
    let sLongMsg = "";
    // Assign a variable to indicate if the longitude is valid, initialized to true
    let bValid = true;
     // Assign a variable for the longitude value (assume a floating point number). Set the variable by parsing the string passed in to the function
    let fLong = parseFloat(sLong);
    // Assign constants for the minimum and maximum longitude values: -180 and 180.
    const MINLONG = -180, MAXLONG = 180;

    // If the longitude is not a valid floating point number
    if (isNaN(fLong) || fLong < MINLONG || fLong > MAXLONG){
    // Set the error message to “Longitude should be between -180 and 180”
        sLongMsg = "Longitude should be between -180 and 180!";
    // Set the validity to false
        bValid = false;
    }

    // If input is blank, display error message and sets validity to false
    if (sLong === "") {
        sLongMsg = "Longitude is not a valid float!";
        bValid = false;
    }
    // if input is not numeric, display error message and sets validity to false
    else if (isNaN(fLong)) {
        sLongMsg = "Longitude is not a valid float!";
        bValid = false;
    }

    //  Set the longitude error message label text to the value of the error message
    document.getElementById("longerr").innerHTML = sLongMsg;

    // Calls the image display function with "Bad" and "World" if coordinates are not valid
    updDisplay("Bad", "World");

    // return value specifying if the latitude is valid or not.
    return bValid;
}

function valLatLong(sLat, sLong){

    // declare local variables to be used
    let sLatHemi = "";
    let sLongHemi = "";
    let sResults = "";

    // determines the direction of the latitude
    if (isValidLat(sLat)){
        sLatHemi = getLatDirection(sLat);
    };

    // determine the direction of the longitude
    if (isValidLong(sLong)){
        sLongHemi = getLongDirection(sLong);
    }

    // updates the results label with hemisphere message
    if (sLatHemi !== "" && sLongHemi !== ""){
        sResults = "Coordinates are: " + sLatHemi + " " + sLongHemi;
        document.getElementById("mapquadrant").innerHTML = sLatHemi + sLongHemi;

        // Calls the image display function with the values of the quadrant.
        updDisplay(sLatHemi, sLongHemi);

    } else {
        sResults = "Invalid Coordinates!";
        document.getElementById("mapquadrant").innerHTML = "";

        // Calls the image display function with "Bad" and "World" if coordinates are not valid
        updDisplay("Bad", "World");
    }

    // updates the results on the main page
    document.getElementById("results").innerHTML = sResults;
}


function updDisplay(sLatQuad, sLongQuad) {
    // Declare variables to hold the images
    let sMapFile = "";

    // if the coordinates are not valid, change the map to BadWorld.jpg
    if (sLatQuad === "Bad" || sLongQuad === "Bad") {
        sMapFile = "images/BadWorld.jpg";
    // If the coordinates are in the equator and prime meridian, show the world map
    } else if (sLatQuad === "Equator" || sLongQuad === "PrimeMeridian") {
        sMapFile = "images/World.jpg";
    // else display the image corresponding to each quadrant based on the coordinates
    } else {
        sMapFile = "images/" + sLatQuad + sLongQuad + ".jpg";
    }

    // Get the image element from the HTML page by its ID
    let imgElement = document.getElementById("worldmap");

    // Set the source of the image element to the constructed map file path
    imgElement.src = sMapFile;
}
