function TkMapSqlFusionLayer(Args)
{
	/* PROPERTIES **************************************************************/
	// Default private properties from required arguments
	var Map = typeof Args.map !== 'undefined' ? Args.map : null;
	var TableId = typeof Args.tableid !== 'undefined' ? Args.tableid : null;
	// Either geo, or lat and lng are required
	var Geo = typeof Args.geo !== 'undefined' ? Args.geo : null;
		// If geo not defined, lat and lng are required
	var Lat = typeof Args.lat !== 'undefined' ? Args.lat : null;
	var Lng = typeof Args.lng !== 'undefined' ? Args.lng : null;
	// Default private properties from optional arguments
	var DataCols = typeof Args.datacols !== 'undefined' ? Args.datacols : null;
	var Where = typeof Args.where !== 'undefined' ? Args.where : null;
	var IconUrl = typeof Args.iconurl !== 'undefined' ? Args.iconurl : null;
	var IconCol = typeof Args.iconcol !== 'undefined' ? Args.iconcol : null;
	// Default private properties
	var Markers = [];
	// Default public properties
	this.Layer = null;
	/* METHODS *****************************************************************/
	this.showLayer = function(Args)
	{
		// Set private properties from arguments
		var ShowWhere = typeof Args.where !== 'undefined' ? Args.where : Where;
		var ShowIconUrl = typeof Args.iconurl !== 'undefined' ? Args.iconurl : IconUrl;
		var ShowIconCol = typeof Args.iconcol !== 'undefined' ? Args.iconcol : IconCol;
		this.hideLayer();
		var QueryString = constructQuery({
			where:ShowWhere,
			iconcol:ShowIconCol
		});
		
	};
	this.hideLayer = function()
	{
		if (Markers.length > 0)
		{
			for (var i=0; i<Markers.length; i++)
			{
				Markers[i].setMap(null);
			}
		}
	};
	var constructQuery = function(Args)
	{
		var query = 'SELECT ';
		if (Geo !== null)
		{
			query += Geo;
		}
		else
		{
			query += Lat+','+Lng;
		}
		if (DataCols !== null)
		{
			query += ','+DataCols;
		}
		if (typeof Args.iconcol !== 'undefined')
		{
			query += ','+Args.iconcol;
		}
		query += ' FROM ' + TableId;
		if (typeof Args.where !== 'undefined')
		{
			query += ' WHERE '+Args.where;
		}
		return query;
	};
	if(Map !== null && TableId !== null && (Geo !== null || (Lat !== null && Lng !== null)))
	{
		this.showLayer({});
	}
}