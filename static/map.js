function drawMap(boroughs, locations, svg) {
    var myColor = d3.scaleOrdinal(d3.schemeCategory20);
    console.log("map", myColor(1), myColor(2), myColor(3), myColor(4), myColor(5));
    var projection = d3.geoMercator() // mercator makes it easy to center on specific lat/long
        .scale(35000)
        .center([-73.6, 40.70]); // long, lat of NYC //[-73.94, 40.70]

    var pathGenerator = d3.geoPath()
        .projection(projection);

    svg.selectAll("path")
        .data(boroughs.features)
        .enter().append("path")
        .attr("class", "boroughs")
        .attr("d", pathGenerator);

    var addPointsToMap = function (locations) {
        var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
            

        var Tooltip = d3.select("body")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        var showTooltip = function (d) {
            Tooltip
                .style("opacity", 1)
            d3.select(this)

        };
        var moveTooltip = function (d) {
            Tooltip
                .html(d["HotelName"])
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        };
        var hideTooltip = function (d) {
            Tooltip
                .style("opacity", 0)
            d3.select(this)
        };


        var circles = svg.selectAll("circle")
            .data(locations)
            .enter().append("circle")
            .attr("fill", function (d) {
                // console.log("mapCircles", d, d["BoroughId"], myColor(d["BoroughId"]));
                return myColor(d.BoroughId);
            })
            .attr("cx", function (d) {
                return projection([+d.longitude, +d.latitude])[0];
            })
            .attr("cy", function (d) {
                return projection([+d.longitude, +d.latitude])[1];
            })
            .attr("SampleId", function (d) {
                return d.SampleId;
            })
            .attr("PercentTested", function (d) {
                return d["Percent Tested"];
            })
            .attr("BoroughId", function (d) {
                return d.BoroughId;
            })
            .attr("class", "brushed")  //original color
            .attr("r", 3.4)
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip);

        addLegend(colorScale);

        return circles;
    };

    var addLegend = function (colorScale) {
        console.log("addLegend");
        var legendMarginTop = 50,
            legendMarginLeft = -175,
            legendWidth = 250,
            legendHeight = 150;

        var legend = svg.append('g')
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr("transform", "translate(" + legendMarginLeft + "," + legendMarginTop + ")");

        var legends = legend.selectAll(".legend")
            .data(myColor.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        console.log("draw legend colored rectangles");
        // draw legend colored rectangles
        legends.append("rect")
            .attr("x", legendWidth + 80)
            .attr("y", 35)
            .attr("width", 18)
            .attr("height", 18)
            .attr("rx", 4) // Add this line
            .attr("ry", 4) // Add this line
            .style("fill", colorScale);

        // draw legend text
        legends.append("text")
            .attr("x", legendWidth + 70)
            .attr("y", 44)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .style("fill","black")
            // .style("fill", "white")
            .text(function (d) {
                if (d === 1) {
                    return "Manhattan";
                } else if (d === 2) {
                    return "Brooklyn";
                } else if (d === 3) {
                    return "Bronx";
                } else if (d === 4) {
                    return "Queens";
                } else if (d === 5) {
                    return "Staten Island";
                }
            })
            .style("font-size", "16px")
            .style("font-family","Times New Roman")
            .style("font-weight","bold")
            .style("fill", "black");
    };

    var circles = addPointsToMap(locations);

    var addTitle = function (titleText) {
        var titleMarginTop = 35,
            titleMarginLeft = 220;

        var title = svg.append("text")
            .attr("class", "map-title")
            .attr("x", 0)
            .attr("y", 0 + titleMarginTop)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .style("font-family","Times New Roman")
            .style("font-weight","bold")
            .style("fill", "#000001")
            .attr("transform", "translate(" + titleMarginLeft + ", 0)")
            .text(titleText);
    };

    addTitle("New York City Map");

    return [svg, circles];
}