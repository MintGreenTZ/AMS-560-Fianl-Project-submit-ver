var colors =  ['#000000','#FF0000','#00FF00','#0000FF','#FFFF00','#00FFFF','#FF00FF',
                '#A52A2A', '#000080', '#008080', '#808000'];

var features = ["accommodates", "bathrooms_text", "bedrooms", "availability_30",
                "availability_365", "review_rating", "review_cleanliness",
                "review_communication", "review_location",  "review_value",
                "reviews_per_month"];


var drawBiPlot = function(fdata, adata){
    console.log(fdata)
    console.log(adata)
    var svg = d3.select("#biplot")
        .append("svg")
        .attr("width",  biplotwidth + margin.left + margin.right)
        .attr("height", biplotheight + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + (margin.left + 15) + "," + (margin.top) + ")");
    
    var title = svg.append("text")
        .attr("transform", "translate(0,-90)")
        .attr("x", 40)
        .attr("y", 80)
        .attr("font-size", "20px")
        .attr("font-family","Times New Roman")
        .attr("stroke","black")
        .text("Biplot of Price");

    var x = d3.scaleLinear().range([0, biplotwidth]).domain(d3.extent(fdata, function(d){ return +d.x;}));
    var y = d3.scaleLinear().range([biplotheight, 0]).domain(d3.extent(fdata, function(d){ return +d.y;}));
    

    var x_axis = svg.append("g")
                        .attr("transform", "translate(0," + biplotheight + ")")
                        .call(d3.axisBottom(x)); 

    var x_text = svg.append("g")
        .attr("transform", "translate(0," + biplotheight + ")");
    x_text.append("text")
        .attr("y", 10)
        .attr("x", 355)
        .attr("text-anchor", "end")
        .attr("fill","black")
        .attr("font-weight","bold")
        .attr("font-size","12px")
        .text("PCA1");              
    


    var y_axis = svg.append("g")
        .call(d3.axisLeft(y));

    var y_text = svg.append("g")
                        .attr("transform", "translate(20,40)")
    y_text.append("text")
            .attr("x",0)
            .attr("y", 10)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .attr("fill","black")
            .attr("font-weight","bold")
            .attr("font-size","12px")
            .text("PCA2");
    
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    
    var scatters = svg.selectAll(".circle")
                        .data(fdata)
                        .style("fill", function(d) { return color(d.label); });
                            
    scatters.enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function(d){return x(+d.x)})
            .attr("cy", function(d){return y(+d.y)})
            .attr("r", 3)
            .style("fill", function(d) { return color(d.label); });
    
    //create svg arrow
    
    var arrows = svg.append("svg:defs").append("svg:marker")
                                        .attr("id", "triangle")
                                        .attr("refX", 6)
                                        .attr("refY", 6)
                                        .attr("markerWidth", 30)
                                        .attr("markerHeight", 30)
                                        .attr("orient", "auto")
                                        .append("path")
                                        .attr("d", "M 0 0 12 6 0 12 3 6")
                                        .style("fill","black");

    // Add feature axes
    var vectors = svg.selectAll("vector")
                        .data(adata)
                        .enter()
                        .append("line")
                        .attr("x1",x(0))
                        .attr("y1",y(0))
                        .attr("x2",function(d){ return x(+d.x * biplotScaleFactor);})
                        .attr("y2", function(d){ return y(+d.y * biplotScaleFactor);})
                        .attr("stroke-width", 1.3)
                        .attr("stroke", function(d,i){return colors[i];})
                        .attr("marker-end", "url(#triangle)");
    // Add legend
    var vecText = svg.selectAll(".vecText")
                        .data(adata)
                        .enter()
                        .append("g")
                        .append("text")
                        .attr("x","240")
                        .attr("y", function(d,i){ return -20 + i*18;})
                        .attr("text-anchor", "begin")
                        .attr("fill","black")
                        .attr("font-size","12px")
                        .attr("stroke","black")
                        .attr("stroke-width",".5px")
                        .text(function(d,i){  return features[i];});
    var circleColor = svg.selectAll(".circleColor")
                        .data(adata)
                        .enter()
                        .append("g")
                        .append("circle")
                        .attr("cx","232")
                        .attr("cy", function(d,i){ return -25 + i*18;})
                        .attr("r",7)
                        .attr("fill", (d,i) => colors[i]);


};