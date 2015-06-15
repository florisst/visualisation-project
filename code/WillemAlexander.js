/* Load the appropriate json-files and set the variables results and wheather.
*/
window.onload = initialise();
function initialise(){
  clearSVG();
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 3500  - margin.top - margin.bottom;
  var padding = 50;
  var left_pad = 100;
  
  d3.select("#container_scatter").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "scatter_results")
}
// clear the main SVG.
function clearSVG(){
  var rem = d3.select("#scatter_results")
  rem.remove();
}
// Clear the wind arrow SVG.
function clearWind(){
  svg = d3.select("#wind")
  svg.remove();
}

// Use the data for Westelijke 2015 and prepare SVG for new graph.
function openwestelijke2015(){
  console.log("Westelijke grafiek")
  initialise();
  clearWind();
  loadWestelijke2015();
}

// Use the data for Damen 2015 and prepare SVG for new graph.
function opendamen2015(){
  console.log("Damen 2015 grafiek")
  initialise();
  clearWind();
  loadDamen2015();
}
// Use the data for Damen 2014 and prepare SVG for new graph.
function opendamen2014(){
  console.log("Damen 2014 grafiek")
  initialise();
  clearWind();
  loadDamen2014();  
}  
// Select subset of data depending on menu clicked.  
function selectDay(results, weather){
  console.log("welke dag?")
  sat = document.getElementById("zaterdag_select")
  sat.addEventListener("click", function(){
    clearWind();
    weather_day = []
    saturday(results, weather, weather_day)
  },true);
  sund = document.getElementById("zondag_select")
  sund.addEventListener("click", function(){
    clearWind();
    weather_day = []
    sunday(results, weather, weather_day)
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
function saturday (results, weather, weather_day){
  weather_day = []
  for (var i = 0; i < (weather.length/2); i++){
    weather_day.push(weather[i])
  }
  day_results = []
  clearDayResults(day_results);
  day_results = []
  d3.json(results, function() {
    results.forEach(function(d) {
      d.temp = d[0]
      if (d.temp == "za" || d.temp == "za ")
          day_results.push(d)
    });
    clearSVG();
    initialise();
    drawWindDirection(weather, weather_day)
    drawScatter(day_results, weather)
  })
}
// Only select those heats that where rowed on Sunday 
function sunday (results, weather, weather_day){
  weather_day = []
  for (var i = 0; i < (weather.length/2); i++){
    weather_day.push(weather[13+i])
  }
  day_results = []
  d3.json(results, function() {
    results.forEach(function(d) {
      d.temp = d[0]
      if (d.temp == "zo" || d.temp == "zo ")
        day_results.push(d)
    });
    clearSVG();
    initialise();
    drawWindDirection(weather, weather_day)
    drawScatter(day_results, weather)
  })
}

// empty the day_results list to prefent double data.
function clearDayResults(day_results){
  while(day_results.length > 0)
  day_results.pop();
  return day_results;
}

// Draw the wind direction and update the wind dif.
function drawWindDirection(weather,weather_day){
  clearWind();
  svg = d3.select("#static_images").append("svg")
    .attr("id", "wind")

  var sum_direction = 0,
  sum_strength = 0,
  sum_maxStrength = 0;
  for (var i = 0; i < weather_day.length; i++){
    temp = weather_day[i]
    direction = temp["Windrichting"].trim()
    sum_direction += parseInt(direction,10)
    strength = temp["Windsnelheid"].trim()
    sum_strength += parseInt(strength,10)
    maxStrength = temp["Windstoot"].trim()
    sum_maxStrength += parseInt(maxStrength,10)
  }
  var avrDirection = ((sum_direction % 360)/weather_day.length),
  avrStrength = (sum_strength/weather_day.length)
  avrMaxStrength = (sum_maxStrength/weather_day.length)

  // Get the width and height of the SVG to determine the middle.
  width_wind = parseInt(svg.style("width"));
  height_wind = parseInt(svg.style("height"));

  // Rotate the arrow depending on the average wind direction.
  g = svg.append("g")
  g.attr("transform", "rotate(" + avrDirection + "," + width_wind/2 + "," + height_wind/2 + ")")
  // Define arrow 
  g.append("line")
    .attr("x1", width_wind/2)
    .attr("y1", height_wind/2)
    .attr("x2", width_wind/2)
    .attr("y2", (height_wind - 20))
    .attr("stroke-width", 5)
    .attr("stroke", "blue");
  g.append("polygon")
    .attr("points", (width_wind/2 - 5) + "," + height_wind  + " " + (width_wind/2) + "," + (height_wind - 10) + " " + (width_wind/2 + 5) + "," + height_wind)
   //   "115,60, 125,40, 135,60")
    .attr("stroke-width", 4)
    .attr("fill", "blue")
    .attr("stroke", "blue")
    .style("opacity", "1");
}

// Draw the actual graph.
function drawScatter(day_results, weather){
	// Set properties of SVG like width, height.
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 3500  - margin.top - margin.bottom;
  var padding = 50;
  var left_pad = 100;

  var svg = d3.select("#scatter_results").append("g")
  //  .attr("transform", "rotate(90," + width/2 + "," + height/2 + ")")
  // reach the data with d3.
  var parseTime = d3.time.format("%H:%M").parse;
    d3.json(day_results, function() {
		day_results.forEach(function(d) {
    d.baan = +d[4]
		d.startTijd = parseTime(d[1])
		d.crew = d[5]
    d.finishtime = d.crew["results"]["finish"]["time"]
    d.finishPos = +d.crew["results"]["finish"]["position"]
    d.radius = 20-3*d.finishPos
    d.heat = d[2]
    d.time500 = d.crew["results"]["500m"]["time"]
    d.pos500 = +d.crew["results"]["500m"]["position"]
    d.time1000 = d.crew["results"]["1000m"]["time"]
    d.pos1000 = +d.crew["results"]["1000m"]["position"]
    d.time1500 = d.crew["results"]["1500m"]["time"]
    d.pos1500 = +d.crew["results"]["1500m"]["position"]
    d.crewname = d[3]
    });

  var xDomain = d3.extent(day_results, function(d) { return d.baan; });
  var yDomain = d3.extent(day_results, function(d) { return d.startTijd; })

  var xScale = d3.scale.linear().range([padding, width - padding*2]).domain(xDomain);
  var yScale = d3.time.scale().range([padding, height - padding]).domain(yDomain);


  var yAxis = d3.svg.axis().scale(yScale).orient('left');
  var xAxis = d3.svg.axis().scale(xScale).orient('bottom')
    .ticks(6)
    .tickFormat(function (d, i) {
        return ['0', '1', '2', '3', '4', '5', '6', '7'][d];
    });
 
  // Create the Axis for the graph.
  svg.append("g")
      .attr("class", "x axis")
      //.attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Baan");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", height)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Tijd")

  svg.selectAll(".dot")
      .data(day_results)
  .enter().append("ellipse")
    .attr("class", "dot")
    .attr("ry", 5)
    .attr("rx", function (d) { return d.radius*1.5; })
    .attr("cx", function(d) { return xScale(d.baan); })
    .attr("cy", function(d) { return yScale(d.startTijd); })
    .attr("margin", "10")
    .attr('pointer-events', 'fill')
    .style("fill", "red")
    .on("mouseover", function(d){
    showCrewTooltip();
    })
    .on("mouseout", function(d){
      hideCrewTooltip();
    });

  eventlistener();
});
}

// Listen for mouse events.
var movement;
var update;
var bisectDate = d3.bisector(function(d) { return d.startTijd; }).left;
function eventlistener(event){
  tooltip = d3.select("#tooltip")
    .style("opacity", "0")
  point = d3.selectAll(".dot")
    .on("mouseover", function(){
      crew = d3.select(this)
      showCrewTooltip();
      updateCrewTooltip(day_results, crew, event);
    })
    .on("mouseout", function(){
      hideCrewTooltip();
    });

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 3500  - margin.top - margin.bottom;
  var padding = 50;
  var left_pad = 100;
  var xDomain = d3.extent(day_results, function(d) { return d.baan; });
  var yDomain = d3.extent(day_results, function(d) { return d.startTijd; })

  var xScale = d3.scale.linear().range([padding, width - padding]).domain(xDomain);
  var yScale = d3.time.scale().range([padding, height - padding]).domain(yDomain);


  var svg = d3.select("#scatter_results")
  svg.on('mousemove', function() {
    coordinates = d3.mouse(this);
    var xsvg = coordinates[0]
    var ysvg = coordinates[1]
    // Trace which time point the mouse is closest to.
    var mouseTime = yScale.invert(ysvg);

    var i = bisectDate(day_results, mouseTime);
    if (i != "undefined"){
      updateHeatTooltip(i, day_results);
    }
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
  //alert("Je kan me nu zien")
  var div = d3.select("#crew_tooltip")
    .style("opacity", "0.7")
}
// Make the tooltip for crew information visible
function hideCrewTooltip(event){
  var div = d3.select("#crew_tooltip")
    .style("opacity", "0")
}

// Change position and content of Crew tooltip.
function updateCrewTooltip(day_results, crew, event){
  console.log("updateCrewTooltip")
  info = crew.node().__data__;
  var div = d3.select("#crew_tooltip")
  div.style("left", (d3.event.pageX - 200) + "px")
    .style("top", (d3.event.pageY) + "px");

  tijd = info[1]
  crewname = info[3]
  lane = info[4]
  info_500 = []
  temp = info[5]["results"]["500m"]["position"]
  info_500.push(temp)
  temp = info[5]["results"]["500m"]["time"]
  info_500.push(temp)
  info_500.toString();
  
  info_1000 = []
  temp = info[5]["results"]["1000m"]["position"]
  info_1000.push(temp)
  temp = info[5]["results"]["1000m"]["time"]
  info_1000.push(temp)
  info_1000.toString();
  
  info_1500 = []
  temp = info[5]["results"]["1500m"]["position"]
  info_1500.push(temp)
  temp = info[5]["results"]["1500m"]["time"]
  info_1500.push(temp)
  info_1500.toString();

  info_2000 = []
  temp = info[5]["results"]["finish"]["position"]
  info_2000.push(temp)
  temp = info[5]["results"]["finish"]["time"]
  info_2000.push(temp)
  info_2000.toString(); 

  var div = d3.select("#tijd_crew")
  div.html("Starttijd: " + tijd)  
  var div = d3.select("#ploeg_tooltip")
  div.html("Ploeg: " + crewname)
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
    .style("top", (d3.event.pageY - 700) + "px");
  showTooltip(event);
  updateHeatTooltip(event);
}

// Set the opacity of the tooltip to 70%
function showTooltip(event){
  var div = d3.select("#tooltip")
    .style("opacity", "0.7")
}

// update the content of the tooltip for an entire heat.
function updateHeatTooltip(i,day_results){
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
    for (var j = 0; j < heat.length; j++){
      ploeg_overview = heat[j]
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
  div.html("<br>" + "Winnende tijd: " + "<strong>" + time + "</strong>" + "<br>")

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

// Helper functions to check wheater a crew belongs in a heat or not.
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
eventlistener();
}