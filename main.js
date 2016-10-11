var graffitiURL = "https://data.cityofchicago.org/resource/eq45-8inv.json"
var SECRET_TOKEN = "Le00VXF0GK0d8D1tTn2v6Vkpl";


function getData(query, callback, limit){
	query['$$app_token'] = SECRET_TOKEN;
	query['$limit'] = limit || 10;
	$.ajax({
		url: graffitiURL,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			callback(data);
		},
		error: function(jqxhr, status, error){
			console.error("Critical Error!");
		}
	});
}

var LIMIT = 50;

getData({id: "174"}, function(data){
	console.log(data);
	main(data);
}, LIMIT);

function main(data){

	var availableBikes = {};

	for(var b = 0; b < data.length; b++){
		var entry = data[b];
		var dataPoint = {
			time: entry.timestamp,
			bikes: entry.available_bikes
		};
		if(availableBikes[entry.id]){
			availableBikes[entry.id].push(dataPoint);
		}
		else{
			availableBikes[entry.id] = [dataPoint];
		}
	}

	var X_AXIS = [];
	for(var x = 1; x <= LIMIT; x++){
		X_AXIS.push(x);
	}
				
	var layout = {
		xaxis: {title: 'Check'},
		yaxis: {title: 'Bikes'},
		showLegend: false,
		margin: {t: 0}
	}

	var traces = [];

	for(var s in availableBikes){
		if(availableBikes[s]){
			// Sort the checks
			var bike_checks = availableBikes[s].sort(function(a, b){
				return a.timestamp - b.timestamp;
			});
			// Return the number of bikes at each check
			var bikes = bike_checks.map(function(item){
				return item.bikes;
			});
			// Add the bike counts to the plot
			traces.push({
				name: "Station #" + s,
				//marker: marker: {color: 'rgba(93, 20, 73, 1)'},
				x: X_AXIS,
				y: bikes
			});
		}
	}

	var plot = document.getElementById('plot');
	Plotly.plot(plot, traces, layout);

}