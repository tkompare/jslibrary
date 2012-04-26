/**
 * Using 'tkmap.2.1.0.js' and 'tkmapsqlfusionlayer.0.1.0.js' 
 */
$(document).ready(function() {
	// The Google Maps base map layer
	var Map = new TkMap(true,'map',42.01048,-87.6652,15,true,'road');
	// The tree trim request map layer
	var TreeTrimLayer = new TkMapSqlFusionLayer(true,Map.map,'3676987','Latitude,Longitude','StreetAddress,ServiceRequestNumber,Status,CreationDate,CompletionDate','/img/o.png','image');
//	var TreeTrimLayer = new TkMapSqlFusionLayer(true,Map.map,'3028961','Latitude,Longitude','Status,CompletionDate');
//	var TreeTrimLayer = new TkMapSqlFusionLayer(true,Map.map,'3676987','Latitude,Longitude','Status,CompletionDate');

	// Open checkbox listener
	$("#open").click(function() {
		if ($("#open").is(':checked')) {
			TreeTrimLayer.showLayer('search','Open','Status');
		} else {
			TreeTrimLayer.showLayer();
		}
	});
});