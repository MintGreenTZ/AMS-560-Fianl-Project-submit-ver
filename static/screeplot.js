function drawScreeplot(data) {
    var svg = d3.select("#screeplot")
                .append("svg")
                .attr("width",  screeplotwidth + margin.left + margin.right)
                .attr("height", screeplotheight + margin.top + margin.bottom);
                
    var title = svg.append("text")
                .attr("transform", "translate(-50,0)")
                .attr("x", 200)
                .attr("y", 20)
                .attr("font-size", "20px")
                .attr("font-family","Times New Roman")
                .attr("stroke","black")
                .text("Scree Plot");

    var canvas = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand().range([0, screeplotwidth]).padding(0.4),
        y = d3.scaleLinear().range([screeplotheight, 0]);
    console.log(data)
    x.domain(data.map(function(d,i) { return (i+1); }));
    y.domain([0, 1]);
    canvas.append("g")
            .attr("transform", "translate(0," + screeplotheight + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("y", 35)
            .attr("x", 210)
            .attr("text-anchor", "end")
            .attr("fill","black")
            .attr("font-weight","bold")
            .attr("font-size","12px")
            .text("Principal Component");
    canvas.append("g")
            .call(d3.axisLeft(y).tickFormat(d3.format(",.0%")))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("x", -100)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .attr("fill","black")
            .attr("font-weight","bold")
            .attr("font-size","12px")
            .text("Variance Explained(%)");
    canvas.append("g")
            .attr("transform", "translate(" + screeplotwidth + ",0)")
            .call(d3.axisRight(y).tickFormat(d3.format(",.0%")));


    canvas.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) { return x(i+1); })
            .attr("y", function(d) { return y( (+d.eigen_values) / 10 ); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return screeplotheight - y((+d.eigen_values) / 10); });
    canvas.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#ffab00")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                            .x(function(d, i) { return x(i+1) + x.bandwidth()/2 })
                            .y(function(d) { return y(d.explained_ratio_cum) })
            );

}