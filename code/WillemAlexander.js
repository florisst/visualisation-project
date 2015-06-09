/* Load the appropriate json-files and set the variables results and wheather.
*/
window.onload = initialise();
function initialise(){
  clearSVG();
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 1760 - margin.left - margin.right,
  height = 600  - margin.top - margin.bottom;
  var padding = 50;
  var left_pad = 100;
  
  d3.select("#container_scatter").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "scatter_results")
}
function clearSVG(){
  var rem = d3.select("#scatter_results")
  rem.remove();
}

// Use the data for Westelijke 2015 and prepare SVG for new graph.
function openwestelijke2015(){
  console.log("Westelijke grafiek")
  initialise();
  loadWestelijke2015();
}

// Use the data for Damen 2015 and prepare SVG for new graph.
function opendamen2015(){
  console.log("Damen 2015 grafiek")
  initialise();
  loadDamen2015();
}
// Use the data for Damen 2014 and prepare SVG for new graph.
function opendamen2014(){
  console.log("Damen 2014 grafiek")
  initialise();
  loadDamen2014();  
}  
// Select subset of data depending on menu clicked.  
function selectDay(results, weather){
  console.log("welke dag?")
  sat = document.getElementById("zaterdag_select")
  sat.addEventListener("click", function(){
    saturday(results, weather)
  },true);
  sund = document.getElementById("zondag_select")
  sund.addEventListener("click", function(){
    sunday(results, weather)
  },true);
}

// load the results and weather data for the Westelijke 2015.
function loadWestelijke2015(){
	var q = queue(1);
	q.defer(d3.json, "westelijke2015.json");
	q.defer(d3.json, "JSON/westelijke2015_uurlijk.json");
	q.awaitAll(westelijke2015);
}

// load the results and weather data for the Damen 2015.
function loadDamen2015(){
	var q = queue(1);
	q.defer(d3.json, "damen2015.json");
	q.defer(d3.json, "JSON/damen2015_uurlijk.json");
	q.awaitAll(damen2015);
}

// load the results and weather data for the Damen 2014.
function loadDamen2014(){
	var q = queue(1);
	q.defer(d3.json, "damen2014.json");
	q.defer(d3.json, "JSON/damen2014_uurlijk.json");
	q.awaitAll(damen2014);
}

// name variables and use those for visualisation.
function westelijke2015(error, data_array){
	results = data_array[0]
	weather = data_array[1]
	selectDay(results, weather)
}
function damen2015(error, data_array){
	results = data_array[0]
	weather = data_array[1]
  selectDay(results, weather);
}
function damen2014(error, data_array){
	results = data_array[0]
	weather = data_array[1]
  selectDay(results, weather);
}

// Only select those heats that where rowed on Saturday 
function saturday (results, weather){
  day_results = []
  d3.json(results, function() {
    results.forEach(function(d) {
      d.temp = d[0]
      if (d.temp == "za" || d.temp == "za ")
        day_results.push(d)
    });
    console.log(day_results)
    clearSVG();
    drawScatter(day_results, weather)
  })
}
// Only select those heats that where rowed on Sunday 
function sunday (results, weather){
  day_results = []
  d3.json(results, function() {
    results.forEach(function(d) {
      d.temp = d[0]
      if (d.temp == "zo" || d.temp == "zo ")
        day_results.push(d)
    });
    console.log(day_results)
    clearSVG();
    drawScatter(day_results, weather)
  })
}

// Draw the actual graph.
function drawScatter(day_results, weather){
	// Set properties of SVG like width, height.
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 1760 - margin.left - margin.right,
  height = 600  - margin.top - margin.bottom;
  var padding = 50;
  var left_pad = 100;
  initialise();

  // create the X and Y axis.
	var x = d3.time.scale()
    	.range([padding, width - padding]);
	var y = d3.scale.linear()
    	.range([padding, height - padding*2]);
	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");
	var yAxis = d3.svg.axis()
    	.scale(y)
      .orient("right")
      .ticks(6)
        .tickFormat(function (d, i) {
            return ['1', '2', '3', '4', '5', '6', '7', '8'][d];
        });
  var scatter_results = d3.select("svg")
  // reach the data with d3.
  var parseTime = d3.time.format("%H:%M").parse;
    d3.json(day_results, function() {
		day_results.forEach(function(d) {
    d.baan = d[4]
		d.startTijd = parseTime(d[1])
		d.crew = d[5]
    d.finishPos = d.crew["results"]["finish"]["position"]
    d.radius = 20-3*d.finishPos
    // Other variables to contain the data still need to be made.
    });

	// Scale the data to the SVG.
  x.domain(d3.extent(day_results, function(d) { return d.startTijd; })).nice();
  y.domain(d3.extent(day_results, function(d) { return d.baan; })).nice();

  // Create the Axis for the graph.
  scatter_results.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("tijd");

  scatter_results.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Baan")
  // Add datapoints to graph.
  scatter_results.selectAll(".dot")
    .data(day_results)
  .enter().append("ellipse")
    .attr("class", "dot")
    .attr("rx", 3)
    .attr("ry", function (d) { return d.radius*1.5; })
    .attr("cx", function(d) { return x(d.startTijd); })
    .attr("cy", function(d) { return y(d.baan); })
    .style("fill", "red");

  // append rectangle over entire SVG for correct handling of mouse events.
  scatter_results.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("opacity", "0")
});
}

var movement;
function eventlistener(){
  var svg = d3.select
}