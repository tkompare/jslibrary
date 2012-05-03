function TkMap(Args)
{
	/* PROPERTIES **************************************************************/
	// Default Private Properties from Required Arguments
	var Lat = typeof Args.lat !== 'undefined' ? Args.lat : null;
	var Lng = typeof Args.lng !== 'undefined' ? Args.lng : null;
	var DomId = typeof Args.domid !== 'undefined' ? Args.domid : null;
	// Default Private Properties from Optional Arguments
	var Zoom = typeof Args.zoom !== 'undefined' ? Args.zoom : 15;
	var Init = typeof Args.init !== 'undefined' ? Args.init : false;
	// Default Private Properties
	var MapOptions = {
			center : new google.maps.LatLng(Lat,Lng),
			mapTypeControl : false,
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			panControl : false,
			streetViewControl : false,
			styles : [],
			zoom: Zoom,
			zoomControl : true
	};
	// Default Public Properties
	this.Map = null;
	/* METHODS *****************************************************************/
	this.initMap = function()
	{
		if (this.Map === null)
		{
			this.Map = new google.maps.Map(
				document.getElementById(DomId),
				MapOptions
			);
		}
	};
	this.setMapOptions = function(options)
	{
		$.extend(MapOptions,options);
	};
	this.setResponsive = function()
	{
		var theWidth = $("#"+DomId).width();
		console.log(theWidth);
		if(theWidth < 481)
		{
			MapOptions.zoom--;
		}
		else if (theWidth > 980)
		{
			MapOptions.zoom++;
		}
	};
	this.setCustomStyles = function(options)
	{
		if (options.styles !== 'undefined')
		{
			var Styles = options.styles.split(' ');
			for (i in Styles)
			{
				if(Styles[i] === 'satellite')
				{
					MapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
				}
				else
				{
					if (Styles[i] === 'hybrid')
					{
						MapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
					}
					else if (Styles[i] === 'road')
					{
						MapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
					}
					else if (Styles[i] === 'terrain')
					{
						MapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
					}
					else if (Styles[i] === 'minlabels')
					{
						MapOptions.styles.push 
						(
							{
								featureType : "all",
								elementType : "labels",
								stylers: [{ visibility: "off" }]
							},
							{
								featureType : "administrative",
								elementType : "labels",
								stylers: [{ visibility: "on" }]
							},
							{
								featureType : "road",
								elementType : "labels",
								stylers: [{ visibility: "on" }]
							}
						);
					}
					else if (Styles[i] === 'grey')
					{
						MapOptions.backgroundColor = 'grey';
						MapOptions.styles.push 
						(
							{
								stylers: [{ saturation: -99 }]
							},
							{
								featureType: "road.arterial",
								elementType: "geometry",
								stylers: [{ lightness: 85 }]
							},
							{
								featureType: "water",
								stylers: [{ lightness: -40 }]
							}
						);
					}
				}
			}
		}
	};
	// Show map if Init argument is true
	if(Init === true)
	{
		this.initMap();
	}
};