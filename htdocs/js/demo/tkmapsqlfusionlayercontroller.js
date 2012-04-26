/**
 * Using 'tkmap.2.1.0.js' and 'tkmpafusionlayer.2.0.0.js' 
 */
google.load('visualization', '1', {});
$(document).ready(function() {
	// The Google Maps base map layer
	var Map = new TkMap(true,'map',42.01048,-87.6652,15,true,'road');
	// The tree trim request map layer
	var TreeTrimLayer = new TkMapSqlFusionLayer(true,Map.map,'3028961','Location');
	// Open checkbos listener
	$("#open").click(function() {
		if ($("#open").is(':checked')) {
			TreeTrimLayer.showLayer('search','Open','Status');
		} else {
			TreeTrimLayer.showLayer();
		}
	});
});