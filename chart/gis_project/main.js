'use strict';

let width = 360;
let height = 300;
let margin = { top: 60, bottom: 50, left: 40, right: 40 };

let svg;

let state = {
    geojson: null,
    taxes: null,
    // hover: {
    //     latitude: null,
    //     longitude: null,
    //     state: null,
    // },
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    d3.json("../data/usState.json"),
    d3.csv("../data/Average_cost_per_pack.csv", d3.autoType),
]).then(([geojson, taxes]) => {
    state.geojson = geojson;
    state.taxes = taxes;
    console.log("state: ", state);
    init();
});


function init() {

    const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
    const path = d3.geoPath().projection(projection);

    svg = d3
        .select("#map-container")
        .append("svg")
        .attr("viewBox", "0 0 800 620")
        .append("g")
        .attr("transform", "translate(0,0)")

    const colorScale = d3.scaleLinear()
        //.range(["#e7eff0", "#C8E1E5", "#B7D0D0", "#82C0CC", "#458A93", "#16697A", "#1C474D", "#0e2629"])//"#1C474D"])
        .domain([0, d3.max(state.taxes, d => d.Data_Value)])
        .range(["white", "#171730"])
    console.log("colorDomain", colorScale.domain())

    //formatTime = d3.format(",") //if value interpreted by number
    //const formatPercentage = d3.format(".0%")


    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const newData = new Map(state.taxes.map(d => [d.LocationDesc, d.Data_Value]))

    svg
        .selectAll(".state")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.geojson.features)
        .join("path")
        .attr("d", path)
        .attr("class", "state")
        .attr("fill", d => {
            //console.log("d", d)
            let value = newData.get(d.properties.NAME);
            return (value != 0 ? colorScale(value) : "grey")

        })
        .style("stroke", "black")
        .on('mouseover', (event, d) => {
            //console.log("tooltip d", d)
            div
                .transition()
                .duration(50)
                .style('opacity', 1);
            div
                .html(
                    "State: " + "<strong><h3>" + d.properties.NAME + "</strong></h3>" +
                    newData.get(d.properties.NAME)

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

    // .on("mouseover", d => {
    //     // when the mouse rolls over this feature, do this
    //     state.hover["State"] = d.properties.NAME;
    //     draw(); // re-call the draw function when we set a new hoveredState
    // });
}
// called every times state is updated

function draw() {

};
