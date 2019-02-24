import * as d3 from "d3";

const years = [
    [ "1906", 1 ],
    [ "1941", 1 ],
    [ "1944", 1 ],
    [ "1945", 1 ],
    [ "1947", 3 ],
    [ "1948", 1 ],
    [ "1950", 3 ],
    [ "1951", 8 ],
    [ "1952", 3 ],
    [ "1953", 1 ],
    [ "1954", 5 ],
    [ "1956", 7 ],
    [ "1957", 2 ],
    [ "1958", 5 ],
    [ "1959", 3 ],
    [ "1960", 6 ],
    [ "1961", 5 ],
    [ "1962", 4 ],
    [ "1963", 4 ],
    [ "1964", 5 ],
    [ "1965", 4 ],
    [ "1966", 3 ],
    [ "1967", 4 ],
    [ "1968", 6 ],
    [ "1969", 3 ],
    [ "1970", 6 ],
    [ "1971", 7 ],
    [ "1972", 8 ],
    [ "1973", 12 ],
    [ "1974", 7 ],
    [ "1975", 10 ],
    [ "1976", 6 ],
    [ "1977", 2 ],
    [ "1978", 6 ],
    [ "1979", 6 ],
    [ "1980", 9 ],
    [ "1981", 5 ],
    [ "1982", 8 ],
    [ "1983", 3 ],
    [ "1984", 6 ],
    [ "1985", 5 ],
    [ "1986", 6 ],
    [ "1987", 11 ],
    [ "1988", 7 ],
    [ "1989", 7 ],
    [ "1990", 16 ],
    [ "1991", 20 ],
    [ "1992", 16 ],
    [ "1993", 11 ],
    [ "1994", 12 ],
    [ "1995", 10 ],
    [ "1996", 10 ],
    [ "1997", 4 ],
    [ "1998", 4 ],
    [ "1999", 1 ],
    [ "2000", 1 ],
]

let yMargin = 40,
    width = 800,
    height = 400,
    barWidth = width/275;

let tooltip = d3.select(".barChart").append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

let overlay = d3.select('.barChart').append('div')
   .attr('class', 'overlay')
   .style('opacity', 0);

let svgContainer =  d3.select('.barChart')
    .append('svg')
    .attr('width', width + 100)
    .attr('height', height + 60);

d3.json(years, function(err, data) {
  
  svgContainer.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -200)
    .attr('y', 80)
    .text('Players Born In Each Year');
  
  svgContainer.append('text')
    .attr('x', 120)
    .attr('y', height + 50)
    .text('More Information: https://www.quanthockey.com/nhl/nationality/swedish-nhl-players-career-stats.html')
    .attr('class', 'info');

  let xMax = new Date(d3.max(2000));
  let xScale = d3.scaleTime()
    .domain([d3.min(1900), xMax])
    .range([0, width]);
  
  let xAxis = d3.axisBottom()
    .scale(xScale);
  
  let xAxisGroup = svgContainer.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(60, 400)');
  
  let maxNumPlayers = [];

  for(let i=0; i<years.length; i++) {
      maxNumPlayers.push(years[i][1]);
  }

});
    
  let linearScale = d3.scaleLinear()
    .domain([0, 2000])
    .range([0, height]);
  
  let scaledAmount = maxNumPlayers.map((players) => {
    return linearScale(players);
  })
  
  let yAxisScale = d3.scaleLinear()
    .domain([0, 20])
    .range([height, 10]);
  
  let yAxis = d3.axisLeft(yAxisScale)
    
  let yAxisGroup = svgContainer.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(60, 0)');
    
  d3.select('svg').selectAll('rect')
    .data(scaledAmount)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) {
      return xScale(d);
    })
    .attr('y', function(d,i) {
      return height - d;
    })
    .attr('width', barWidth)
    .attr('height', function(d) {
      return d;
    })
    .style('fill', '#33adff')
    .attr('transform', 'translate(60, 0)')
});