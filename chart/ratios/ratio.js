width = 360;
height = 300;
margin = { top: 0, bottom: 0, left: 20, right: 20 };


// Selcting SVG using d3.select() 
const svg1 = d3
    .select("#d3-container1")
    .append("svg")
    .attr("viewBox", "0 0 360 360")
    .append("g")
    .attr("transform", "translate(0,0)")

zScale = d3.scaleLinear().domain([1, 2.9]).range([height / 2, 0])
svg1.selectAll("circle")

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
