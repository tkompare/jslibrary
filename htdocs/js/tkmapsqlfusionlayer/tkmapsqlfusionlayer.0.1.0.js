/**
 * @fileoverview Google Fusion SQL API Data Map Layer
 * @author tom@kompare.us (Tom Kompare)
 * @package tom@komapre.usJsClass
 * @version 1.0.0
 */
/**
 * Class for putting Google Fusion Tables SQL API data on a Google Maps map
 * @requires google.maps JS API v3
 * @param {boolean} showNow - Should FT data display upon object instantiation?
 * @param {object} Map - The Google Maps map object
 * @param {string} fusionTableID - the ID of the Fusion Table
 * @param {string} latLngCols - the name of the latitude and longitude columns, separated by a comma
 * @param {string} dataCols - the comma-separated list of metadata columns
 * @param {string} icon - The column name holding the icon name
 * @param {string} iconType - the type of icon name: URL of 'image' or 'column'
 */
function TkMapSqlFusionLayer (showNow,Map,fusionTableID,latLngCols,dataCols,icon,iconType) {
	/* Set Default parameters if not defined ***********************************/
	icon = typeof icon !== 'undefined' ? icon : null;
	iconType = typeof iconType !== 'undefined' ? iconType : null;
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
	this.latLngCols = latLngCols;
	this.dataCols = dataCols;
	/**
	 * Name of the icon
	 * @type string
	 */
	this.icon = icon;
	/**
	 * Type of icon (name of URL or name of column in table?)
	 * @type string
	 */
	this.iconType = iconType;
	/**
	 * The Google Maps Fusion Table layer
	 * @type object
	 */
	this.layer = null;
	/**
	 * Google Maps Marker objects
	 * @type array of object
	 */
	this.markers = [];
	/**
	 * Comma-delimited column names from Fusion Tables
	 */
	this.cols = this.latLngCols +','+this.dataCols;
	if(this.iconType === 'column')
	{
		this.cols += this.icon;
	}
	/**
	 * Array of Column Names
	 */
	this.colNames = this.cols.split(',');
	this.Table = null;
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
		// Build the query string based on wanted columns
		var queryString = 'SELECT ' + this.latLngCols;
		if(this.dataCols.length > 0)
		{
			queryString += ',' + this.dataCols;
		}
		if(this.iconType === 'column')
		{
			queryString += ',' + this.icon;
		}
		queryString += ' FROM ' + this.fusionTableID;
		// I yam what I yam and that's all that I yam.
		var self = this;
		this.hideLayer();
		// Am I displaying a search result?
		if (type !== null && type === 'search' && keyColumn.length > 0 && string.length > 0)
		{
			// Find the search column
			var searchCol = this.colNames.indexOf(keyColumn);
			// Iterate through all the table rows
			for (var i=0; i<this.Table.rows.length; i++)
			{
				// If the row's search column contains the search string...
				if(this.Table.rows[i][searchCol].indexOf(string) > -1)
				{
					// Put that marker back on the map.
					this.markers[i].setMap(this.Map);
				}
			}
		}
		else
		{
			if (this.markers.length === 0)
			{
				var url = 'https://www.google.com/fusiontables/api/query?sql=' + encodeURIComponent(queryString) + '&jsonCallback=?';
				$.getJSON(url,function(SqlRepsonse) {
					self.handleResponse(SqlRepsonse);
				});
			}
			else
			{
				for (var i=0; i<this.markers.length; i++)
				{
					this.markers[i].setMap(this.Map);
				}
			}
		}
	};
	this.handleResponse = function(SqlRepsonse)
	{
		var markerLatLng = null;
		this.Table = SqlRepsonse.table;
		for (var i = 0, row; row = this.Table.rows[i]; i++) {
			markerLatLng = new google.maps.LatLng(row[0],row[1]);
			// if the this.icon is an image
			if (this.iconType === 'image')
			{
				this.markers[i] = new google.maps.Marker({
					position: markerLatLng,
					map: this.Map,
					icon: this.icon
				});
			}
			// If the this.icon is a column...
			else if (this.iconType === 'column')
			{
				var iconCol = this.colNames.indexOf(this.icon);
				this.markers[i] = new google.maps.Marker({
					position: markerLatLng,
					map: this.Map,
					icon: row[iconCol]
				});
			}
		}
	};
	/**
	 * Hide the Fusion Tables data layer.
	 */
	this.hideLayer = function()
	{
		if (this.markers.length > 0)
		{
			for (var i=0; i<this.markers.length; i++)
			{
				this.markers[i].setMap(null);
			}
		}
	};
	//Should the map show on instatiation?
	if(this.showNow === true)
	{
		this.showLayer();
	}
};