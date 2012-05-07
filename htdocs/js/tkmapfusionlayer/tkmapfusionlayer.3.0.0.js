function TkMapFusionLayer(Args)
{
	/* PROPERTIES **************************************************************/
	// Default private properties from required arguments
	var Map = typeof Args.map !== 'undefined' ? Args.map : null;
	var Geo = typeof Args.geo !== 'undefined' ? Args.geo : null;
	var TableId = typeof Args.tableid !== 'undefined' ? Args.tableid : null;
	// Default private properties from optional arguments
	var Where = typeof Args.where !== 'undefined' ? Args.where : null;
	var Icon = typeof Args.icon !== 'undefined' ? Args.icon : null;
	// Default public properties
	this.Layer = null;
	/* METHODS *****************************************************************/
	this.showLayer = function(Args)
	{
		// Set properties from arguments
		var showWhere = typeof Args.where !== 'undefined' ? Args.where : Where;
		var showIcon = typeof Args.icon !== 'undefined' ? Args.icon : Icon;
		// Hide the layer
		this.hideLayer();
		// Am I displaying a search result?
		var Query = null;
		if (showWhere === null) {
			Query = {
					select: Geo,
					from: TableId
			};
		}
		else
		{
			Query = {
					select: Geo,
					from: TableId,
					where: showWhere
			};
		}
		if (showIcon !== null)
		{
			this.Layer = new google.maps.FusionTablesLayer({
				query: Query,
				styles: [{
					markerOptions: { iconName: showIcon }
				}]
			});
		}
		else
		{
			this.Layer = new google.maps.FusionTablesLayer({
				query: Query
			});
		}
		this.Layer.setMap(Map);
	};
	this.hideLayer = function()
	{
		if (this.Layer !== null)
		{
			this.Layer.setMap(null);
		}
	};
	if (Map !== null && Geo !== null && TableId !== null)
	{
		this.showLayer({});
	}
}