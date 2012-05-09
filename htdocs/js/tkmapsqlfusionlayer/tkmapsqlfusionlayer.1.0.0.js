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
		// If iconurl not defined, then iconcol is required
	var IconUrl = typeof Args.iconurl !== 'undefined' ? Args.iconurl : null;
	var IconCol = typeof Args.iconcol !== 'undefined' ? Args.iconcol : null;
	// Default private properties from optional arguments
	var DataCols = typeof Args.datacols !== 'undefined' ? Args.datacols : null;
	var Where = typeof Args.where !== 'undefined' ? Args.where : null;
	// Default public properties
	this.Layer = null;
	this.Table = null;
	this.Markers = [];
	this.InfoWindows = [];
	/* METHODS *****************************************************************/
	this.showLayer = function(Args)
	{
		// Handle Args
		var Col = typeof Args.col !== 'undefined' ? Args.col : null;
		var Val = typeof Args.val !== 'undefined' ? Args.val : null;
		// Hide the layer
		this.hideLayer();
		if (this.Markers.length === 0)
		{
		// I yam what I yam and that's all that I yam.
			var self = this;
			var QueryString = this.setQuery({
				where:Where,
				iconcol:IconCol
			});
			var url = 'https://www.google.com/fusiontables/api/query?sql=' + encodeURIComponent(QueryString) + '&jsonCallback=?';
			$.getJSON(url,function(SqlRepsonse) {
				self.handleResponse(SqlRepsonse);
			});
		}
		else if (Col !== null && Val !== null)
		{
			var colIndex = this.ColNames.indexOf(Col);
			for (var i=0; i<this.Markers.length; i++)
			{
				if(this.Table.rows[i][colIndex].indexOf(Val) > -1)
				{
					this.Markers[i].setMap(Map);
				}
			}
		}
		else
		{
			for (var i=0; i<this.Markers.length; i++)
			{
				
				this.Markers[i].setMap(Map);
			}
		}
	};
	this.hideLayer = function()
	{
		if (this.Markers.length > 0)
		{
			for (var i=0; i<this.Markers.length; i++)
			{
				this.Markers[i].setMap(null);
			}
		}
	};
	this.handleResponse = function(SqlRepsonse)
	{
		var markerLatLng = null;
		this.Table = SqlRepsonse.table;
		var latlng = [];
		for (var i = 0, row; row = this.Table.rows[i]; i++)
		{
			if(Geo !== null) {
				latlng = Geo.split(',');
				markerLatLng = new google.maps.LatLng(latlng[0],latlng[1]);
			}
			else
			{
				markerLatLng = new google.maps.LatLng(row[0],row[1]);
			}
			// Make the info windows
			if (DataCols !== null)
			{
				var datacols = DataCols.split(',');
				var infoText = '<div id="content">';
				for (var j=0, col; col=datacols[j]; j++)
				{
					var thisDataCol = this.ColNames.indexOf(col);
					infoText += row[thisDataCol]+'<br>';
				}
				infoText += '</div>';
				this.InfoWindows[i] = new google.maps.InfoWindow({
					content : infoText
				});
			}
			// if the IconURL
			if (IconUrl !== null)
			{
				this.Markers[i] = new google.maps.Marker({
					position: markerLatLng,
					map: Map,
					icon: IconUrl
				});
			}
			// If IconCol
			else if (IconCol !== null)
			{
				var iconCol = this.ColNames.indexOf(IconCol);
				this.Markers[i] = new google.maps.Marker({
					position: markerLatLng,
					map: Map,
					icon: row[iconCol]
				});
			}
			if (DataCols !== null)
			{
				google.maps.event.addListener(
					this.Markers[i],
					'click',
					this.setListener({
						marker:this.Markers[i],
						infowin:this.InfoWindows[i]
					})
				);
			}
		}
	};
	this.setListener = function(Args)
	{
		return function(){ Args.infowin.open(Map,Args.marker); };
	};
	this.setQuery = function(Args)
	{
		var query = 'SELECT ';
		var JoinedCols = this.ColNames.join(',');
		query += JoinedCols;
		query += ' FROM ' + TableId;
		if (typeof Args.where !== 'undefined')
		{
			query += ' WHERE '+Args.where;
		}
		return query;
	};
	var setColNames = function()
	{
		var ColNames = [];
		if (Geo !== null)
		{
			ColNames.push(Geo);
		}
		else
		{
			ColNames.push(Lat);
			ColNames.push(Lng);
		}
		if (DataCols !== null)
		{
			var DataColsArray = DataCols.split(',');
			for (var j=0, col; col=DataColsArray[j]; j++)
			{
				ColNames.push(col);
			}
		}
		if (IconCol !== null)
		{
			ColNames.push(IconCol);
		}
		return ColNames;
	};
	if(Map !== null && TableId !== null && (Geo !== null || (Lat !== null && Lng !== null)))
	{
		this.ColNames = setColNames();
		this.showLayer({});
	}
};