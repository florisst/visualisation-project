window.onload = function(){
  loadData()
}


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


function page(error, data_array){
  var wes = document.getElementById("selectWes")
  wes.addEventListener("click", function(){
    loadData()
    graph = d3.select("#container_scatter")
      .style("opacity", "0")
    info = d3.select(".infobox")
      .style("opacity", "1")
    var p = d3.select("#wedstrijd")
    p.html("Westelijke 2015")
    var p = d3.select("#dag")
    p.html("gekozen dag")
    var p = d3.select("#soort_wedstrijd")
    p.html("soort wedstrijd gekozen")
    console.log("westelijke2015")
    wesRes = data_array[0]
    wesWea = data_array[1]
    console.log("lengte resultaten")
    console.log(wesRes.length)
    selectDay(wesRes,wesWea)
  },true)
  var dam15 = document.getElementById("selecDam15")
  dam15.addEventListener("click", function(){
    loadData()
    graph = d3.select("#container_scatter")
      .style("opacity", "0")
    info = d3.select(".infobox")
      .style("opacity", "1")
    var p = d3.select("#wedstrijd")
    p.html("Damen 2015")
    console.log("damen2015")
    var p = d3.select("#dag")
    p.html("gekozen dag")
    var p = d3.select("#soort_wedstrijd")
    p.html("soort wedstrijd gekozen")
    d15Res = data_array[2]
    d15Wea = data_array[3]
    console.log(d15Res.length)
    selectDay(d15Res,d15Wea)
  },false)
  var dam14 = document.getElementById("selecDam14")
  dam14.addEventListener("click", function(){
    loadData()
    graph = d3.select("#container_scatter")
      .style("opacity", "0")
    info = d3.select(".infobox")
      .style("opacity", "1")
    var p = d3.select("#wedstrijd")
    p.html("Damen 2014")
    var p = d3.select("#dag")
    p.html("gekozen dag")
    var p = d3.select("#soort_wedstrijd")
    p.html("soort wedstrijd gekozen")
    console.log("damen2014")
    d14Res = data_array[4]
    d14Wea = data_array[5]
    console.log(d14Res.length)
    selectDay(d14Res,d14Wea)
  },false)
}

// Select subset of data depending on menu clicked.  
function selectDay(results, weather){
  console.log("welke dag?")
  sat = document.getElementById("zaterdag_select")
  sat.addEventListener("click", function(){
    var p = d3.select("#dag")
    p.html("Zaterdag")  
    //clearWind()
    weather_day = []
    saturday(results, weather, weather_day)
  },false)
  sund = document.getElementById("zondag_select")
  sund.addEventListener("click", function(){
    var p = d3.select("#dag")
    p.html("Zondag")  
    //clearWind();
    weather_day = []
    sunday(results, weather, weather_day)
  },false)
}


// Only select those heats that where rowed on Saturday 
function saturday (results, weather, weather_day){
  console.log("zaterdag")
  if (typeof(day_results) !== 'undefined') {
    clearArray(day_results)
  }
  weather_day = []
  for (var i = 0; i < (weather.length/2); i++){
    weather_day.push(weather[i])
  }
  day_results = []
  results.forEach(function(d) {
    i++;
    d.temp = d[0]
    if (d.temp == "za" || d.temp == "za "){
        day_results.push(d)
      }
    })
  //clearArray(results)

  clearSVG()
  initialise()
    //clearArray(results)
  drawWindDirection(weather, weather_day)
  selectType(results, day_results, weather_day, weather)
    
    //drawScatter(day_results, weather)
}

// Only select those heats that where rowed on Sunday 
function sunday (results, weather, weather_day){
  console.log("Zondag")
  if (typeof(day_results) !== 'undefined') {
    clearArray(day_results)
  }
  weather_day = []
  for (var i = 0; i < (weather.length/2); i++){
    weather_day.push(weather[13+i])
  }
  day_results = []
  results.forEach(function(d) {
    d.temp = d[0]
    if (d.temp == "zo" || d.temp == "zo "){
      day_results.push(d)
    }
  })
  //clearArray(results)
  clearSVG()
  initialise()
    //clearArray(results)
  drawWindDirection(weather, weather_day)
  selectType(results, day_results, weather_day, weather)
    //drawScatter(day_results, weather)
}

function initialise(){
  clearSVG()
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 800 - margin.left - margin.right,
  height = 3000  - margin.top - margin.bottom;
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
  rem.remove()
  var rem = d3.select("#scatter_results").select("g")
  rem.remove()
}

// Clear the wind arrow SVG.
function clearWind(){
  svg = d3.select("#wind")
  svg.remove()
}


function selectType(results, day_results, weather_day, weather){
  clearSVG()
  initialise()
  console.log("type?")
  clearArray(results)
  DataSelection = []
  clearArray(DataSelection)
  DataSelection = []
  vw = document.getElementById("select_voorwedstrijd")
  vw.addEventListener("click", function(){
    var p = d3.select("#soort_wedstrijd")
    p.html("Voorwedstrijden")
    initialise()
    DataSelection = []
    clearArray(DataSelection)
    d3.json(day_results, function() {
    day_results.forEach(function(d) {
      temp = d[2].slice(-6)
      if (temp !== "finale"){
        DataSelection.push(d)
      }
      })
    drawScatter(DataSelection, day_results, weather_day, weather)
  },true)
  })
  finale = document.getElementById("select_finales")
  finale.addEventListener("click", function(){
    var p = d3.select("#soort_wedstrijd")
    p.html("Finales")
    initialise()
    DataSelection = []
    clearArray(DataSelection)
    d3.json(day_results, function() {
    day_results.forEach(function(d) {
      temp = d[2].slice(-6)
      if (temp === "finale"){
        DataSelection.push(d)
      }
      })
    drawScatter(DataSelection, day_results, weather_day, weather)
  },true)
  })
  both = document.getElementById("select-beide")
  both.addEventListener("click", function(){
    var p = d3.select("#soort_wedstrijd")
    p.html("Voorwedstrijden & Finales")
    initialise()
    DataSelection = []
    clearArray(DataSelection)
    d3.json(day_results, function() {
    day_results.forEach(function(d) {
      DataSelection.push(d)
    })
    console.log(DataSelection.length)
    drawScatter(DataSelection, day_results, weather_day, weather)
  },true)
  })
}



// Draw the wind direction and update the wind div.
function drawWindDirection(weather,weather_day){
  clearWind()
  compass = d3.select("#compass")
    .style("opacity", "0")
  svg = d3.select("#static_images").append("svg")
    .attr("id", "wind")
  // Get the width and height of the SVG to determine the middle.
  width_wind = parseInt(svg.style("width"),10);
  height_wind = parseInt(svg.style("height"),10);

  svg.append("image")
    .attr("id", "comp")
    .attr("xlink:href", "images/compass.png")
    .attr("width", width_wind)
    .attr("height", height_wind)

  var sum_direction = 0,
  sum_strength = 0,
  sum_maxStrength = 0;
  strengthMax = 0;
  for (var i = 0; i < weather_day.length; i++){
    temp = weather_day[i]
    direction = temp["Windrichting"].trim()
    sum_direction += parseInt(direction,10)
    strength = temp["Windsnelheid"].trim()
    sum_strength += parseInt(strength,10)
    maxStrength = temp["Windstoot"].trim()
    if (maxStrength > strengthMax){
      strengthMax = maxStrength*0.1
    }
    sum_maxStrength += parseInt(maxStrength,10)
  }
  var avrDirection = ((sum_direction % 360)/weather_day.length),
  avrStrength = (sum_strength/weather_day.length)
  avrMaxStrength = (sum_maxStrength/weather_day.length)
  avrStrength = roundToTwo(avrStrength*0.1)

  // Define and rotate the main arrow depending on the average wind direction.
  g = svg.append("g")
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
  div = d3.select("#infoUpdate")
  div.html("Gemiddelde snelheid: <br>" + avrStrength + " m/s <br> Hardste windstoot: <br>" + strengthMax + " m/s <br>")
  
  // A second arrow is used to show hourly wind directions and is defined here. Rotation is done in redirectArrow.
  optionalArrow = svg.append("g")
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
function drawScatter(DataSelection, day_results, weather_day, weather){
  // Set properties of SVG like width, height.
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 800 - margin.left - margin.right,
  height = 3000  - margin.top - margin.bottom;
  var padding = 50;
  var left_pad = 100;
  graph = d3.select("#container_scatter")
    .style("opacity", "1")
  info = d3.select(".infobox")
    .style("opacity", "0")

  var svg = d3.select("#scatter_results").append("g")
  //  .attr("transform", "rotate(90," + width/2 + "," + height/2 + ")")
  // reach the data with d3.
  var parseTime = d3.time.format("%H:%M").parse
  d3.json(DataSelection, function() {
    DataSelection.forEach(function(d) {
    d.baan = +d[4]
    d.startTijd = parseTime(d[1])
    
    d.crew = d[5]
    d.finishtime = d.crew["results"]["finish"]["time"]
    d.finishPos = +d.crew["results"]["finish"]["position"]
    d.radius = 20-3*d.finishPos
    })

  var xDomain = d3.extent(DataSelection, function(d) { return d.baan; })
  var yDomain = d3.extent(DataSelection, function(d) { return d.startTijd; })

  var xScale = d3.scale.linear().range([left_pad, width - padding*2]).domain(xDomain)
  var yScale = d3.time.scale().range([padding, height - padding]).domain(yDomain)


  var yAxis = d3.svg.axis().scale(yScale).orient('left')
  var xAxis = d3.svg.axis().scale(xScale).orient('bottom')
    .ticks(6)
    .tickFormat(function (d, i) {
        return ['0', '1', '2', '3', '4', '5', '6', '7'][d];
    });
 
  // Create the Axis for the graph.
  svg.append("g")
      .attr("class", "x axis")
      //.attr("transform", "translate(0," + (-height) + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("y", -6)
      .style("text-anchor", "end")
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

  svg.selectAll(".dot")
      .data(DataSelection)
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
    showCrewTooltip()
    })
    .on("mouseout", function(d){
      hideCrewTooltip()
    })
  eventlistener(weather_day)
})
}

// Listen for mouse events.
var bisectDate = d3.bisector(function(d) { return d.startTijd; }).left;
function eventlistener(weather_day){
  tooltip = d3.select("#tooltip")
    .style("opacity", "0")
  point = d3.selectAll(".dot")
    .on("mouseover", function(){
      crew = d3.select(this)
      showCrewTooltip()
      updateCrewTooltip(DataSelection, crew, event);
    })
    .on("mouseout", function(){
      hideCrewTooltip()
    })

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 800 - margin.left - margin.right,
  height = 3000  - margin.top - margin.bottom;
  var padding = 50;
  var left_pad = 100;
  var xDomain = d3.extent(DataSelection, function(d) { return d.baan; });
  var yDomain = d3.extent(DataSelection, function(d) { return d.startTijd; })

  var xScale = d3.scale.linear().range([padding, width - padding]).domain(xDomain);
  var yScale = d3.time.scale().range([padding, height - padding]).domain(yDomain);

  // Get the mouse coördinates if mouse is moved on scatter plot
  var svg = d3.select("#scatter_results")
  svg.on('mousemove', function() {
    coordinates = d3.mouse(this)
    var xsvg = coordinates[0]
    var ysvg = coordinates[1]

    // transform the coordinates to a time
    var mouseTime = yScale.invert(ysvg),
    i = bisectDate(DataSelection, mouseTime)
    if (undefined !== i){
      updateHeatTooltip(i, DataSelection)
    }
    // Use only the hours value of time for redirection of arrow.
    timeslot = mouseTime.getHours()
    redirectArrow(timeslot,weather_day)
    mouseMoved()
  })
  svg.on("mouseleave", function(){
    mouseOut(event)
  })
}

// Rotates arrow in the compass to show hourly wind directions.
function redirectArrow(timeslot,weather_day){
  for (var i = 0; i < weather_day.length; i++){
    temp = weather_day[i]["Tijd"].trim()
    if (+temp === (+timeslot + 1)){
      direction = +weather_day[i]["Windrichting"].trim()
      arrow = d3.select(".optionalArrow")
        .style("opacity", "1")
        .transition()
        .duration(500)
        .attr("transform", "rotate(" + direction + "," + width_wind/2 + "," + height_wind/2 + ")");

      // Get the strength and max strength for that hour of the day
      var strength = (+weather_day[i]["Windsnelheid"].trim())*0.1
      var maxStrength = (+weather_day[i]["Windstoot"].trim())*0.1

      div = d3.select("#updateHour")
        .style("opacity", "1");
      div.html("Gemiddelde snelheid: <br>" + strength + " m/s <br> Hardste windstoot: <br>" + maxStrength + " m/s <br>") 

    }
  }
}

// Hide the tooltip and arrow showing hourly data when mouse is not on the scatterplot.
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
    .style("opacity", "0.7")
}
// Make the tooltip for crew information visible
function hideCrewTooltip(event){
  var div = d3.select("#crew_tooltip")
    .style("opacity", "0")
}

// Change content of Crew tooltip.
function updateCrewTooltip(day_results, crew, event){
  console.log("updateCrewTooltip")
  // Use the (in eventlistener) selected data point.
  info = crew.node().__data__;
  var div = d3.select("#crew_tooltip")

  // Get all the variables for display in the tooltip.
  tijd = info[1]
  crewname = info[3]
  lane = info[4]

  pos500 = info[5]["results"]["500m"]["position"]
  time500 = info[5]["results"]["500m"]["time"]
  
  pos1000 = info[5]["results"]["1000m"]["position"]
  time1000 = info[5]["results"]["1000m"]["time"]

  pos1500 = info[5]["results"]["1500m"]["position"]
  time1500 = info[5]["results"]["1500m"]["time"]

  posFinish = info[5]["results"]["finish"]["position"]
  timeFinish = info[5]["results"]["finish"]["time"]

  // Add the info to the tooltip
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
    .style("opacity", "0.7")
}

// update the content of the tooltip for an entire heat.
function updateHeatTooltip(i,day_results){
    heat = []
    d = DataSelection[i]
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
    baan = []
    for (var j = 0; j < heat.length; j++){
      ploeg_overview = heat[j]
      // Get the time of the winning crew
      position = ploeg_overview[5]["results"]["finish"]["position"]
      if (position == 1)
        var time = ploeg_overview[5]["results"]["finish"]["time"]
      //get the crewname for the appropriate lanes
      lane = ploeg_overview[4]
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
      temp = baan[j]
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