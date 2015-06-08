/* Load the appropriate json-files and set the variables results and wheather.
*/
window.onload = loadDamen2014();

function loadWestelijke2015(){
	var q = queue(1);
	q.defer(d3.json, "westelijke2015.json");
	q.defer(d3.json, "JSON/westelijke2015_uurlijk.json");
	q.awaitAll(westelijke2015);
}

function loadDamen2015(){
	var q = queue(1);
	q.defer(d3.json, "damen2015.json");
	q.defer(d3.json, "JSON/damen2015_uurlijk.json");
	q.awaitAll(damen2015);
}

function loadDamen2014(){
	var q = queue(1);
	q.defer(d3.json, "damen2014.json");
	q.defer(d3.json, "JSON/damen2014_uurlijk.json");
	q.awaitAll(damen2014);
}

function westelijke2015(error, data_array){
	results = data_array[0]
	weather = data_array[1]
	drawScatter(results, weather);
}

function damen2015(error, data_array){
	results = data_array[0]
	weather = data_array[1]
	drawScatter(results, weather);
}

function damen2014(error, data_array){
	results = data_array[0]
	weather = data_array[1]
	drawScatter(results, weather);
}

// Draw the actual graph.
function drawScatter(results, weather){
	// Set properties of SVG like width, height.
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
	
	var scatter_results = d3.select("#scatter_results")
		.attr("width", width)
		.attr("height", height)

	// create the X and Y axis.
	var x = d3.time.scale()
    	.range([0, width]);

	var y = d3.scale.linear()
    	.range([height, 0]);

	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left");
    


});
})
}