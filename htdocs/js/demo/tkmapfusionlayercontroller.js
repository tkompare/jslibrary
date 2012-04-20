$(document).ready(function() {
	// The Google Maps base map layer
	var Map = new TkMap('map','42.01048','-87.6652',15,true);
	Map.display();
	// The tree trim request map layer
	var TreeTrimLayer = new TkMapFusionLayer(Map.map,'3028961','Location');
	TreeTrimLayer.showLayer();
	// Open checkbos listener
	$("#open").click(function() {
		if ($("#open").is(':checked')) {
			TreeTrimLayer.showLayer('search','Open','Status');
		} else {
			TreeTrimLayer.showLayer();
		}
	});
});