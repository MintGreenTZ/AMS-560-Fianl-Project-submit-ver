function drawParallelCoordinates(data, dimensions) {
    console.log(data);
    var height = parallelCoordsHeight;
    var myColor = d3.scaleOrdinal(d3.schemeCategory20);
    console.log("ParallelCoordinates", myColor(1), myColor(2), myColor(3), myColor(4), myColor(5));
    var tension = 0.5;

    var svg = d3
        .select("#PCP")
        .append("svg")
        .attr("width", parallelCoordsWidth)
        .attr("height", height + margin.top + margin.bottom)
        .style("float", "left")
        .append("g")
        .attr("transform", "translate(" + 10 + "," + (margin.top + 30) + ")");

    var tensionSlider = d3.select("#PCP")
        .append("input")
        .attr("type", "range")
        .attr("min", "0")
        .attr("max", "1")
        .attr("step", "0.01")
        .attr("value", tension)
        .style("display", "block")
        .style("position", "absolute")
        .style("left", "585px")
        .style("top", "330px")
        .style("margin", "20px auto")
        .on("input", function () {
            // Update tension value
            tension = parseFloat(this.value);

            // Update line generator with new tension value
            line = d3.line().curve(d3.curveCardinal.tension(tension));

            // Update paths with new line generator
            foreground.attr("d", path);
            background.attr("d", path);
        });


    d3.select("#PCP")
        .append("div")
        .style("position", "absolute")
        .style("left", "525px")
        .style("top", "345px")
        .attr("type", "range")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("margin", "0 auto")
        .append("span")
        .text("Tension")
        .style("font-size", "16px")
        .style("font-family", "Times New Roman")
        .style("font-weight", "bold")
        .style("margin-right", "5px");

    d3.select("#PCP")
        .append("div")
        .style("position", "absolute")
        .style("left", "590px")
        .style("top", "355px")
        .attr("type", "range")
        .style("text-align", "center")
        .style("margin", "5px auto")
        .append("span")
        .text("0" + " " +  "1")
        .style("font-size", "16px")
        .style("font-family", "Times New Roman")
        .style("font-weight", "bold")
        .style("letter-spacing", "50px");


    svg
        .append("text")
        .attr("x", (parallelCoordsWidth - margin.right - margin.left) / 2 - 60)
        .attr("y", -50)
        .text("Parallel Coordinates Plot")
        .style("font-size", "20px")
        .style("font-family","Times New Roman")
        .style("font-weight","bold")
        .style("fill", "#000001");

    var x = d3.scaleBand().rangeRound([0, parallelCoordsWidth]).padding(1),
        y = {},
        dragging = {};


    var line = d3.line().curve(d3.curveCardinal.tension(tension)),
        background,
        foreground;

    var quant_p = function (v) {
        return (parseFloat(v) == v) || (v == "")
    };

    x.domain(dimensions);

    dimensions.forEach(function (d) {
        var vals = data.map(function (p) {
            return p[d];
        });
        if (vals.every(quant_p)) {
            y[d] = d3.scaleLinear()
                .domain(d3.extent(data, function (p) {
                    return +p[d];
                }))
                .range([height, 0])
        } else {
            y[d] = d3.scalePoint()
                .domain(vals.filter(function (v, i) {
                    return vals.indexOf(v) == i;
                }))
                .range([height, 0], 1);
        }
    });

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path)
        .attr("SampleId", function (d) {
            return d["SampleId"];
        })
        .attr("Price", function (d) {
            return d["Price"];
        })
        .attr("BoroughId", function (d) {
            return d["color"];
        })
        .style("stroke", function (d) {
            return myColor(d["color"]);
        });

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) {
            return "translate(" + x(d) + ")";
        })
        .call(d3.drag()
            .subject(function (d) {
                return {x: x(d)};
            })
            .on("start", function (d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function (d) {
                dragging[d] = Math.min(parallelCoordsWidth, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function (a, b) {
                    return position(a) - position(b);
                });
                x.domain(dimensions);
                g.attr("transform", function (d) {
                    return "translate(" + position(d) + ")";
                })
            })
            .on("end", function (d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }));

        g.append("g")
        .attr("class", "axis")
        .each(function (d, i) {
            d3.select(this).call(d3.axisLeft(y[d]))
            .selectAll("text")
            .attr("transform", i >= dimensions.length - 4 ? "translate(" + 35 + ",0)" : null)
            .style("font-weight","bold")
            .style("font-size", "14px")
            .style("font-family", "Times New Roman");
        })
        //text does not show up because previous line breaks somehow
        .append("text")
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .attr("y", function (d, i) {
            return -19;
        })
        .text(function (d) {
            return d;
        })
        .style("font-size", "16px")
        .style("font-family", "Times New Roman")
        .style("font-weight", "bold");

    return [g, y, foreground];

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

// Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function (p) {
            return [position(p), y[p](d[p])];
        }));
    }
}