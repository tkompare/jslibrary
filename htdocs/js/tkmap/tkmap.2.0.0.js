/**
 * @fileoverview Google Maps Base Map Object
 * @author tom@kompare.us (Tom Kompare)
 * @package tom@kompare.usJsClass
 * @version 2.0.0
 */
/**
 * Class to simplify setting up a Google Map.
 * @requires google.maps JS API v3
 * @param {boolean} display - Should the map display upon object instantiation?
 * @param {char} domObject - Name of the HTML DOM object were the map is going
 * @param {float} lat - Map center latitude/longitude in decimal degrees
 * @param {float} lng - Map center latitude/longitude in decimal degrees
 * @param {int} zoomLevel - OPTIONAL default zoom level of map
 * @param {boolean} responsiveZoom - OPTIONAL zoomLevel adjusts to window size
 * @param {char} styleString - OPTIONAL map styles, separated by '.'
 */
function TkMap(showNow,domObject,lat,lng,zoomLevel,responsiveZoom,styleString)
{
	/* Set Default parameters if not defined ***********************************/
	zoomLevel = typeof zoomLevel !== 'undefined' ? zoomLevel : 15;
	responsiveZoom = typeof responsiveZoom !== 'undefined' ? responsiveZoom : false;
	styleString = typeof styleString !== 'undefined' ? styleString : null;
	/* PROPERTIES **************************************************************/
	/**
	 * Display the map on instantiation
	 * @type boolean
	 */
	this.showNow = showNow;
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
	this.styles = styleString !== null ? styleString.split('.') : null;
	/**
	 * Google Maps zoom control options
	 */
	this.zoomControlOptions =
	{
		position : google.maps.ControlPosition.LEFT_TOP
	};
	/**
	 * Google Map map options. See also: 'this.setOptions'
	 * @type object
	 */
	this.options = {
		mapTypeControl : true,
		streetViewControl : false,
		panControl : false,
		zoomControl : true,
		zoomControlOptions : this.zoomControlOptions,
	};
	this.theWidth = window.innerWidth;
	/* METHODS *****************************************************************/
	/**
	 * Display the map in the DOM
	 */
	this.display = function()
	{
		this.setMapDOM();
		this.setZoomControlOptions();
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
			if (this.theWidth < 481)
			{
				this.map.setZoom(this.defaultZoomLevel - 1);
			}
			else if (this.theWidth < 981)
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
		if(this.styles !== null)
		{
			this.options.styles = [];
			var thisStyle = null;
			for (thisStyle in this.styles)
			{
				if(this.styles[thisStyle] === 'satellite')
				{
					this.options.mapTypeId = google.maps.MapTypeId.SATELLITE;
				}
				else
				{
					if (this.styles[thisStyle] === 'hybrid')
					{
						this.options.mapTypeId = google.maps.MapTypeId.HYBRID;
					}
					else if (this.styles[thisStyle] === 'road')
					{
						this.options.mapTypeId = google.maps.MapTypeId.ROADMAP;
					}
					else if (this.styles[thisStyle] === 'terrain')
					{
						this.options.mapTypeId = google.maps.MapTypeId.TERRAIN;
					}
					else if (this.styles[thisStyle] === 'minlabels')
					{
						this.options.styles.push 
						(
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
						);
					}
					else if (this.styles[thisStyle] === 'grey')
					{
						this.options.styles.push 
						(
							{
								stylers: [{ saturation: -99 }]
							},
							{
								featureType: "road.arterial",
								elementType: "geometry",
								stylers: [{ lightness: 85 }]
							}
						);
					}
				}
			}
		}
	};
	this.setZoomControlOptions = function()
	{
		if (this.theWidth > 481)
		{
			this.zoomControlOptions.style = google.maps.ZoomControlStyle.LARGE;
		}
		else
		{
			this.zoomControlOptions.style = google.maps.ZoomControlStyle.SMALL;
		}
	};
	// Should the map show on instatiation?
	if(this.showNow === true)
	{
		this.display();
	}
};