"use strict";
// Set properties of SVG like width, height.
var margin = {top: 20, right: 20, bottom: 30, left: 50},
width = 600 - margin.left - margin.right,
height = 2000  - margin.top - margin.bottom;
var padding = 50,
left_pad = 100;

var bisectDate = d3.bisector(function(d) { return d.startTijd; }).left;

window.onload = function(){
  loadData()
}

/*
 * load all data and store in queue.
 */
function loadData(){
  var q = queue(1)
  q.defer(d3.json, "westelijke2015.json")
  q.defer(d3.json, "JSON/westelijke2015_uurlijk.json")
  q.defer(d3.json, "damen2015.json")
  q.defer(d3.json, "JSON/damen2015_uurlijk.json")
  q.defer(d3.json, "damen2014.json")
  q.defer(d3.json, "JSON/damen2014_uurlijk.json")
  q.awaitAll(page)
}

/*
 * select different subselections of the data_array (from the queue) depending on which game is selected 
 */
function page(error, data_array){
  var wes = document.getElementById("selectWes")
  wes.addEventListener("click", function(){
    clearSVG()
    // Hide the scatter plot SVG
    var graph = d3.select("#container_scatter")
      .style("opacity", "0")
    // Show the explanation of page.
    var info = d3.select(".infobox")
      .style("opacity", "1")
    // Show which competition is selected.
    var p = d3.select("#wedstrijd")
    p.html("Westelijke 2015")
    
    // Show that no subselection is made.
    var p = d3.select("#dag")
    p.html("gekozen dag")
    var p = d3.select("#soort_wedstrijd")
    p.html("soort wedstrijd gekozen")
    
    // Hide the wind information and wind arrow
    var wind = d3.select("#infoUpdate")
    wind.style("opacity", "0")
    var arrow = d3.select("#windArrow")
    arrow.style("opacity", "0")
    
    // Select the right data.
    var wesRes = data_array[0]
    var wesWea = data_array[1]
    selectDay(wesRes,wesWea)
  },true)
  var dam15 = document.getElementById("selecDam15")
  dam15.addEventListener("click", function(){
    clearSVG()
    // Hide the scatter plot SVG
    var graph = d3.select("#container_scatter")
      .style("opacity", "0")
    
    // Show the explanation of page.
    var info = d3.select(".infobox")
      .style("opacity", "1")
    
    // Show which competition is selected.
    var p = d3.select("#wedstrijd")
    p.html("Damen 2015")
    
    // Show that no subselection is made.
    var p = d3.select("#dag")
    p.html("gekozen dag")
    var p = d3.select("#soort_wedstrijd")
    p.html("soort wedstrijd gekozen")
    
    // Hide the wind information and wind arrow
    var wind = d3.select("#infoUpdate")
    wind.style("opacity", "0")
    var arrow = d3.select("#windArrow")
    arrow.style("opacity", "0")

    // Select the right data.
    var d15Res = data_array[2]
    var d15Wea = data_array[3]
    selectDay(d15Res,d15Wea)
  },false)
  var dam14 = document.getElementById("selecDam14")
  dam14.addEventListener("click", function(){
    clearSVG()
    // Hide the scatter plot SVG
    var graph = d3.select("#container_scatter")
      .style("opacity", "0")
    
    // Show the explanation of page.
    var info = d3.select(".infobox")
      .style("opacity", "1")
    
    // Show which competition is selected.
    var p = d3.select("#wedstrijd")
    p.html("Damen 2014")
    
    // Show that no subselection is made.
    var p = d3.select("#dag")
    p.html("gekozen dag")
    var p = d3.select("#soort_wedstrijd")
    p.html("soort wedstrijd gekozen")
    
    // Hide the wind information and wind arrow
    var wind = d3.select("#infoUpdate")
    wind.style("opacity", "0")
    var arrow = d3.select("#windArrow")
    arrow.style("opacity", "0")

    // Select the right data.
    var d14Res = data_array[4]
    var d14Wea = data_array[5]
    selectDay(d14Res,d14Wea)
  },false)
}

/*
 * Select subset of data depending on day clicked.  
 */
function selectDay(results, weather){
  var sat = document.getElementById("zaterdag_select")
  sat.addEventListener("click", function(){
    var p = d3.select("#dag")
    p.html("Zaterdag")
    
    var p = d3.select("#soort_wedstrijd")
    p.html("soort wedstrijd gekozen")  
    
    var weather_day = []
    saturday(results, weather, weather_day)
  },false)
  var sund = document.getElementById("zondag_select")
  sund.addEventListener("click", function(){
    var p = d3.select("#dag")
    p.html("Zondag")
    
    var p = d3.select("#soort_wedstrijd")
    p.html("soort wedstrijd gekozen")  
    
    var weather_day = []
    sunday(results, weather, weather_day)
  },false)
}

/*
 * Only select those heats that where rowed on Saturday.
 */
function saturday (results, weather, weather_day){
  if (typeof(day_results) !== 'undefined') {
    clearArray(day_results)
  }
  weather_day = []
  for (var i = 0; i < (weather.length/2); i++){
    weather_day.push(weather[i])
  }
  var day_results = []
  results.forEach(function(d) {
    d.temp = d[0]
    if (d.temp == "za" || d.temp == "za "){
        day_results.push(d)
      }
    })

  // Clear the possibly existing graph and initialise a new SVG element 
  clearSVG()
  initialise()

  // Draw the winddirection on Saturday.
  drawWindDirection(weather, weather_day)
  // Selection must be made for qualifiers, finals or both
  selectType(results, day_results, weather_day, weather)
}


/*
 * Only select those heats that where rowed on Sunday 
 */
function sunday (results, weather, weather_day){
  if (typeof(day_results) !== 'undefined') {
    clearArray(day_results)
  }
  weather_day = []
  for (var i = 0; i < (weather.length/2); i++){
    weather_day.push(weather[13+i])
  }
  var day_results = []
  results.forEach(function(d) {
    d.temp = d[0]
    if (d.temp == "zo" || d.temp == "zo "){
      day_results.push(d)
    }
  })

  // Clear the possibly existing graph and initialise a new SVG element 
  clearSVG()
  initialise()

  // Draw the winddirection on Sunday.
  drawWindDirection(weather, weather_day)
  // Selection must be made for qualifiers, finals or both
  selectType(results, day_results, weather_day, weather)
}

// Clear the SVG element and create a new svg element.
function initialise(){
  clearSVG()
  
  d3.select("#container_scatter").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "scatter_results")
}

// clear the main SVG.
function clearSVG(){
  var rem = d3.select("#scatter_results")
  rem.remove()
  var rem = d3.select("#scatter_results").select("g")
  rem.remove()
}

// Clear the wind arrow SVG.
function clearWind(){
  var svg = d3.select("#wind")
  svg.remove()
}


/*
 * await selection of a time of competition (qualifiers, finals or both)
 */
function selectType(results, day_results, weather_day, weather){
  clearSVG()
  initialise()
  
  // Make sure an empty DataSelection is used
  var DataSelection = []
  clearArray(DataSelection)
  DataSelection = []
  
  // Qualifiers is selected, select right data.
  var vw = document.getElementById("select_voorwedstrijd")
  vw.addEventListener("click", function(){
    var p = d3.select("#soort_wedstrijd")
    p.html("Voorwedstrijden")

    // initialse svg for new graph
    initialise()

    // select the right data
    var DataSelection = []
    clearArray(DataSelection)
    day_results.forEach(function(d) {
      var temp = d[2].slice(-6)
      if (temp !== "finale"){
        DataSelection.push(d)
      }
      })
    
    // Draw graph using the selected data.
    drawScatter(DataSelection, results, day_results, weather_day, weather)
  },true)
  
  // Finals are selected, select right data.
  var finale = document.getElementById("select_finales")
  finale.addEventListener("click", function(){
    var p = d3.select("#soort_wedstrijd")
    p.html("Finales")
    
    // initialse svg for new graph
    initialise()

    // select the right data
    var DataSelection = []
    clearArray(DataSelection)
    day_results.forEach(function(d) {
      var temp = d[2].slice(-6)
      if (temp === "finale"){
        DataSelection.push(d)
      }
      })

    // Draw graph using the selected data.
    drawScatter(DataSelection, results, day_results, weather_day, weather)
  },true)
  
  // Both are selected, select right data.
  var both = document.getElementById("select-beide")
  both.addEventListener("click", function(){
    var p = d3.select("#soort_wedstrijd")
    p.html("Voorwedstrijden & Finales")
    
    // initialse svg for new graph
    initialise()

    // select the right data
    var DataSelection = []
    clearArray(DataSelection)
    day_results.forEach(function(d) {
      DataSelection.push(d)
    })

    // Draw graph using the selected data.
    drawScatter(DataSelection, results, day_results, weather_day, weather)
  },true)
  
}


/*
 * Draw the wind direction and update the wind div.
 */
function drawWindDirection(weather,weather_day){
  // Remove an old wind arrow.
  clearWind()
  var compass = d3.select("#compass")
    .style("opacity", "0")
  var svg = d3.select("#static_images").append("svg")
    .attr("id", "wind")
  // Get the width and height of the SVG to determine the middle.
  var width_wind = parseInt(svg.style("width"),10);
  var height_wind = parseInt(svg.style("height"),10);

  // Add an image of a compass to the svg
  svg.append("image")
    .attr("id", "comp")
    .attr("xlink:href", "images/compass2.png")
    .attr("width", width_wind)
    .attr("height", height_wind)

  // Determine average direction, strength and max strength for the selected day.
  var sum_direction = 0,
  sum_strength = 0,
  sum_maxStrength = 0,
  strengthMax = 0;
  for (var i = 0; i < weather_day.length; i++){
    var temp = weather_day[i]
    var direction = temp["Windrichting"].trim() % 360
    sum_direction += parseInt(direction,10)
    var strength = temp["Windsnelheid"].trim()
    sum_strength += parseInt(strength,10)
    var maxStrength = temp["Windstoot"].trim()
    if (maxStrength > strengthMax){
      strengthMax = maxStrength*0.1
    }
    sum_maxStrength += parseInt(maxStrength,10)
  }
  var avrDirection = (sum_direction/weather_day.length)
  var avrStrength = (sum_strength/weather_day.length)
  var avrMaxStrength = (sum_maxStrength/weather_day.length)
  var avrStrength = roundToTwo(avrStrength*0.1)

  // Define and rotate the main arrow depending on the average wind direction.
  var g = svg.append("g")
    .attr("id", "windArrow")
  g.attr("transform", "rotate(" + avrDirection + "," + width_wind/2 + "," + height_wind/2 + ")")
  // Define arrow 
  g.append("line")
    .attr("x1", width_wind/2)
    .attr("y1", height_wind/2)
    .attr("x2", width_wind/2)
    .attr("y2", height_wind/5)
    .attr("stroke-width", 5)
    .attr("stroke", "blue");
  g.append("polygon")
    .attr("points", (width_wind/2 - 5) + "," + height_wind/5  + " " + (width_wind/2) + "," + (height_wind/5 - 10) + " " + (width_wind/2 + 5) + "," + height_wind/5)
    .attr("stroke-width", 4)
    .attr("fill", "blue")
    .attr("stroke", "blue")
    .style("opacity", "1")
  
  // Add information to the wind div.
  var div = d3.select("#infoUpdate")
  div.style("opacity", "1")
  div.html("Gemiddelde snelheid: <br>" + avrStrength + " m/s <br> Hardste windstoot: <br>" + strengthMax + " m/s <br>")
  
  // A second arrow is used to show hourly wind directions and is defined here. Rotation is done in redirectArrow.
  var optionalArrow = svg.append("g")
    .attr("class", "optionalArrow")
    .style("opacity", "0")
  optionalArrow.append("line")
    .attr("x1", width_wind/2)
    .attr("y1", height_wind/2)
    .attr("x2", width_wind/2)
    .attr("y2", height_wind/5)
    .attr("stroke-width", 5)
    .attr("stroke", "green");
  optionalArrow.append("polygon")
    .attr("points", (width_wind/2 - 5) + "," + height_wind/5  + " " + (width_wind/2) + "," + (height_wind/5 - 10) + " " + (width_wind/2 + 5) + "," + height_wind/5)
    .attr("stroke-width", 4)
    .attr("fill", "green")
    .attr("stroke", "green")
  return weather_day;
}



// Draw the actual graph.
function drawScatter(DataSelection, results, day_results, weather_day, weather){
  var graph = d3.select("#container_scatter")
    .style("opacity", "1")
  var info = d3.select(".infobox")
    .style("opacity", "0")

  var svg = d3.select("#scatter_results").append("g")

  // reach the data with d3.
  var parseTime = d3.time.format("%H:%M").parse
  d3.json(DataSelection, function() {
    DataSelection.forEach(function(d) {
    d.baan =+ d[4]
    d.startTijd = parseTime(d[1])
    
    d.crew = d[5]
    d.finishtime = d.crew["results"]["finish"]["time"]
    d.finishPos =+ d.crew["results"]["finish"]["position"]
    d.radius = 20-3*d.finishPos
    })

  // Set the domain
  var xDomain = d3.extent(DataSelection, function(d) { return d.baan; })
  var yDomain = d3.extent(DataSelection, function(d) { return d.startTijd; })

  // Set the scale
  var xScale = d3.scale.linear().range([left_pad, width - padding*2]).domain(xDomain).nice()
  var yScale = d3.time.scale().range([padding, height - padding]).domain(yDomain).nice()

  // create the axis
  var yAxis = d3.svg.axis().scale(yScale).orient('left')
  var xAxis = d3.svg.axis().scale(xScale).orient('bottom')
    .ticks(6)
    .tickFormat(function (d, i) {
        return ['0', '1', '2', '3', '4', '5', '6', '7'][d];
    });
  
 
  // Create the Axis for the graph.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, 20)")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("y", "-7")
      .attr("x", "250")
      .style("text-anchor", "left")
      .text("Baan");

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+ (left_pad - padding/2) + ",0)")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", height)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Tijd")

  // Add the data to the graph as ellipses.
  svg.selectAll(".dot")
      .data(DataSelection)
  .enter().append("ellipse")
    .attr("class", "dot")
    .attr("ry", 5)
    .attr("rx", function (d) { return d.radius*1.5; })
    .attr("cx", function(d) { return xScale(d.baan); })
    .attr("cy", function(d) { return yScale(d.startTijd); })
    .attr('pointer-events', 'all')
    .style("fill", "red")
    .on("mouseover", function(d){
    showCrewTooltip()
    })
    .on("mouseout", function(d){
      hideCrewTooltip()
    })
  eventlistener(results, weather_day, DataSelection, yDomain, yScale)
})
}

// Listen for mouse events.
function eventlistener(results, weather_day, DataSelection,yDomain,yScale){
  var tooltip = d3.select("#tooltip")
    .style("opacity", "0")
  var point = d3.selectAll(".dot")
    .on("mouseover", function(){
      var crew = d3.select(this)
      showCrewTooltip()
      updateCrewTooltip(DataSelection, crew, event);
    })
    .on("mouseout", function(){
      hideCrewTooltip()
    })

  // Get the mouse coördinates if mouse is moved on scatter plot
  var svg = d3.select("#scatter_results")
  svg.on('mousemove', function() {
    var coordinates = d3.mouse(this)
    var xsvg = coordinates[0]
    var ysvg = coordinates[1] - 10;

    // transform the coordinates to a time
    var mouseTime = yScale.invert(ysvg)

    // Use only the hours value of time for redirection of arrow.
    var timeslot = mouseTime.getHours()
    redirectArrow(timeslot,weather_day)
    
    var i = bisectDate(DataSelection, mouseTime)
    var d = mouseTime 

    updateHeatTooltip(i,d, DataSelection)
    mouseMoved()
  })
  svg.on("mouseleave", function(){
    mouseOut(event)
  })
  loadData();
}

/*
 * Rotates arrow in the compass to show hourly wind directions.
 */
function redirectArrow(timeslot,weather_day){
  for (var i = 0; i < weather_day.length; i++){
    var temp = weather_day[i]["Tijd"].trim()
    var svg = d3.select("#static_images").append("svg")
      .attr("id", "wind")
    // Get the width and height of the SVG to determine the middle.
    var width_wind = parseInt(svg.style("width"),10);
    var height_wind = parseInt(svg.style("height"),10);

    // Get the weather data from that hour.
    if (+temp === (+timeslot + 1)){
      var direction =+ weather_day[i]["Windrichting"].trim()
      var arrow = d3.select(".optionalArrow")
        .style("opacity", "1")
        .transition()
        .duration(500)
        .attr("transform", "rotate(" + direction + "," + width_wind/2 + "," + height_wind/2 + ")");

      // Get the strength and max strength for that hour of the day
      var strength = (+weather_day[i]["Windsnelheid"].trim())*0.1
      var maxStrength = (+weather_day[i]["Windstoot"].trim())*0.1

      var div = d3.select("#updateHour")
        .style("opacity", "1");
      div.html("Gemiddelde snelheid: <br>" + strength + " m/s <br> Hardste windstoot: <br>" + maxStrength + " m/s <br>") 

    }
  }
}

/*
 * Hide the tooltip and arrow showing hourly data when mouse is not on the scatterplot.
 */
function mouseOut(event){
  var div = d3.select("#tooltip")
    .style("opacity", "0")
  var arrow = d3.select(".optionalArrow")
    .style("opacity", "0")
  var div = d3.select("#updateHour")
    .style("opacity", "0");
}

// Make the tooltip for crew information visible
function showCrewTooltip(event){
  var div = d3.select("#crew_tooltip")
    .style("opacity", "1")
}
// Make the tooltip for crew information visible
function hideCrewTooltip(event){
  var div = d3.select("#crew_tooltip")
    .style("opacity", "0")
}

// Change content of Crew tooltip.
function updateCrewTooltip(day_results, crew, event){
  // Use the (in eventlistener) selected data point.
  var info = crew.node().__data__;
  var div = d3.select("#crew_tooltip")

  // Get all the variables for display in the tooltip.
  var tijd = info[1]
  var heat = info[2]
  var crewname = info[3]
  var lane = info[4]

  var pos500 = info[5]["results"]["500m"]["position"]
  var time500 = info[5]["results"]["500m"]["time"]
  
  var pos1000 = info[5]["results"]["1000m"]["position"]
  var time1000 = info[5]["results"]["1000m"]["time"]

  var pos1500 = info[5]["results"]["1500m"]["position"]
  var time1500 = info[5]["results"]["1500m"]["time"]

  var posFinish = info[5]["results"]["finish"]["position"]
  var timeFinish = info[5]["results"]["finish"]["time"]

  // Add the info to the tooltip
  var div = d3.select("#tooltipTitle")
  div.html(heat + "<br>") 
  var div = d3.select("#tijd_crew")
  div.html("Starttijd: " + tijd)  
  var div = d3.select("#ploeg_tooltip")
  div.html("Ploeg: " + crewname)
  var div = d3.select("#tussenstand_tooltip")
  div.html("<pre><br> 500m:  " + pos500 + "<br>"
    + "1000m:  " + pos1000 + "<br>"
    + "1500m:  " + pos1500 + "<br>"
    + "finish:  " + posFinish + "</pre>")
  var div = d3.select("#crewTooltipTijd")
  div.html("<br>" + time500 + "<br>" + time1000 + "<br>" + time1500 + "<br>" + timeFinish)
}

function mouseMoved(event){
  showTooltip(event)
  updateHeatTooltip(event)
}

// Set the opacity of the tooltip to 70%
function showTooltip(event){
  var div = d3.select("#tooltip")
    .style("opacity", "1")
}

// update the content of the tooltip for an entire heat.
function updateHeatTooltip(i,d,day_results){
    var heat = []
    var f = day_results[i]

    var starttijd = f.startTijd
    var field = f[2]

    // get all the data points in the same heat as f is.
    for (var x = 0; x < 6; x++) {
      if (i < 6){
        var temp = i + x;
        var ploeg_heat = day_results[temp]
        if (ploeg_heat[2] === field){
          addCrew(ploeg_heat, heat)
        }
      }
      else{
        var temp = i - x,
        temp2 = i + x;
        var ploeg_heat = day_results[temp]
        var ploeg2_heat = day_results[temp2]
        if (ploeg_heat[2] === field){
          addCrew(ploeg_heat, heat)
        }
        if (ploeg2_heat[2] === field){
          addCrew(ploeg2_heat, heat)
        }
      }
    }
    var baan = []
    for (var j = 0; j < heat.length; j++){
      var ploeg_overview = heat[j]
      
      // Get the time of the winning crew
      var position = ploeg_overview[5]["results"]["finish"]["position"]
      if (position == 1)
        var time = ploeg_overview[5]["results"]["finish"]["time"]
      
      //get the crewname for the appropriate lanes
      var lane = ploeg_overview[4]
      if (lane == 1)
        baan[0] = ploeg_overview[3]
      if (lane == 2)
        baan[1] = ploeg_overview[3]
      if (lane == 3)
        baan[2] = ploeg_overview[3]
      if (lane == 4)
        baan[3] = ploeg_overview[3]
      if (lane == 5)
        baan[4] = ploeg_overview[3]
      if (lane == 6)
        baan[5] = ploeg_overview[3]
      if (lane == 7)
        baan[6] = ploeg_overview[3]
      if (lane == 8)
        baan[7] = ploeg_overview[3]
    }

    
    // Set the crewname for a undefined crew in a lane to ----- for nicer display later on.
    for (var j = 0; j < 8; j++){
      var temp = baan[j]
      if (typeof temp == "undefined"){
        baan[j] = " ----- "
      }
    }
  
  // Add info the the actual tooltip 
  var div = d3.select("#veld_tooltip")
  div.html(field)
  var div = d3.select("#tijd_tooltip")
  div.html("<br>" + "Winnende tijd: " + "<strong>" + time + "</strong>" + "<br>")

  // Show the lane positioning of the crews.
  var div = d3.select("#banen_tooltip")
  div.html("<br>" + "Baan 1: " + baan[0] + "<br>"
    + "Baan 2: " + baan[1] + "<br>"
    + "Baan 3: " + baan[2] + "<br>"
    + "Baan 4: " + baan[3] + "<br>"
    + "Baan 5: " + baan[4] + "<br>"
    + "Baan 6: " + baan[5] + "<br>"
    + "Baan 7: " + baan[6] + "<br>"
    + "Baan 8: " + baan[7] + "<br>")
}

/*
 *  Helper functions 
 */
// Function to empty an array.
function clearArray(array){
  while(array.length > 0)
  array.pop()
  return array;
}

// Round to two decimals
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

// Functions to check wheater a crew belongs in a heat or not.
function crewExists(crewname, arr) {
  return arr.some(function(el) {
    return el.crewname === crewname;
  }) 
}
function addCrew(crewname, arr) {
  if (crewExists(crewname, arr)) {
    return false; 
  }
  arr.push(crewname)
  return true;
}