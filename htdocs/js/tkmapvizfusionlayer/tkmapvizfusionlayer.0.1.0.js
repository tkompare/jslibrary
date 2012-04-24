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
	this.layerData = null;
	/**
	 * The column index of the geo data.
	 */
	this.geoLat = null;
	this.geoLng = null;
	this.markers = Array();
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
			var queryString = 'SELECT * FROM ' + this.fusionTableID;
			this.FTQuery(queryString).send(this.makeLayer);
		}
		//this.layer.setMap(this.Map);
	};
	this.FTQuery = function(sql)
	{
		var encodesql = encodeURIComponent(sql);
		return new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + encodesql);
	};
	this.makeLayer = function(FTQueryResponse)
	{
		this.layerData = FTQueryResponse.getDataTable();
		var numCols = this.layerData.getNumberOfColumns();
		for(var i=0; i<numCols; i++)
		{
			if (this.layerData.getColumnLabel(i) === 'Latitude')
			{
				this.geoLat = i;
				//alert('lat '+i);
			}
			else if (this.layerData.getColumnLabel(i) === 'Longitude')
			{
				this.geoLng = i;
				//alert('lng '+i);
			}
		}
		var numRows = this.layerData.getNumberOfRows();
		var markers = Array();
		var markerLatLng = Array();
		var thisIcon = 'http://localhost:8888/img/o.png';
		for(var i=0; i<numRows; i++)
		{
			//alert(this.layerData.getValue(i,this.geoLat)+','+this.layerData.getValue(i,this.geoLng));
			markerLatLng[i] = new google.maps.LatLng(this.layerData.getValue(i,this.geoLat),this.layerData.getValue(i,this.geoLng));
			markers[i] = new google.maps.Marker({
				position: markerLatLng[i],
				map: this.Map,
				icon: thisIcon
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