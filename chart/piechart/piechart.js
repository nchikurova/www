var width = 450
height = 450
margin = 30

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2.5 - margin * 1.2

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.selectAll(".text")
    .append("g")
    .append("text")
    .attr("class", "text")
    .attr("x", 10)
    .attr("y", 10)
    .text("text")
    .attr("fill", "black")
    .attr("font", 12)
    .attr("opacity", 1)

var data1 = { a: 96, b: 4 }
var data2 = { a: 21, b: 89 }


// set the color scale
const color = d3.scaleOrdinal()
    .domain(["a", "b"])
    .range(["brown",
        "lightgrey"])
// .range(d3.schemeDark2);

// A function that create / update the plot for a given variable:
function update(data) {

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function (d) { return d.value; })
        //.value(function (d) { return d.quantity; })
        //.sort(function (a, b) { console.log(a); return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart
        .sort(null)
    var data_ready = pie(d3.entries(data))

    // map to data
    var u = svg.selectAll("path")
        .data(data_ready)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u
        .enter()
        .append('path')
        .merge(u)
        .transition()
        .duration(1000)
        .attr('d'
            , d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
        )
        .attr('fill', function (d) { return (color(d.data.key)) })
        .attr("stroke", "darkgrey")
        .style("stroke-width", "2px")
        .style("opacity", 1)
    // .on('mouseover', (event, d) => {
    //     console.log("d for tooltips", d)
    //     div
    //         .transition()
    //         .duration(50)
    //         .style('opacity', 1);
    //     div
    //         .html("<strong>" + " %" + " " + "</strong>" + "<br>"
    //             + "of ")
    //         .style("left", (event.pageX + 10) + "px")
    //         .style("top", (event.pageY - 28) + "px");
    // })
    // .on('mouseout', () => {
    //     div
    //         .transition()//
    //         .duration(100)
    //         .style('opacity', 0);
    // })

    // remove the group that is not present anymore
    u
        .exit()
        .remove()
    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

}

// Initialize the plot with the first dataset
update(data1)