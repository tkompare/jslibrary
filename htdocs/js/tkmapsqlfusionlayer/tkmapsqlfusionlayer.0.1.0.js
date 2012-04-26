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
 * @param {string} icon - The column name holding the icon URL.
 */
function TkMapSqlFusionLayer (showNow,Map,fusionTableID,latLngCols,popupCols,icon,iconType) {
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
	this.popupCols = popupCols;
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
	 * Google SQL API data object
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
			var queryString = 'SELECT ' + this.latLngCols + ',' + this.popupCols + ' FROM ' + this.fusionTableID;
			alert(queryString);
			var self = this;
			var url = 'https://www.google.com/fusiontables/api/query?sql=' + encodeURIComponent(queryString) + '&jsonCallback=?';
			alert(url);
			$.getJSON(url,function(response) {
				alert('here');
				self.handleResponse(response);
			});
		}
	};
	this.handleResponse = function(SqlRows)
	{
		var markerLatLng = null;
		alert(SqlRows.table.rows[0][0]);
		for (var i = 0, row; row = SqlRows.table.rows[i]; i++) {
			markerLatLng = new google.maps.LatLng(row[0],row[1]);
			this.markers[i] = new google.maps.Marker({
				position: markerLatLng,
				map: this.Map,
				icon: 'http://localhost:8888/img/o.png'
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