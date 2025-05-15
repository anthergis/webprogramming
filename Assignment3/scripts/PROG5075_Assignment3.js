/*
    Program: PROG5075_Assignment3.js
    Programmer: Antonio Hernandez
    Purpose: Create a 3D Scene View map with custom client-side feature layers and 3D widgets
    Date: April 14, 2025

*/

"use strict";

// Loads required modules to load maps and features
require([ "esri/config", 
          "esri/Map",
          "esri/views/SceneView",
          "esri/layers/GeoJSONLayer",
          "esri/layers/FeatureLayer",
          "esri/layers/MapImageLayer",
// Required renderers and symbology for customizing visuals
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/WebStyleSymbol",
          "esri/symbols/WaterSymbol3DLayer",
          "esri/symbols/PolygonSymbol3D",
          "esri/symbols/LineSymbol3D",
          "esri/renderers/UniqueValueRenderer",
// Required widgets for UI customization
          "esri/widgets/Home",
          "esri/widgets/ScaleBar",
          "esri/widgets/Zoom",
          "esri/widgets/Expand",
          "esri/widgets/Daylight",
          "esri/widgets/BasemapToggle",
          "esri/widgets/Legend",
          "esri/widgets/LineOfSight"
    ], function (esriConfig, Map, SceneView, GeoJSONLayer, FeatureLayer, MapImageLayer, SimpleRenderer, SimpleMarkerSymbol, WebStyleSymbol, 
                WaterSymbol3DLayer, PolygonSymbol3D, LineSymbol3D, UniqueValueRenderer, Home, ScaleBar, Zoom, Expand, Daylight, BasemapToggle, Legend, LineOfSight) {

    // Applies the API key for authentication
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurK2qEbjt_GiJVlmJRR16S2eFtdz2SBhxlt_AugBNLazklvuDqyxKkhdxR2O8RL0SIl2V5DLtTUx7SBpxwacpWeg5Joh-l0r1xE1BljXTJZU9_KpHvaSXX1HLm19vJAJ_-VeLmRrC1orPbNPsfXQvUwFfyI-8wHMHCA7SVdECNPL1cXaCs8lPxCbTDtwcxs8y0YvhPBPwiS5617P1HadOovY.AT1_bCjksDTh"

    // Creates a variable that will host a new map
    const map = new Map({
    // Sets the default basemap and ground elevation surface
      basemap: "streets-navigation-vector",
      ground: "world-elevation"
    });

    // Create a new 3D Scene View with the map
    const view = new SceneView({
        container: "mainView", // reference to the div id
        map: map,
    // Sets the starting location and positioning of the camera
        camera:{
    // Starting position set to Halifax, Nova Scotia
            position: [
                -63.5975, // longitude
                44.4300,  // latitude
                14000     // elevation
            ],
    // Sets the starting tilt and heading of the camera
            tilt: 60,
            heading: 0
        }
    });


    /////////////////////////////////////////////////
    // WIDGETS
    /////////////////////////////////////////////////

    // adds home widget to the map
    let homeWidget = new Home({
        view: view
    });
      
    // moves the home widget to the top right corner of the view
    view.ui.add(homeWidget, "top-right");

    // adds scale bar to the map
    let scaleBar = new ScaleBar({
        view: view,
        style: "ruler",
        unit: "metric"
    });

    // moves scale widget to the bottom left corner of the view
    view.ui.add(scaleBar, {
        position: "bottom-left"
    });

    // add daylight widget to the map
    const daylightWidget = new Daylight({
        view: view,
        dateOrSeason: "season"
      });

    // adds an expand widget to wrap the daylight widget
    const daylightExpand = new Expand({
        view: view,
        content: daylightWidget,
        expandIconClass: "esri-icon-sun",  // Icon for the expandable widget
        expanded: false  // Initially collapsed
    });
     
    // moves daylight widget to the top right corner of the view
    view.ui.add(daylightExpand, "top-right");

    // adds basemap toggle to the map
    // second basemap set to "streets"
    const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "streets" // second basemap option
    });

    // adds basemap toggle to the bottom left corner of the view
    view.ui.add(basemapToggle, "bottom-left");

    // add legend to the map
    const legend = new Legend({
        view: view
    });

    // adds an expand widget to wrap the legend
    const legendExpand = new Expand({
        view: view,
        content: legend,
        expandIconClass: "legend",  // Icon for the expandable widget
        expanded: false  // Initially collapsed
    });

    // moves the legend widget to the bottom left corner of the view
    view.ui.add(legendExpand, "bottom-left");

    // adds line of sight widget to the map
    const lineOfSight = new LineOfSight({
        view: view
    });

    // moves line of sight widget to the bottom right corner of the view
    view.ui.add(lineOfSight, "bottom-right");


    ///////////////////////////////////////////////////////////////////////////////////////
    // 3D SYMBOLS
    ///////////////////////////////////////////////////////////////////////////////////////
    
    // creates 3D symbol for the bus stop points
    const BusStopSymbol = new WebStyleSymbol({
        name: "Bus_Stop_1",
        styleName: "EsriRealisticStreetSceneStyle"
    });

    // resize bus stop web symbols
    BusStopSymbol.fetchSymbol()
        .then(function(slSym){
            const objectSymbolLayer = slSym.symbolLayers.getItemAt(0);

            // sets color and size
            objectSymbolLayer.material = { color: "yellow" };
            objectSymbolLayer.height *= 10;
            objectSymbolLayer.width *= 10;
            objectSymbolLayer.depth *= 10;

            // Adjust the orientation
            objectSymbolLayer.heading = 180;
            objectSymbolLayer.pitch = 0;
            objectSymbolLayer.roll = 0;

        const renderer = HalifaxBusStops.renderer.clone();
        renderer.symbol = slSym;
        HalifaxBusStops.renderer = renderer;
    });

    // creates new symbol for the parking pay station points
    const ParkingSymbol = new WebStyleSymbol({
        name: "Parking",
        styleName: "EsriIconsStyle"
    });

    ///////////////////////////////////////////////////////////////////////////////////////
    // RENDERERS
    ///////////////////////////////////////////////////////////////////////////////////////

    // defineS renderer for bus stop points
    // symbol set to 3D bus stop symbol
    let HalifaxBusStopsRenderer = {
        type: "simple",
        symbol: BusStopSymbol
    };

    // defines the renderer for the Halifax district polygons
    
    // defines the styling and labeling for the "Halifax" polygon
    let HalifaxDistrictsRenderer = {
        type: "unique-value",
        field: "GSA_NAME",
        uniqueValueInfos: [
    {
        value: "HALIFAX",
        symbol: {
        type: "simple-fill",
        color: "red",
        style: "solid",
        outline: {
            color: "black",
            width: 2
    }},
        label: "Halifax"
    },

    // defines the styling and labeling for the "Dartmouth" polygon
    {
        value: "DARTMOUTH",
        symbol: {
        type: "simple-fill",
        color: "green",
        style: "solid",
        outline: {
            color: "black",
            width: 2
    }},
        label: "Dartmouth"
    },

    // defines the styling and labeling for the "Bedford" polygon
    {
        value: "BEDFORD",
        symbol: {
        type: "simple-fill",
        color: "yellow",
        style: "solid",
        outline: {
            color: "black",
            width: 2
    }},
        label: "Bedford"
    },

    // defines the styling and labeling for the Beechville polygon
    {
        value: "BEECHVILLE",
        symbol: {
        type: "simple-fill",
        color: "blue",
        style: "solid",
        outline: {
            color: "black",
            width: 2
    }},
        label: "Beechville"
    }]};

    // defines the renderer for parking pay station points
    // symbol set to parking symbol
    let HalifaxParkingRenderer = {
        type: "simple",
        symbol: ParkingSymbol
    };
      

    // defines the renderer for the Halifax permit parking zones polygons
    let HalifaxParkingZonesRenderer = {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
            type: "simple-fill",  // autocasts as new SimpleMarkerSymbol()
            color: "orange",
            style: "solid",
            outline: { // autocasts as new SimpleLineSymbol()
                color: "black",
                width: 5
            }
    }};

    // define the renderer for the Halifax recreation areas polygons
    let HalifaxRecreationRenderer = {
        type: "simple",
        symbol: {
            type: "simple-fill",
            color: "red",
            style: "vertical",
            outline: {
                color: "white",
                width: 2
            }

    }};

    // define the renderer for the Halifax street lines
    const HalifaxStreetsRenderer = {
    type: "simple",
    symbol: {
        type: "line-3d",
        symbolLayers: [{
            type: "line",
            material: {
                color: "gray"
            },
            size: 2
        }
    ]}};

    ///////////////////////////////////////////////////////////////////////////////////////
    // POPUPS
    ///////////////////////////////////////////////////////////////////////////////////////

    // creates popup template for the Halifax bus stop feature layer
    const HalifaxBusStopsPopup = {
        title: "Halifax Bus Stops",
        content: [{
            type: "fields",
            fieldInfos: [
    // displays the location of bus stops
                {
                    fieldName: "LOCATION",
                    label: "Location:"
                },
    // displays the accessibility of bus stops
                {
                    fieldName: "ACCESSIBLE",
                    label: "Accessible:",
                }
            ]
    }]}

    // create popup template for Halifax Districts feature layer
    const HalifaxDistrictsPopup = {
        title: "Halifax Districts",
    // sets the fields that will display
        content: [{
            type: "fields",
            fieldInfos: [
    // displays the name of the districts
                {
                    fieldName: "GSA_NAME",
                    label: "Name:"
                },
    // displays the area of the district to two decimal places
                {
                    fieldName: "Shape__Area",
                    label: "Area:",
                    format: {
                        places: 2,
                        digitSeparator: true
                    }
                }
            ]
    }]}

    // create popup template for the Halifax parking pay stations feature layer
    const HalifaxParkingPopup = {
        title: "Halifax Parking Pay Stations",
        content: [{
            type: "fields",
            fieldInfos: [
    // displays the location of the stations
                {
                    fieldName: "LOCATION",
                    label: "Location:"
                }
            ]
    }]}

    // create popup template for Halifax Parking Zones feature layer
    const HalifaxParkingZonesPopup = {
        title: "Halifax Permit Parking Zones",
        content: [{
            type: "fields",
            fieldInfos: [
    // displays the parking zone number
                {
                    fieldName: "GLOBALID",
                    label: "Parking Zone:"
                }
            ]
    }]}

    // creates popup template for Halifax streets feature layer
    const HalifaxStreetsPopup = {
        title: "Halifax Streets",
        content: [{
            type: "fields",
            fieldInfos: [
    // displays the full name of the streets
                {
                    fieldName: "FULL_NAME",
                    label: "Name:"
                },
    // displays the lane count of the streets
                {
                    fieldName: "LANECOUNT",
                    label: "Lane Count:"
                },
    // displays the class of the streets
                {
                    fieldName: "ST_CLASS",
                    label: "Class:"
                },
    // displays the lenght of the streets to one decimal place
                {
                    fieldName: "Shape__Length",
                    label: "Length (m):",
                    format: {
                        places: 1,
                        digitSeparator: true
                    }
                },
            ]
    }]};

    ///////////////////////////////////////////////////////////////////////////////////////
    // FEATURE LAYERS
    ///////////////////////////////////////////////////////////////////////////////////////

    // creates and hosts the Halifax Bus Stops feature layer from a url with a renderer and a popup
    let HalifaxBusStops = new FeatureLayer({
        url: "https://services3.arcgis.com/3khPE5aqQZ5vPK7B/arcgis/rest/services/HalifaxBusStops/FeatureServer",
        renderer: HalifaxBusStopsRenderer,
        popupTemplate: HalifaxBusStopsPopup
    });

    // creates and hosts the Halifax Districts feature layer from a url with a renderer set to 50% opacity and a popup
    let HalifaxDistricts = new FeatureLayer({
        url: "https://services3.arcgis.com/3khPE5aqQZ5vPK7B/arcgis/rest/services/HalifaxMunicipalities/FeatureServer",
        renderer: HalifaxDistrictsRenderer,
        opacity: 0.5,
        popupTemplate: HalifaxDistrictsPopup
    });

    // creates and hosts the Halifax Parking Pay Stations feature layer from a url with a renderer and a popup
    let HalifaxParking = new FeatureLayer({
        url: "https://services3.arcgis.com/3khPE5aqQZ5vPK7B/arcgis/rest/services/HalifaxParkingPayStations/FeatureServer",
        renderer: HalifaxParkingRenderer,
        popupTemplate: HalifaxParkingPopup
    });

    // creates and hosts the Halifax Parking Zones feature layer from a url with a renderer set to 50% opacity and a popup
    let HalifaxParkingZones = new FeatureLayer({
        url: "https://services3.arcgis.com/3khPE5aqQZ5vPK7B/arcgis/rest/services/HalifaxPermitParkingZones/FeatureServer",
        renderer: HalifaxParkingZonesRenderer,
        opacity: 0.5,
        popupTemplate: HalifaxParkingZonesPopup
    });

    // creates and hosts the Halifax Recreation feature layer from a url with a renderer
    let HalifaxRecreation = new FeatureLayer({
        url: "https://services3.arcgis.com/3khPE5aqQZ5vPK7B/arcgis/rest/services/HalifaxRecreation/FeatureServer",
        renderer: HalifaxRecreationRenderer
    });

    // // creates and hosts the Halifax Streets feature layer from a url with a renderer and a popup
    let HalifaxStreets = new FeatureLayer({
        url: "https://services3.arcgis.com/3khPE5aqQZ5vPK7B/arcgis/rest/services/HalifaxStreets/FeatureServer",
        renderer: HalifaxStreetsRenderer,
        popupTemplate: HalifaxStreetsPopup
    });
      
    // adds several layers to map
    map.addMany([HalifaxDistricts, HalifaxParkingZones, HalifaxRecreation, HalifaxStreets, HalifaxBusStops, HalifaxParking]);
    });