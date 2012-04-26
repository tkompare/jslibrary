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
 * @param {string} iconType - the type of icon name: URL or column
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
		// I am who I am and that's all that I am.
		var self = this;
		//this.hideLayer();
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
			var url = 'https://www.google.com/fusiontables/api/query?sql=' + encodeURIComponent(queryString) + '&jsonCallback=?';
			$.getJSON(url,function(response) {
				self.handleResponse(response);
			});
		}
	};
	this.handleResponse = function(SqlRows)
	{
		var markerLatLng = null;
		for (var i = 0, row; row = SqlRows.table.rows[i]; i++) {
			markerLatLng = new google.maps.LatLng(row[0],row[1]);
			this.markers[i] = new google.maps.Marker({
				position: markerLatLng,
				map: this.Map,
				icon: '/img/o.png'
			});
		} 
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