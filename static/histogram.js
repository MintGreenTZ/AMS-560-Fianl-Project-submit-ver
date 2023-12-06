function drawHistogram(data) {
    var svg = d3
        .select("#histogram")
        .append("svg")
        .attr("width", histowidth)
        .attr("height", histoheight)
        .append("g")
        .attr("transform", "translate(" + 10 + "," + 5 + ")");

    var allGroup = d3.map(data, function (d) {
        return (d.BoroughId)
    }).keys();

    function getBoroughFromId(id) {
        if (id == 1) {
            return "Manhattan";
        } else if (id == 2) {
            return "Brooklyn";
        } else if (id == 3) {
            return "Bronx";
        } else if (id == 4) {
            return "Queens";
        } else {
            return "Staten Island";
        }
    }

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) {
            return getBoroughFromId(d);
        }) // text showed in the menu
        .attr("value", function (d) {
            return d;
        }); // corresponding value returned by the button

    var x = d3.scaleLinear()
        .domain([20, 440])
        .range([margin.left, histowidth - margin.right]);

    var y = d3.scaleLinear()
        .domain([0, 40])
        .range([histoheight - margin.bottom, margin.top]);

    // Add X axis with arrow marker
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + (histoheight - margin.bottom) + ")")
        .call(d3.axisBottom(x).tickFormat(function (d) {
            return d3.format("")(d)
        }).tickValues(x.ticks().filter(function(d) { return d !== 0; }))); // Exclude the 0 tick value

    xAxis.select(".domain").style("stroke-opacity", "0");

    xAxis.selectAll("text")
        .style("font-size", "12px")
        .style("font-weight","bold")
        .style("font-family", "Times New Roman");

    xAxis.append("defs")
        .append("marker")
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

    // Add X axis line with arrow marker
    svg.append("g")
        .attr("transform", "translate(0," + (histoheight - margin.bottom) + ")")
        .append("path")
        .attr("d", "M" + margin.left + ",0.5H" + (histowidth - margin.right + 10))
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");

    // Add X axis label
    svg.append("text")
        .attr("x", (histowidth / 2) + margin.left - 40)
        .attr("y", histoheight - margin.bottom / 2 + 10)
        .text("Price Range")
        .style("font-size", "16px")
        .style("font-family", "Times New Roman")
        .style("font-weight","bold")
        .style("text-anchor", "middle");

    // Add Y axis with arrow marker
    var yAxis = svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y).tickFormat(function (d) {
            return d3.format("")(d)
        }).tickValues(y.ticks().filter(function(d) { return d !== 0; }))); // Exclude the 0 tick value

    yAxis.select(".domain").style("stroke-opacity", "0"); // Hide the Y-axis path element

    yAxis.selectAll("text")
        .style("font-size", "12px")
        .style("font-weight","bold")
        .style("font-family", "Times New Roman");

    yAxis.append("defs")
        .append("marker")
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
        .attr("transform", "translate(" + margin.left + ",0)")
        .append("path")
        .attr("d", "M0.5," + (histoheight - margin.bottom) + "V" + (margin.top - 20))
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("marker-end", "url(#arrowY)");


    // Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -histoheight / 2)
        .attr("y", margin.left / 2 - 5)
        .text("Frequency")
        .style("font-size", "16px")
        .style("font-family", "Times New Roman")
        .style("font-weight","bold")
        .style("text-anchor", "middle");

    // Add chart title
    svg.append("text")
        .attr("x", (histowidth / 2))
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .text("Histogram of Prices")
        .style("font-size", "20px")
        .style("font-family", "Times New Roman")
        .style("font-weight","bold")
        .style("fill", "#000001");
        

    var n = data.length,
        bins = d3.histogram().domain(x.domain()).thresholds(40)(data
            .filter(function (d) {
                return true;
            })
            .map(function (d) {
                return +d["Price"];
            })),
        density = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))(data
            .filter(function (d) {
                return true;
            })
            .map(function (d) {
                return +d["Price"];
            }));

    var rects = svg.insert("g", "*")
        .attr("fill", "#bbb")
        .selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("class", "bars")
        .attr("fill", "#008b8b")
        .attr("x", function (d) {
            return x(d.x0) + 1;
        })
        .attr("y", function (d) {
            return y(d.length);
        })
        .attr("width", function (d) {
            return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function (d) {
            return y(0) - y(d.length);
        });

    histoX = x;
    histoY = y;

    return [rects, svg];
}