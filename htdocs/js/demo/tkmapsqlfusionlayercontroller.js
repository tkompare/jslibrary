/**
 * Using 'tkmap.3.0.0.js' and 'tkmapsqlfusionlayer.1.0.0.js' 
 */
$(document).ready(function() {
	// The Google Maps base map layer
	var Map = new TkMap({lat:42.01048,lng:-87.6652,domid:'map',init:true});
	// The tree trim request map layer
	var RackLayer = new TkMapSqlFusionLayer
	({
		map : Map.Map,
		tableid : '3815321',
		lat : 'Latitude',
		lng : 'Longitude',
		datacols: 'Address,Ward,CommunityName',
		where : "Ward = '49'",
		iconurl : '/img/o.png'
	});
	// Open checkbox listener
	$("#open").click(function() {
		if ($("#open").is(':checked')) {
			RackLayer.showLayer({
				col:'Address',
				val:'Sheridan'
			});
		} else {
			RackLayer.showLayer({});
		}
	});
});