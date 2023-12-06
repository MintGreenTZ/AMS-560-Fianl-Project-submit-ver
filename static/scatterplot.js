function drawscatterplot(data) {
    var myColor = d3.scaleOrdinal(d3.schemeCategory20);
    console.log("scatter", myColor(1), myColor(2), myColor(3), myColor(4), myColor(5));
    width  = scatterwidth - margin.left - margin.right,
    height = scatterheight - margin.top  - margin.bottom;

    var rating_variable = ["Rating", "Accu", "Clean", "Check", "Commun", "Loc"]
    var availability_variable = ["Avai M", "Avai BM", "Avai S", "Avai Y"]

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var my_svg = d3.select("#scatterplot")
                    .append("svg")
                    .attr("width",  width  + margin.left + margin.right)
                    .attr("height", height + margin.top  + margin.bottom);

    var title = my_svg.append("text")
                    .attr("transform", "translate(-100,0)")
                    .attr("x", 190)
                    .attr("y", 30)
                    .attr("font-size", "20px")
                    .style("font-family","Times New Roman")
                    .style("font-weight","bold")
                    .style("fill", "#000001");

    var canvas = my_svg.append("g")
                        .attr("transform", "translate(" + (margin.left + 20) + "," + margin.top + ")");
    
    var x_axis = canvas.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x))
                        .style("font-family", "Times New Roman")
                        .style("font-weight","bold")
                        .style("font-size", "14px");

    canvas.append("defs").append("marker")
        .attr("id", "arrow-x")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 5)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "black");

    canvas.append("path")
        .attr("d", "M0," + height + "L" + (width + 20) + "," + height)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("marker-end", "url(#arrow-x)");
    
    var x_text = canvas.append("g")
        .attr("transform", "translate(0," + height + ")");

    x_text.append("text")
        .attr("y", height - 115)
        .attr("x", width / 2 - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family","Times New Roman")
        .style("font-weight","bold")
        .style("fill", "black");        
    
    var y_axis = canvas.append("g")
                    .call(d3.axisLeft(y))
                    .style("font-family", "Times New Roman")
                    .style("font-weight","bold")
                    .style("font-size", "14px");

    canvas.append("defs").append("marker")
    .attr("id", "arrow-y")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "black");

    canvas.append("path")
        .attr("d", "M0," + (height+0) + "L0,-15")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("marker-end", "url(#arrow-y)");
    
    
    var y_text = canvas.append("g")
                        .attr("transform", "translate(20,40)")
                        
    y_text.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left - 20)
        .attr("x", -height / 2 + 30)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family", "Times New Roman")
        .style("font-weight", "bold")
        .style("fill", "black");
    
    console.log(data);

    var updateScatters = function(data, xVar, yVar){
        // console.log(data);
        // console.log(xVar);
        // console.log(yVar);
        x.domain([4.5, 5]);

        x_axis.call(d3.axisBottom(x));
        x_axis.select(".domain").remove();
        x_axis.selectAll("line")
            .filter(function(d) {
                return d === 4.5;
            })
            .remove();
        
        x_text.select("text").text(xVar);


        title.text("Scatter Plot: Review & Availability");
        
        if (yVar == "Avai M") {
            y.domain([-1, 30]);
        } else if (yVar == "Avai BM") {
            y.domain([-2, 60]);
        } else if (yVar == "Avai S") {
            y.domain([-3, 90]);
        } else if (yVar == "Avai Y") {
            y.domain([-10, 365]);
        }

        y_axis.call(d3.axisLeft(y));
        y_axis.select(".domain").remove();
        y_axis.selectAll("line")
            .filter(function(d) {
                return d === -1;
            })
            .remove();

        y_text.select("text").text(yVar);
        
        d3.selectAll(".scatterpoints").remove();
        globalScatterCircles = my_svg.append('g')
                            .selectAll("dot")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("class", "scatterpoints")
                            .attr("transform", "translate(50, 50)")
                            .attr("cx", function (d) {
                                return x(d[xVar]) + 20;
                            })
                            .attr("cy", function (d) {
                                return y(d[yVar]);
                            })
                            .attr("r", 3)
                            .attr("SampleId", function (d) {
                                return d["SampleId"];
                            })
                            .attr("BoroughId", function (d) {
                                return d["BoroughId"];
                            })
                            .style("fill", function (d) {
                                return myColor(d["BoroughId"]);
                            });         

    }

    var change = function() {
        var category1 = d3.select("#single_v_select1").property('value');
        var category2 = d3.select("#single_v_select2").property('value');
        updateScatters(data, category1, category2);
    }

    var x_axis_label = d3.select("#scatterplot")
        .append("div")
        .style("position", "absolute")
        .style("top", "280px")
        .style("left", "40px")
        .style("font-family", "Times New Roman")
        .style("font-size", "15px")
        .style("font-weight","bold")
        .style("color", "#333")
        .text("X axis: ");
    
    var dropdown1 = d3.select("#scatterplot")
        .insert("select", "svg")

        .attr("id", "single_v_select1")
        .style("font-family", "Times New Roman")
        .style("font-size", "14px")
        .style("color", "#333")
        .style("background-color", "#fff")
        .style("border", "2px solid #333")
        .on("change", change)
        .style("position", "absolute")
        .style("top", "280px")
        .style("left", "100px");
    
    dropdown1.selectAll("option")
        .data(rating_variable)
        .enter()
        .append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) { return d[0].toUpperCase() + d.slice(1,d.length); })
        .style("font-family", "Times New Roman")
        .style("font-size", "15px")
        .style("color", "#333");

    var y_axis_label = d3.select("#scatterplot")
        .append("div")
        .style("position", "absolute")
        .style("top", "310px")
        .style("left", "40px")
        .style("font-family", "Times New Roman")
        .style("font-size", "15px")
        .style("font-weight","bold")
        .style("color", "#333")
        .text("Y axis: ");

    var dropdown2 = d3.select("#scatterplot")
        .insert("select", "svg")
        .attr("id", "single_v_select2")
        .style("font-family", "Times New Roman")
        .style("font-size", "15px")
        .style("color", "#333")
        .style("background-color", "#fff")
        .style("border", "2px solid #333")
        .on("change", change)
        .style("position", "absolute")
        .style("top", "310px")
        .style("left", "100px");
    
    dropdown2.selectAll("option")
        .data(availability_variable)
        .enter()
        .append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) { return d[0].toUpperCase() + d.slice(1,d.length); })
        .style("font-family", "Times New Roman")
        .style("font-size", "14px")
        .style("color", "#333");

    updateScatters(data, rating_variable[0], availability_variable[0]);
}