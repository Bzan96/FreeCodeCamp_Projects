d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(data => {
        const baseTemperature = data.baseTemperature;
        const dataset = [...data.monthlyVariance];
        // const months = dataset.map(data => data.month);
        const variances = dataset.map(data => data.variance);
        const timeParse = d3.timeParse("%Y");
        const years = dataset.map(data => timeParse(data.year) );
        // console.log(baseTemperature);
        // console.log(dataset);
        // console.log("months: " + months);
        // console.log("variances: " + variances);
        // console.log("years: " + years);
        
        const monthNames = ["January", "February", "March", "April",
                            "May", "June", "July", "August",
                            "September", "October", "November", "December"];
        // Aka. "fucking cold", "just standard cold", "you can go outside", "warm", "omg too hot"
        const fillColours = ["#425af5", "#42cef5", "#4ef542", "#e67905", "#b01919"];
        // 5 different grades of cold/warmth depending on variance
        const varScale = (d3.min(variances)*-1 + d3.max(variances))/5;
        const w = 700;
        const h = 500;
        const offset = 95;
        // Need to align the axes, something with scaleOrdinal() puts the yScale out of place
        // const tweakNum = 41.7;

        const xScale = d3.scaleTime()
            .range([0, w - 60])
            .domain([d3.min(years), d3.max(years)])

        const yScale = d3.scaleOrdinal()
            .range(Array.from(monthNames, (x,i) => i * (h / 12) ) ) //Stackoverflow solution with modification
            .domain(["January","February","March","April","May","June","July", "August","September","October","November","December"])

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        const tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("left", "0px")
            .style("top", "0px")

        const svg  = d3.select("body")
            .append("svg")
            .attr("width", w + 100)
            .attr("height", h + 200)

            svg.append("text")
                .attr("id", "title")
                .attr("x", w / 5)
                .attr("y", 40)
                .text("Global Temperatures Per Month")

            svg.append("text")
                .attr("id", "description")
                .attr("x", w / 5)
                .attr("y", 60)
                .text("Data from each month since 1753, average base temperature: " + baseTemperature)

            svg.append("g")
                .attr("id", "x-axis")
                .attr("transform", "translate(60 ," + (h + offset) + ")")
                .call(xAxis)

            svg.append("g")
                .attr("id", "y-axis")
                .attr("transform", "translate(60," + (offset) + ")")
                .call(yAxis)

            let barColour = function(d) {
                if(d.variance < (d3.min(variances) + varScale) ) {
                    return fillColours[0];
                } else if(d.variance < (d3.min(variances) + varScale*2) ) {
                    return fillColours[1];
                } else if(d.variance < (d3.min(variances) + varScale*3) ) {
                    return fillColours[2];
                } else if(d.variance < (d3.min(variances) + varScale*4) ) {
                    return fillColours[3];
                } else if(d.variance <= (d3.min(variances) + varScale*5) ) {
                    return fillColours[4];
                }
            }
        
            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                    .attr("x", (d) => xScale(timeParse(d.year) ) + 60)
                    .attr("y", (d) => yScale(d.month) + offset)
                    .attr("height", h / 12)
                    .attr("width", 10)
                    .attr("class", "cell")
                    .attr("data-month", (d) => d.month-1) // Because the test is weird... Months are ranged
                    .attr("data-year", (d) => d.year) // ...from 1-12, why would the test look for 0-11 then?
                    .attr("data-temp", (d) => d.variance)
                    .style("fill", barColour)
                    .style("stroke", "none")
                    .on("mouseover", function(d) {
                        tooltip
                        .html("Year: " + d.year +
                        "<br />Month: " + monthNames[d.month] +
                        "<br />Temperature deviation from average: " + d.variance)
                        .attr("data-year", d.year)
                        .style("opacity", 1)
                        .style("left", xScale(timeParse(d.year) ) + "px")
                        .style("top", yScale(d.month) + "px")
                    })
                    .on("mouseout", function() {
                        tooltip
                        .style("opacity", 0)
                    })

            const legend = svg.append("g")
                .attr("id", "legend")

            // Apparently, there is no easy way to having several lines in D3.js
            // The ugly/easy solution is the append each line separately.
            legend.append("text")
                .attr("x", w / 2.5)
                .attr("y", h + offset + 45)
                .text("Colorscale: Dark blue is really cold,")
                
            legend.append("text")
                .attr("x", w / 2.5)
                .attr("y", h + offset + 58)
                .text("dark red is really hot, green is close")
                
            legend.append("text")
                .attr("x", w / 2.5)
                .attr("y", h + offset + 71)
                .text(" to average temperature.")
            
            // Bottom colourbar
            for(let i=0; i<fillColours.length; i++) {
                legend.append("rect")
                .attr("x", (w / 2.1) + i * 25)
                .attr("y", h + offset + 80)
                .attr("height", 18)
                .attr("width", 18)
                .style("fill", fillColours[i])
                .style("stroke-width", 2)
                .style("stroke", "black")
            }


    })