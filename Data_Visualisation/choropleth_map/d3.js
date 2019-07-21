// Stackoverflow to the rescue, again...
// Apparently ES6 promises work fine for this, no need to overcomplicate things!
const files = [
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json",
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
];

Promise.all(files.map(url => d3.json(url) ) )
.then((dataset) => {
    console.log(dataset[0]);

    const path = d3.geoPath();
    // const color = d3.scaleOrdinal(d3.schemeAccent); // Looks nicer
    const color = d3.scaleQuantize([1, 500], d3.schemeBlues[9]); // Easier to read

    const w = 1000;
    const h = 500;

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0)

    const svg = d3.select("body")
        .append("svg")
            .attr("width", w)
            .attr("height", h + 100)

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(dataset[1], dataset[1].objects.counties).features)
        .enter()
        .append("path")
            .attr("class", "county")
            .attr("data-fips", (d) => d.id)
            .attr("data-education", (d) => {
                let result = dataset[0].filter((obj) => {
                  return obj.fips == d.id;
                });
                if(result[0]){
                  return result[0].bachelorsOrHigher
                }
                //could not find a matching fips id in the data
                console.log('could find data for: ', d.id);
                return 0
               })
            .attr("fill", (d) => {
                let result = dataset[0].filter((obj) => {
                  return obj.fips == d.id;
                });
                
                return color(result[0].bachelorsOrHigher * 10)
               })
            .attr("d", path)
            .on("mouseover", (d) => {
                let id = d.id; // Don't even know why, but it works...
                let result = dataset[0].filter((obj) => {
                    return obj.fips == id;
                });

                tooltip
                .html(() => {
                    return "State & area: " + result[0].state + ", " + result[0].area_name +
                    "<br />People with a bachelors or higher: " + result[0].bachelorsOrHigher +
                    "%."
                })
                .attr("data-education", () => result[0].bachelorsOrHigher)
                .style("opacity", 1)
                .style("top", event.pageY + 30 + "px") // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageY
                .style("left", event.pageX + "px")
            })
            .on("mouseout", function() {
                tooltip
                .style("opacity", 0)
            })

    svg.append("text")
        .attr("id", "title")
        .attr("x", w / 3)
        .attr("y", 30)
        .text("U.S. Education Levels")

    svg.append("text")
        .attr("id", "description")
        .attr("x", w / 2.8)
        .attr("y", 50)
        .text("People with a bachelor's or higher in % in the U.S.")
    
    const legend = svg.append("g")
        .attr("id", "legend")
    
    legend.append("text")
        .attr("x", w - 350)
        .attr("y", 75)
        .text("Darker blue = higher education level")

    for(let i=0; i<10; i++) {
        legend.append("rect")
            .attr("x", w - 350 + i * 20)
            .attr("y", 80)
            .attr("width", "15px")
            .attr("height", "15px")
            .attr("fill", color(i * 50) )
            .style("stroke-width", "2px")
            .style("stroke", i < 5 ? "#000000" : "#ffffff")
    }
});