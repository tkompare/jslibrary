/**
 * @fileoverview Google Maps Base Map Object
 * @author tom@kompare.us (Tom Kompare)
 * @package tom@kompare.usJsClass
 * @version 1.0.0
 */
/**
 * Class to simplify setting up a Google Map.
 * @requires google.maps JS API v3
 * @param {char} domObject - Name of the HTML DOM object were the map is going
 * @param {float} lat - Map center latitude in decimal degrees
 * @param {float} lng - Map center longitude in decimal degrees
 * @param {int} zoomLevel - OPTIONAL default zoom level of map
 * @param {boolean} responsiveZoom - OPTIONAL zoomLevel adjusts to window size
 * @param {boolean} defaultStyle - OPTIONAL Use the TkMap default map style to
 * 	remove Google Map's base map label clutter.
 */
function TkMap(domObject,lat,lng,zoomLevel,responsiveZoom,defaultStyle)
{
	/* Set Default parameters if not defined ***********************************/
	zoomLevel = typeof zoomLevel !== 'undefined' ? zoomLevel : 15;
	responsiveZoom = typeof responsiveZoom !== 'undefined' ? responsiveZoom : false;
	defaultStyle = typeof defaultStyle !== 'undefined' ? defaultStyle : true;
	/* PROPERTIES **************************************************************/
	/**
	 * Google Maps map
	 * @type object
	 */
	this.map = null;
	/**
	 * HTML DOM map element
	 * @type object
	 */
	this.mapDom = null;
	/**
	 * Name of the HTML DOM map element
	 * @type char
	 */
	this.domObject = domObject;
	/**
	 * Google Maps LatLng
	 * @type object
	 */
	this.mapCenter = new google.maps.LatLng(lat,lng);
	/**
	 * The initial map zoom level
	 * @type integer
	 */
	this.defaultZoomLevel = zoomLevel;
	/**
	 * Base the initial zoom level on browser width
	 * @type boolean
	 */
	this.responsiveZoom = responsiveZoom;
	/**
	 * Use the WS default map style
	 * $type boolean
	 */
	this.defaultStyle = defaultStyle;
	/**
	 * Google Map map options. See also: 'this.setOptions'
	 * @type object
	 */
	this.options = {
		mapTypeControl : true,
		streetViewControl : false,
		panControl : false,
		zoomControl : true,
		zoomControlOptions : {
			style : google.maps.ZoomControlStyle.SMALL,
			position : google.maps.ControlPosition.LEFT_TOP
		},
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		styles : 
		[
			{
				featureType : "all",
				elementType : "labels",
				stylers: [{ visibility: "off" }]
			},
			{
				featureType : "administrative",
				elementType : "labels",
				stylers: [{ visibility: "on" }]
			},
			{
				featureType : "road",
				elementType : "labels",
				stylers: [{ visibility: "on" }]
			}
		]
	};
	/* METHODS *****************************************************************/
	/**
	 * Display the map in the DOM
	 */
	this.display = function()
	{
		this.setMapDOM();
		this.setOptions();
		this.map = new google.maps.Map(this.mapDom,this.options);
		this.map.setCenter(this.mapCenter);
		this.setZoomLevel();
	};
	/**
	 * Define the HTML DOM as the map target
	 */
	this.setMapDOM = function()
	{
		this.mapDom = document.getElementById(this.domObject);
	};
	/**
	 * Set the map zoom level
	 */
	this.setZoomLevel = function()
	{
		// If the zoom level is responsive, figure out what it should be.
		if (this.responsiveZoom)
		{
			theWidth = window.innerWidth;
			if (theWidth < 481)
			{
				this.map.setZoom(this.defaultZoomLevel - 1);
			}
			else if (theWidth < 981)
			{
				this.map.setZoom(this.defaultZoomLevel);
			}
			else
			{
				this.map.setZoom(this.defaultZoomLevel + 1);
			}
		}
		else
		{
			this.map.setZoom(this.defaultZoomLevel);
		}
	};
	/**
	 * Set the map options
	 */
	this.setOptions = function()
	{
		// Override default map options if defaultStyle is false
		if(this.defaultStyle === false)
		{
			this.options = {
				mapTypeControl : true,
				streetViewControl : false,
				panControl : false,
				zoomControl : true,
				zoomControlOptions : {
					style : google.maps.ZoomControlStyle.SMALL,
					position : google.maps.ControlPosition.LEFT_TOP
				},
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};
		}
	};
};