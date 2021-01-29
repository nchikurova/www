width1 = 360;
height1 = 300;
margin1 = { top: 0, bottom: 0, left: 0, right: 0 };

const data1 = [21, 89];

// Selecting SVG using d3.select() 
const svg2 = d3
    .select("#d3-container3")
    .append("svg")
    .attr("viewBox", "0 0 360 360")
    .append("g")
    .attr("transform", "translate(0,0)")

let g1 = svg2.append("g")
    .attr("transform", "translate(" + width1 / 2 + "," + height1 / 2.8 + ")")

// Creating Pie generator 
var pie = d3.pie();

// Creating arc 
var arc2 = d3.arc()
    .innerRadius(0)
    .outerRadius(width1 / 3.6);

const color1 = d3.scaleOrdinal(["#972B29",
    "lightgrey"])

// Grouping different arcs 
var arcs2 = g1.selectAll("arc")
    .data(pie(data1))
    .enter()
    .append("g");

// Appending path  
arcs2.append("path")
    .attr("fill", (d, i) => {
        // let value = data1.data;
        return color1(i);
    })
    .attr("d", arc2)
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .on('mouseover', (event, d) => {
        //console.log("d for tooltips", d)
        div1
            .transition()
            .duration(50)
            .style('opacity', 1);
        div1
            .html("<strong>" + "21 %" + " " + "</strong>" + "<br>"
                + "of AI/AN female victims that experienced sexual violence by Native perpetrators"
            )
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on('mouseout', () => {
        div1
            .transition()
            .duration(100)
            .style('opacity', 0);
    })
const div1 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

