var graffitiURL = "https://data.cityofchicago.org/resource/4ijn-s7e5.json"
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

var LIMIT = 20000;

getData({}, function(data){
	main(data);
}, LIMIT);

function main(data){
	
	var graphData = {};
	var riskData = {};

	for(var b = 0; b < data.length; b++){
		var entry = data[b];
		var result = entry.results;
		if (result == "Out of Business") {
			//Black magic that Vinesh just added
			if(entry.inspection_type in graphData){
				graphData[entry.inspection_type]++;
			}
			else{
				graphData[entry.inspection_type] = 1
			}

			//Black magic that Vinesh just added
			if(entry.risk in riskData){
				riskData[entry.risk]++;
			}
			else{
				riskData[entry.risk] = 1
			}
		}
	}
console.log(graphData);

var x_axis = [];
var y_axis = [];
for(var type in graphData){
	if(graphData[type]){
		x_axis.push(type);
		y_axis.push(graphData[type]);
	}
}

var z_axis = [];
for (var otherType in riskData){
	if(riskData[otherType]){
		z_axis.push(otherType);
	}
}

var data = [
  {
    x: ["Canvass",'Complaint'],
    y: [graphData["Canvass"],graphData["Complaint"]],
    type: 'bar'
  }
];

var data2 = [
  {
    x: x_axis,
    y: y_axis,
    z: z_axis,
    type: 'scatter3d'
  }
];

Plotly.newPlot('plot', data2);

}