/**
 * Using 'tkmap.3.0.0.js' and 'tkmpafusionlayer.2.0.0.js' 
 */
$(document).ready(function() {
	// The Google Maps base map layer
	var themap = new TkMap({lat:42.01048,lng:-87.6652,domid:'map'});
	themap.setCustomStyles({styles:'grey minlabels'});
	themap.initMap();
	// The tree trim request map layer
	var TreeTrimLayer = new TkMapFusionLayer(true,themap.Map,'3028961','Location');
	// Open checkbox listener
	$("#open").click(function() {
		if ($("#open").is(':checked')) {
			TreeTrimLayer.showLayer('search','Open','Status');
		} else {
			TreeTrimLayer.showLayer();
		}
	});
});