/**
 * @fileoverview Google Fusion Data Map Layer
 * @author tom@komapre.us (Tom Kompare)
 * @package tom@komapre.usJsClass
 * @version 1.0.0
 */
/**
 * Class for putting Google Fusion Tables data on a Google Maps map.
 * @requires google.maps JS API v3
 * @param {boolean} showNow - Should FT data display upon object instantiation?
 * @param {object} Map - The Google Maps map object
 * @param {string} fusionTableID - the ID of the Fusion Table
 * @param {string} iconColumn - The column name holding the icon URL.
 */
function TkMapVizFusionLayer (showNow,Map,fusionTableID,iconColumn) {
	/* Set Default parameters if not defined ***********************************/
	icon = typeof icon !== 'undefined' ? icon : null;
	/* PROPERTIES **************************************************************/
	/**
	 * Display FT data on instantiation
	 * @type boolean
	 */
	this.showNow = showNow;
	/**
	 * The Google Maps map
	 * @type object
	 */
	this.Map = Map;
	/**
	 * The Fusion Tables public id
	 * @type string
	 */
	this.fusionTableID = fusionTableID;
	/**
	 * Fusion Tables column that holds the URL of the icon PNG
	 * @type string
	 */
	this.iconColumn = iconColumn;
	/**
	 * The Google Maps Fusion Table layer
	 * @type object
	 */
	this.layer = null;
	/**
	 * Google Vizualization data object
	 * @type object
	 */
	this.FTTable = null;
	this.numCols = null;
	this.numRows = null;
	this.markers = [];
	/* METHODS *****************************************************************/
	/**
	 * Show the Fusion Tables data layer on the map
	 * @param {string} type - The type of data display (ex. 'search')
	 * @param {string} string - The basis of data display (ex. 'searchString')
	 * @param {string} keyColumn - The associated FT column of data display
	 * @param {string} iconURL - OPTIONAL name of icon URL
	 */
	this.showLayer = function(type,string,keyColumn,iconURL)
	{
		// Set defaults if parameters not defined
		type = typeof type !== 'undefined' ? type : null;
		string = typeof string !== 'undefined' ? string : null;
		keyColumn = typeof keyColumn !== 'undefined' ? keyColumn : null;
		iconURL = typeof iconURL !== 'undefined' ? icon : this.iconColumn;
		//this.hideLayer();
/* REMOVE ****************************************************************/
		testMarkerLatLng = new google.maps.LatLng(42.01048,-87.6652);
		testMarker = new google.maps.Marker({
			position: testMarkerLatLng,
			map: this.Map,
			icon: 'http://localhost:8888/img/o.png'
		});
/* REMOVE ****************************************************************/
		// Am I displaying a search result?
		if (type !== null && type === 'search' && keyColumn.length > 0 && string.length > 0)
		{
			var query = {
					select: this.latLngColumn,
					from: this.fusionTableID,
					where: keyColumn+" CONTAINS IGNORING CASE '"+string+"'"
				};
			if (this.icon !== null)
			{
				this.layer = new google.maps.FusionTablesLayer({
					query: query,
					styles: [{
						markerOptions: { iconName: iconURL }
					}]
				});
			}
			else
			{
				this.layer = new google.maps.FusionTablesLayer({
					query: query
				});
			}
		}
		else
		{
			var queryString = 'SELECT Latitude,Longitude,Status,CompletionDate FROM ' + this.fusionTableID;
			var encodesql = encodeURIComponent(queryString);
			this.FTQuery = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + encodesql);
			var self = this;
			this.FTQuery.send(function(response) {self.handleResponse(response);});
		}
	};
	this.handleResponse = function(FTQueryResponse)
	{
		this.FTTable = FTQueryResponse.getDataTable();
		this.numCols = this.FTTable.getNumberOfColumns();
		this.numRows = this.FTTable.getNumberOfRows();
		alert(this.numRows);
		var lat = null;
		var lng = null;
		var latCol = null;
		var lngCol = null;
		var markerLatLng = null;
		for(var i=0; i<this.numCols; i++)
		{
			if (this.FTTable.getColumnLabel(i) === 'Latitude')
			{
				latCol = i;
			}
			else if (this.FTTable.getColumnLabel(i) === 'Longitude')
			{
				lngCol = i;
			}
		}
		for(var i=0; i<this.numRows; i++)
		{
			lat = this.FTTable.getValue(i,latCol);
			lng = this.FTTable.getValue(i,lngCol);
			markerLatLng = new google.maps.LatLng(lat,lng);
			this.markers[i] = new google.maps.Marker({
				position: markerLatLng,
				map: this.Map,
				icon: 'http://localhost:8888/img/o.png'
			});
		}
	};
	/*
		var numCols = DataTable.getNumberOfColumns();
		var numRows = DataTable.getNumberOfRows();
		var geoLat = null;
		var geoLng = null;
		var markers = [];
		var markerLatLng = [];
		var thisIcon = 'http://localhost:8888/img/o.png';
		for(var i=0; i<numCols; i++)
		{
			if (DataTable.getColumnLabel(i) === 'Latitude')
			{
				geoLat = i;
			}
			else if (DataTable.getColumnLabel(i) === 'Longitude')
			{
				geoLng = i;
			}
		}
		for(var i=0; i<numRows; i++)
		{
			//alert(this.layerData.getValue(i,this.geoLat)+','+this.layerData.getValue(i,this.geoLng));
			markerLatLng = new google.maps.LatLng(this.layerData.getValue(i,this.geoLat),this.layerData.getValue(i,this.geoLng));
			markers[i] = new google.maps.Marker({
				position: markerLatLng,
				map: this.Map,
				icon: icon
			});
		}
	};
	*/
	this.placeMarker = function(LatLng,icon)
	{
		return new google.maps.Marker({
			position: LatLng,
			map: this.Map,
			icon: icon
		});
	};
	
	/**
	 * Hide the Fusion Tables data layer.
	 */
	this.hideLayer = function()
	{
		if (this.layer !== null)
		{
			this.layer.setMap(null);
		}
	};
	//Should the map show on instatiation?
	if(this.showNow === true)
	{
		this.showLayer();
	}
};