
width = 360;
height = 300;
margin = { top: 0, bottom: 0, left: 20, right: 20 };

const data = [96, 4];

// Selecting SVG using d3.select() 
const svg1 = d3
    .select("#d3-container2")
    .append("svg")
    .attr("viewBox", "0 0 360 360")
    .append("g")
    .attr("transform", "translate(0,0)")

let g = svg1.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2.8 + ")");

// Creating Pie generator 
var pie = d3.pie();

// Creating arc 
var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(width / 3.6);

const color = d3.scaleOrdinal()
    .domain(data)
    .range(["#972B29",
        "lightgrey"])
// Grouping different arcs 
var arcs = g.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g");

// Appending path  
arcs.append("path")
    .attr("fill", (d, i) => {
        //let value = data.data;
        return color(i);
    })
    .attr("d", arc)
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .on('mouseover', (event, d) => {
        //console.log("d for tooltips", d)
        div
            .transition()
            .duration(50)
            .style('opacity', 1);
        div
            .html("<strong>" + "96 %" + " " + "</strong>" + "<br>"
                + "of AI/AN female victims that experienced sexual violence by non-Native perpetrators"
            )
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on('mouseout', () => {
        div
            .transition()
            .duration(100)
            .style('opacity', 0);
    })
const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
