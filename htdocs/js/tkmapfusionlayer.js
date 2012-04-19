/**
 * @fileoverview Google Fusion Data Map Layer
 * @author tom@komapre.us (Tom Kompare)
 * @package tom@komapre.usJsClass
 * @version 1.0
 */
/**
 * Class for putting Google Fusion Tables data on a Google Maps map.
 * @requires google.maps JS API v3
 * @param {object} Map - The Google Maps map object
 * @param {string} fusionTableID - the ID of the Fusion Table
 * @param {string} latLngColumn - The column name holding the lat/lng data.
 * @param {string} icon - The name of a predefined Google Maps icon.
 */
function TkMapFusionLayer (Map,fusionTableID,latLngColumn,icon) {
	/* Set Default parameters if not defined ***********************************/
	icon = typeof icon !== 'undefined' ? icon : null;
	/* PROPERTIES **************************************************************/
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
	 * Fusion Tables column that holds the geodata
	 * @type string
	 */
	this.latLngColumn = latLngColumn;
	/**
	 * Predefined Google Maps icon
	 * @type string
	 */
	this.icon = icon;
	/**
	 * The Google Maps Fusion Table layer
	 * @type object
	 */
	this.layer = null;
	/* METHODS *****************************************************************/
	/**
	 * Show the Fusion Tables data layer on the map
	 * @param {string} type - The type of data display (ex. 'search')
	 * @param {string} string - The basis of data display (ex. 'searchString')
	 * @param {string} keyColumn - The associated FT column of data display
	 * @param {string} icon - OPTIONAL name of predefined Google Maps icon
	 */
	this.showLayer = function(type,string,keyColumn,icon)
	{
		// Set defaults if parameters not defined
		type = typeof type !== 'undefined' ? type : null;
		string = typeof string !== 'undefined' ? string : null;
		keyColumn = typeof keyColumn !== 'undefined' ? keyColumn : null;
		icon = typeof icon !== 'undefined' ? icon : this.icon;
		this.hideLayer();
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
						markerOptions: { iconName: icon }
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
			var query = {
					select: this.latLngColumn,
					from: this.fusionTableID
				};
			// If there is a default icon defined
			if (this.icon !== null)
			{
				this.layer = new google.maps.FusionTablesLayer({
					query: query,
					styles: [{
						markerOptions: { iconName: this.icon }
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
		this.layer.setMap(this.Map);
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
};