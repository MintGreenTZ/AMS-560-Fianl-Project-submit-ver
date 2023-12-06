function drawBarChart(data) {
    data["columns"] = ["borough", "Average Price", "BoroughId"];
    var myColor = d3.scaleOrdinal(d3.schemeCategory20);
    console.log("barchart", myColor(1), myColor(2), myColor(3), myColor(4), myColor(5));
    var svg = d3
      .select("#barchart")
      .append("svg")
      .attr("width", barchartwidth + margin.left + margin.right)
      .attr("height", barchartheight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + (margin.left+40) + "," + (margin.top - 5) + ")");
  
    // Parse the Data
    var subgroups = data.columns.slice(1,2);
    var boroughs = d3
      .map(data, function (d) {
        return d.borough;
      })
      .keys();


    // Add X axis
    var x = d3.scaleBand().domain(boroughs).range([0, barchartwidth * 0.9]).padding([0.2]);
    var xAxis = d3.axisBottom(x).tickSize(0);

    // Define an arrow marker for the X axis
    svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 5)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "black");

    // Add arrow marker to the X axis
    var xAxisGroup = svg
        .append("g")
        .attr("transform", "translate(-5," + (barchartheight) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", x.bandwidth() / 2 - 15)
        .style("font-family", "Times New Roman")
        .style("font-weight","bold")
        .style("font-size", "14px");

    // Add X axis line with arrow marker
    svg.append("g")
        .attr("transform", "translate(-5," + barchartheight + ")")
        .append("path")
        .attr("d", "M0,0.5H" + barchartwidth)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");
  
    svg.append("text")
    .attr("x", barchartwidth/2 - 45)
    .attr("y", barchartheight + 35)
    .text("Borough")
    .style("font-size", "16px")
    .style("font-family","Times New Roman")
    .style("font-weight","bold")
    .style("fill", "black");


    // Add Y axis
    var y = d3.scaleLinear().domain([0, 200]).range([barchartheight, 0]);
    var yAxis = d3.axisLeft(y).tickSize(-5);
    svg.append("g")
    .call(yAxis)
    .selectAll("text")
    .style("font-family", "Times New Roman")
    .style("font-weight","bold")
    .style("font-size", "14px");

    // Define an arrow marker for the Y axis
    svg.append("defs").append("marker")
      .attr("id", "arrowY")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "black");

    // Add Y axis line with arrow marker
    svg.append("g")
      .append("path")
      .attr("d", "M0.5," + barchartheight + "V-15")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .attr("marker-end", "url(#arrowY)");
  
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(barchartheight / 2) - 90)
    .attr("y", - 40)
    .text("Average Price (Dollar)")
    .style("font-size", "16px")
    .style("font-family","Times New Roman")
    .style("font-weight","bold")
    .style("fill", "black");
  
    // Another scale for subgroup position
    var xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);
  
    // title
    svg
    .append("text")
    .attr("x", barchartwidth / 2 - 125)
    .attr("y", -10)
    .text("Average Price By Borough")
    .style("font-size", "20px")
    .style("font-family","Times New Roman")
    .style("font-weight","bold")
    .style("fill", "#000001");

    // Show the bars
    var rects = svg
      .append("g")
      .selectAll("g")
      // Enter in data = loop group per group
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + x(d.borough) + ",0)";
      })
      .style("fill", function (d) {
        // console.log("barchart", d, d["BoroughId"], myColor(d["BoroughId"]), myColor[1], myColor[2], myColor[3], myColor[4], myColor[5]);
        return myColor(d["BoroughId"]);
      })
      .selectAll("rect")
      .data(function (d) {
        return subgroups.map(function (key) {
          return { key: key, value: d[key], BoroughId: d["BoroughId"] };
        });
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xSubgroup(d.key);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function (d) {
        return barchartheight - y(d.value);
      });
  
    return [rects];
  }