function TkSocrataView(Args)
{
	/* PROPERTIES **************************************************************/
	// Default private properties from required arguments
	var ViewId = typeof Args.viewid !== 'undefined' ? Args.viewid : null;
	var Domain = typeof Args.domain !== 'undefined' ? Args.domain : null;
	// Default private properties
	var SocrataUrl = null;
	// Public properties
	var Data = [];
	/* METHODS *****************************************************************/
	var dataHandler = function(TheData)
	{
		// Get the column names
		var SocrataColNames = [];
		var theLength = TheData.meta.view.columns.length;
		for (var i=9; i<theLength; i++)
		{
			var j = i - 9;
			SocrataColNames[j] = TheData.meta.view.columns[i].fieldName;
		}
		var newColLength = SocrataColNames.length;
		// Grab the data
		var SocrataData = TheData.data;
		// Remove unneeded SODA 1.0 columns
		for (var i=0; i<SocrataData.length; i++)
		{
			for (var j=0; j<9; j++)
			{
				SocrataData[i].shift();
			}
			Data[i] = {};
			for (var j=0; j<newColLength; j++)
			{
				var thisname = SocrataColNames[j];
				Data[i][thisname] = SocrataData[i][j];
			}
		}
	};
	//Constructor (sort of...)
	if (ViewId !== null || Domain !== null)
	{
		SocrataUrl = 'http://'+Domain+'/api/views/'+ViewId+'/rows.json?jsonp=?';;
		$.get(SocrataUrl, dataHandler, 'jsonp');
	};
	this.getData = function()
	{
		return Data;
	};
};