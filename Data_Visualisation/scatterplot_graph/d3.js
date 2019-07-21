const w = 600;
const h = 400;

const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "orange")

const timeParse = d3.timeParse("%M:%S")

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(data => {
    console.log(data);

    const years = data.map(d => d.Year)
    const times = data.map(d => timeParse(d.Time) )

    const xScale = d3.scaleLinear()
      .range([0, w-70])
      .domain([d3.min(years), d3.max(years)])
      .nice()

    const yScale = d3.scaleTime()
      .range([h, 70])
      .domain([d3.max(times), d3.min(times)])
      .nice()

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S") )
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d") )

    // Left axis
    svg.append("g")
      .attr("transform", "translate(35, -20)")
      .attr("id", "y-axis")
      .call(yAxis)

    // Bottom axis
    svg.append("g")
      .attr("transform", "translate(35, 380)")
      .attr("id", "x-axis")
      .call(xAxis)

    const tooltip = d3.select("body")               
      .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("left", "0px")
        .style("top", "0px")

    const dots = svg.selectAll(".dot")
        .data(data)
        .enter() 
        .append("g")
          .attr("transform", "translate(35, -20)")
          .attr("x", (d) => xScale(d.Year) )
          .attr("y", (d) => yScale(timeParse(d.Time) ) )

    // Data dots
    dots.append("circle")
        .attr("cx", (d) => xScale(d.Year) )
        .attr("cy", (d) => yScale(timeParse(d.Time) ) )
        .attr("r", 5)
        .attr("class", "dot")
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => timeParse(d.Time) )
        .style("fill", (d) => d.Doping ? "red" : "green")
        .on("mouseover", function(d) {
            tooltip.html(d.Name + ": " + d.Nationality + 
                "<br />Year: " + d.Year + "<br />Time: " + d.Time
              + (d.Doping ? "<br />" + d.Doping : "<br />No doping allegations.") )
          .attr("data-year", d.Year)
          .style("left", xScale(d.Year) + 50 + "px")
          .style("top", yScale(timeParse(d.Time) ) - 10 + "px")
          .style("opacity", 1)
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
        })

    // Document Title
    svg.append("text")
        .attr("id", "title")
        .attr("x", 50)
        .attr("y", 30)
        .text("Doping in Professional Bicycle Racing")
        .style("font-style", "italic")
        .style("font-weight", "bold")
        .style("font-size", "2em")
        .style("text-shadow", "1px 0px #FFF")

    svg.append("text")
        .attr("id", "legend")
        .attr("x", w-165)
        .attr("y", h-250)
        .text("Doping confirmed")
    
    svg.append("circle")
        .attr("cx", w-180)
        .attr("cy", h-255)
        .attr("r", "10px")
        .style("fill", "red")
        .style("stroke-width", "3")
        .style("stroke", "black")

    svg.append("text")
        .attr("id", "legend")
        .attr("x", w-165)
        .attr("y", h-225)
        .text("No doping allegations")

    svg.append("circle")
        .attr("cx", w-180)
        .attr("cy", h-230)
        .attr("r", "10px")
        .style("fill", "green")
        .style("stroke-width", "3")
        .style("stroke", "black")
})