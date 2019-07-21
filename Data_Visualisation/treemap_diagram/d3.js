d3.json("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json")
    .then(data => {

        const w = 1000
        const h = 520
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h + 180)

        const root = d3.hierarchy(data)
            .sum(function(d) { // Can't use an arrow function here apparently
                return d.value
            }) // Here the size of each leave is given in the 'value' field in input data

        d3.treemap()
            .size([w, h])
            .padding(1)
            (root)

        svg.append("text")
            .attr("id", "title")
            .attr("x", w/2.3)
            .attr("y", 30)
            .text("Movie Sales")

        svg.append("text")
            .attr("id", "description")
            .attr("x", w/2.8)
            .attr("y", 70)
            .text("Top Movies Categorized By Movie Value!")

        const tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0)
            
        // Some data for the legend further down
        const legendElements = data.children;
        const legendColours = [];
        const legendNames = [];

        svg.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("transform", "translate(0, 100)")
            .attr("class", "tile")
            .attr("x", (d) => d.x0)
            .attr("y", (d) => d.y0)
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)
            .style("fill", (d) => {
                if(!legendColours.includes(color(d.data.category) ) ) {
                    legendColours.push(color(d.data.category) );
                    legendNames.push(d.data.category);
                }
                return color(d.data.category);
            })
            .attr("data-name", (d) => d.data.name)
            .attr("data-category", (d) => d.data.category)
            .attr("data-value", (d) => d.data.value)
            .on("mouseover", function(d) {
                tooltip.html("Movie: " + d.data.name + 
                    "<br />Category: " + d.data.category + 
                "<br />Value: " + (d.data.value/1000000).toString().split(".")[0] + "M")
                .attr("data-value", d.data.value)
                .style("opacity", 1)
                .style("top", "15px")
                .style("left", "25px")
            })
            .on("mouseout", function() {
                tooltip
                .style("opacity", 0)
            })
        
        svg.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("class", "tile-text")
            .attr("x", (d) => d.x0 + 5)
            .attr("y", (d) => d.y0 + 140)
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)
            .text((d) => d.data.name)
            .style("font-size", "0.5em")
            .style("overflow", "wrap")

        const legend = svg.append("g")
            .attr("id", "legend") // Id has to be here instead of below because of the unit test... :)
            .attr("x", w / 2.3)
            .attr("y", h + 120)
            .attr("width", "200px")
            .attr("height", "100px")

        for(let i=0; i<legendElements.length; i++) {
            legend
                .selectAll("g")
                .data(root.leaves())
                .enter()
                .append("rect")
                .attr("class", "legend-item")
                .attr("x", w / 3.2 + i * 70)
                .attr("y", h + 150)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", legendColours[i])
        }

        for(let i=0; i<legendNames.length; i++) {
            legend.append("text")
                .attr("x", w / 3.5 + i * 70)
                .attr("y", h + 145)
                .attr("class", "legend-text")
                .text(legendNames[i])
        }

        svg.append("text")
            // .attr("id", "legend") Cannot have the id here because of the unit test :))
            .attr("x", w / 2.4)
            .attr("y", h + 120)
            .attr("width", "200px")
            .attr("height", "100px")
            .text("Colour Coded Categories:")
            .style("text-transform", "uppercase")
    })