fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(res => res.json() )
  .then(json => {
    const dataset = [...json.data];
    console.log(dataset)
    console.log(d3.min(dataset, (d) => d[0]).substring(0,4))
    console.log(d3.max(dataset, (d) => d[0]).substring(0,4))
    console.log(d3.min(dataset, (d) => d[1]))
    console.log(d3.max(dataset, (d) => d[1]))

    const w = 700;
    const h = 500;
    const offset = 60;
    
    const xScale = d3.scaleLinear()
        .range([offset, w])
        .domain([parseInt(d3.min(dataset, (d) => d[0]).substring(0,4) ), parseInt(d3.max(dataset, (d) => d[0]).substring(0,4) )])
        .nice() // Makes the x-axis start at 1945 while the lowest datayear is 1947, not sure if it's nice..

    const yScale = d3.scaleLinear()
        .range([0, h-offset])
        .domain([d3.max(dataset, (d) => d[1]), d3.min(dataset, (d) => d[1]) ])
        .nice()

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d") );
    const yAxis = d3.axisLeft(yScale);

    const svg = d3.select("body")
      .append("svg")
        .attr("width", w+30)
        .attr("height", h+20);

    svg.append("text")
      .attr("id", "title")
      .attr("x", w/4)
      .attr("y", 25)
      .text("Federal Reserve Economic Data")

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -300)
      .attr("y", 15)
      .text("Gross Domestic Product");
    
    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0, " + (h) + ")")
      .call(xAxis);
    
    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + offset + ", " + offset + ")")
      .call(yAxis);

    const tooltip = d3.select("body")               
    .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("left", "0px")
      .style("top", "0px")
 
    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
        .attr("x", (d) => xScale(parseInt(d[0]) ) )
        .attr("y", (d) => yScale(d[1]) + offset )
        .attr("width", 5)
        .attr("height", (d) => h - yScale(d[1]) - offset )
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .style("fill", "black")
        .style("stroke", "purple")
        .on("mouseover", function(d) {
          tooltip.html(d[0] + ", " + d[1])
          .style("left", xScale(parseInt(d[0]) ) - 50 + "px")
          .style("top", yScale(d[1]) - 30 + "px")
          .style("opacity", 1)
          .attr("data-date", d[0])
        })
        .on("mouseout", function() {
          tooltip.style("opacity", 0)
        })
    svg.selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
        .attr("x", (d, i) => i * 2 )
        .attr("y", (d, i) => h)
        // .text(d => d[0].substring(0, 4) )
});