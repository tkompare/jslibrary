var Data = null;
var BusinessLicenses = new TkSocrataView
({
	viewid : 'b7mg-yyns',
	domain : 'data.cityofchicago.org'
});
$("#search-button").click(function(){
	if(Data === null)
	{
		Data = BusinessLicenses.getData();
	}
	$('#license-body').empty();
	$('#alertbox').empty();
	var pattern = new RegExp($("#number").val()+'[0-9]{2}.*'+$("#name").val(),'i');
	var matched = 0;
	for (var i=0; i<Data.length; i++)
	{
		if(Data[i].address.match(pattern) !== null)
		{
			$('#license-body').append('<tr><td>'+$.trim(Data[i].address)+'</td><td>'+$.trim(Data[i].doing_business_as_name)+'</td><td>'+Data[i].license_description+'</td></tr>');
			matched++;
		}
	}
	if (matched === 0)
	{
		$('#alertbox').append('<div class="alert alert-error">Your search did not find any businesses within Chicago\'s 49th Ward, or the data request to the data source is not yet complete.');
	}
});