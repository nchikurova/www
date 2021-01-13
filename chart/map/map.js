const width = window.innerWidth * 0.8,
    height = window.innerHeight * 0.7,
    margin = { top: 20, bottom: 20, left: 60, right: 40 };


let svg;

let state = {
    geojson: null,
    week_1: null,
    hover: {
        latitude: null,
        longitude: null,
        state: null,
    },
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    d3.json("../data/usState.json"),
    d3.csv("../data/number_cases.csv", d => ({
        ["Number of cases"]: +d["Number of cases"],
        State: d.State
    })),
]).then(([geojson, data]) => {
    state.geojson = geojson;
    state.data = data;
    console.log("state: ", state);
    init();

});


function init() {
    // our projection and path are only defined once, and we don't need to access them in the draw function,
    // so they can be locally scoped to init()
    const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
    const path = d3.geoPath().projection(projection);

    svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    newData = new Map(state.data.map(d => [d.State, d["Number of cases"]]))

    formatNumber = function (d) {
        if (d != null)
            return d;
        else {
            return "unknown";
        }
    }
    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    colorScale = d3.scaleLinear()
        .range(["white", "#56170D"])
        .domain([0, d3.max(state.data, d => d["Number of cases"])])

    svg
        .selectAll(".state")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.geojson.features)
        .join("path")
        .attr("d", path)
        .attr("class", "state")
        //.attr("fill", "transparent")
        .style("stroke", "black")
        .attr("fill", d => {
            let value = newData.get(d.properties.NAME);

            return (value != null ? colorScale(value) : "#FBF6F5")
        })
        .on('mouseover', (event, d) => {
            //console.log("tooltip d", d)
            div
                .transition()
                .duration(50)
                .style('opacity', 1);
            div
                .html("State: " + "<h3><strong>" + d.properties.NAME + "</strong></h3>" + "<br>"
                    + "Number of cases: " + "<h3><strong>" + formatNumber(newData.get(d.properties.NAME)) + "</strong></h3>")

                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            div
                .transition()
                .duration(100)
                .style('opacity', 0);
        })
    // LEGENDS
    keys = ["20", "30", "40", "50", "70"]
    legendColor = d3.scaleOrdinal().domain(["20", "30", "40", "50", "70"])
        .range(["#d8c9c7",
            "#b89e99",
            "#a98883",
            "#8a5e57",
            "#57170d",
        ])
    legendHeight = innerHeight * 0.05
    svg.selectAll("myrect")
        .data(keys)
        .enter()
        .append("rect")
        .attr("width", 35)
        .attr("height", 11)
        .attr("y", innerHeight * 0.02)
        .attr("x", function (d, i) { return innerWidth / 2.2 + i * 30 })
        // .attr({
        //     class: "legend",
        //     transform: function (d, i) {
        //         return "translate(0," + (i + legendHeight - 65) + ")";
        //     }
        // })
        .style("fill", d => legendColor(d))

    svg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .style("font-size", 12)
        .attr("y", innerHeight * 0.02 - 4)
        .attr("x", function (d, i) { return innerWidth / 2.2 + 10 + i * 30 })
        .style("fill", "black")
        .text(d => d)
        .style("text-anchor", "center")
        .style("alignment-baseline", "middle")
    draw(); // calls the draw function
}

function draw() {

}
