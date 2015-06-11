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
  clearDayResults(day_results);
  day_results = []
  d3.json(results, function() {
    results.forEach(function(d) {
      d.temp = d[0]
      if (d.temp == "za" || d.temp == "za ")
          day_results.push(d)
    });
    //console.log(day_results.length)
    clearSVG();
    initialise();
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
    clearSVG();
    initialise();
    drawScatter(day_results, weather)
  })
}
function clearDayResults(day_results){
  while(day_results.length > 0)
  day_results.pop();
  console.log(day_results.length)
  return day_results;
}

// Draw the actual graph.
function drawScatter(day_results, weather){
	// Set properties of SVG like width, height.
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 1760 - margin.left - margin.right,
  height = 600  - margin.top - margin.bottom;
  var padding = 50;
  var left_pad = 100;

  var scatter_results = d3.select("#scatter_results")
  // reach the data with d3.
  var parseTime = d3.time.format("%H:%M").parse;
    d3.json(day_results, function() {
		day_results.forEach(function(d) {
    d.baan = d[4]
		d.startTijd = parseTime(d[1])
		d.crew = d[5]
    d.finishtime = d.crew["results"]["finish"]["time"]
    d.finishPos = d.crew["results"]["finish"]["position"]
    d.radius = 20-3*d.finishPos
    d.heat = d[2]
    d.time500 = d.crew["results"]["500m"]["time"]
    d.pos500 = d.crew["results"]["500m"]["position"]
    d.time1000 = d.crew["results"]["1000m"]["time"]
    d.pos1000 = d.crew["results"]["1000m"]["position"]
    d.time1500 = d.crew["results"]["1500m"]["time"]
    d.pos1500 = d.crew["results"]["1500m"]["position"]
    d.crewname = d[3]
    
    // Other variables to contain the data still need to be made.
    });
  var xDomain = d3.extent(day_results, function(d) { return d.startTijd; })
  var yDomain = d3.extent(day_results, function(d) { return d.baan; });

  var xScale = d3.time.scale().range([padding, width - padding]).domain(xDomain);
  var yScale = d3.scale.linear().range([padding, height - padding*2]).domain(yDomain);

  var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
  var yAxis = d3.svg.axis().scale(yScale).orient('left')
    .ticks(6)
    .tickFormat(function (d, i) {
        return ['1', '2', '3', '4', '5', '6', '7', '8'][d];
    });

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
    .attr("cx", function(d) { return xScale(d.startTijd); })
    .attr("cy", function(d) { return yScale(d.baan); })
    .attr('pointer-events', 'fill')
    .style("fill", "red")
    .on("mouseover", function(d){
    console.log("pssssssst!")
    showCrewTooltip();
    })
    .on("mouseout", function(d){
      hideCrewTooltip();
    });

  eventlistener();
return xScale, yScale;
});
}

var movement;
var update;
var bisectDate = d3.bisector(function(d) { return d.startTijd; }).left;
function eventlistener(event){
  tooltip = d3.select("#tooltip")
    .style("opacity", "0")
  point = d3.selectAll(".dot")
    .on("mouseover", function(){
    updateCrewTooltip(day_results, d, event);
    showCrewTooltip();
    })
    .on("mouseout", function(){
      hideCrewTooltip();
    });

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 1760 - margin.left - margin.right,
  height = 600  - margin.top - margin.bottom;
  var padding = 50;
  var left_pad = 100;
  var xDomain = d3.extent(day_results, function(d) { return d.startTijd; })
  var yDomain = d3.extent(day_results, function(d) { return d.baan; });
  var xScale = d3.time.scale().range([padding, width - padding]).domain(xDomain);
  var yScale = d3.scale.linear().range([padding, height - padding*2]).domain(yDomain);

  var svg = d3.select("#scatter_results")
  svg.on('mousemove', function() {
    coordinates = d3.mouse(this);
    var xsvg = coordinates[0]
    var ysvg = coordinates[1]
    // Trace which time point the mouse is closest to.
    var mouseTime = xScale.invert(xsvg);
    var i = bisectDate(day_results, mouseTime);
    var t0 = day_results[i - 1]
    var t1 = day_results[i]
    
    // work out which time value is closest to the mouse
    var t = mouseTime - t0[1] > t1[1] - mouseTime ? t1 : t0;
    var x = xScale(t.startTijd);
    var y = yScale(t.baan);
    
    updateHeatTooltip(i,x,day_results);
    mouseMoved();
  });
  //cancelTimeout(event);
  svg.on("mouseleave", function(){
    mouseOut(event);
  });
}
function mouseOut(event){
  var div = d3.select("#tooltip")
    .style("opacity", "0")
}

/*function cancelTimeout(){
  clearTimeout(movement);
  clearTimeout(update);
}
*/
// Make the tooltip for crew information visible
function showCrewTooltip(event){
  var div = d3.select("#crew_tooltip")
    .style("opacity", "0.7")
}
// Make the tooltip for crew information visible
function hideCrewTooltip(event){
  var div = d3.select("#crew_tooltip")
    .style("opacity", "0")
}
function updateCrewTooltip(day_results, d, event){
  var div = d3.select("#crew_tooltip")
  div.style("left", (d3.event.pageX + 300) + "px")
    .style("top", (d3.event.pageY - 110) + "px");

  tijd = d[1]
  crew = d[3]
  lane = d[4]
  info_500 = []
  temp = d[5]["results"]["500m"]["position"]
  info_500.push(temp)
  console.log(temp)
  temp = d[5]["results"]["500m"]["time"]
  info_500.push(temp)
  info_500.toString();
  
  info_1000 = []
  temp = d[5]["results"]["1000m"]["position"]
  info_1000.push(temp)
  console.log(temp)
  temp = d[5]["results"]["1000m"]["time"]
  info_1000.push(temp)
  info_1000.toString();
  
  info_1500 = []
  temp = d[5]["results"]["1500m"]["position"]
  info_1500.push(temp)
  console.log(temp)
  temp = d[5]["results"]["1500m"]["time"]
  info_1500.push(temp)
  info_1500.toString();

  info_2000 = []
  temp = d[5]["results"]["finish"]["position"]
  info_2000.push(temp)
  console.log(temp)
  temp = d[5]["results"]["finish"]["time"]
  info_2000.push(temp)
  info_2000.toString();
  /*console.log(crew)
  console.log(lane)
  console.log(info_2000)*/
  var div = d3.select("#tijd_crew")
  div.html("Starttijd: " + tijd)  
  var div = d3.select("#ploeg_tooltip")
  div.html("Ploeg: " + crew)
  var div = d3.select("#tussenstand_tooltip")
  div.html("500m: " + info_500 + "<br>"
    + "1000m: " + info_1000 + "<br>"
    + "1500m: " + info_1500 + "<br>"
    + "finish: " + info_2000 )
}

function mouseMoved(event){
  // Reset the opacity to zero.
  var div = d3.select("#tooltip")
    .attr("width", "200px")
    .attr("height", "400px")
    .style("opacity", "0");
  // place the tooltip next to the mouse.
  div.style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 210) + "px");
  //movement = setTimeout(function(){
  showTooltip(event);
  //}, 1000);
  //update = setTimeout(function(){
  updateHeatTooltip(event);
  //}, 1000);
}

// Set the opacity of the tooltip to 70%
function showTooltip(event){
  var div = d3.select("#tooltip")
    .style("opacity", "0.7")
}

// update the content of the tooltip for an entire heat.
function updateHeatTooltip(i,x,day_results){
  heat = []
  d = day_results[i]
  starttijd = d.startTijd
  field = d[2]
  for (var x = 0; x < 6; x+=1) {
    ploeg_heat = day_results[i-x]
    ploeg2_heat = day_results[i+x]
    if (ploeg_heat[2] === field)
      crewExists(ploeg_heat, heat)
    if (ploeg2_heat[2] === field)
      addCrew(ploeg2_heat, heat)
  }
  for (test = 0; test < heat.length; test++){
    ploeg_overview = heat[test]
    position = ploeg_overview[5]["results"]["finish"]["position"]
    if (position == 1)
      var time = ploeg_overview[5]["results"]["finish"]["time"]
    lane = ploeg_overview[4]
    if (lane == 1)
      var baan1 = ploeg_overview[3]
    if (lane == 2)
      var baan2 = ploeg_overview[3]
    if (lane == 3)
      var baan3 = ploeg_overview[3]
    if (lane == 4)
      var baan4 = ploeg_overview[3]
    if (lane == 5)
      var baan5 = ploeg_overview[3]
    if (lane == 6)
      var baan6 = ploeg_overview[3]
    if (lane == 7)
      var baan7 = ploeg_overview[3]
    if (lane == 8)
      var baan8 = ploeg_overview[3]
  }
  
  var div = d3.select("#veld_tooltip")
  div.html(field)
  var div = d3.select("#tijd_tooltip")
  div.html("<br>" + "Winnende tijd: " + time.bold()  + "<br>")

  // Show the lane positioning of the crews.
  var div = d3.select("#banen_tooltip")
  div.html("<br>" + "Baan 1: " + baan1 + "<br>"
    + "Baan 2: " + baan2 + "<br>"
    + "Baan 3: " + baan3 + "<br>"
    + "Baan 4: " + baan4 + "<br>"
    + "Baan 5: " + baan5 + "<br>"
    + "Baan 6: " + baan6 + "<br>"
    + "Baan 7: " + baan7 + "<br>"
    + "Baan 8: " + baan8 + "<br>")

function crewExists(crewname, arr) {
  return arr.some(function(el) {
    return el.crewname === crewname;
  }); 
}
function addCrew(crewname, arr) {
  if (crewExists(crewname, arr)) {
    return false; 
  }
  arr.push(crewname)
  return true;
}
}