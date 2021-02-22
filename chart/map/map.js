const width = innerWidth * 0.9,
    height = innerHeight * 0.8,
    margin = { top: 20, bottom: 20, left: 20, right: 40 };


let svg;

let state = {
    geojson: null,
    data: null,
    data2: null,
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    d3.json("../data/NYC.json"),

    d3.json("../data/nyc_zip_code_covid.geojson", d => ({
        people_tested: +d.features.properties.people_tested
    })),
    d3.csv("../data/nys_retail_food_store_xy.csv")
]).then(([geojson, data, data2]) => {
    state.geojson = geojson;
    state.data = data;
    state.data2 = data2;
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

    newData = new Map(state.data.features.map(d => [d.properties.label, d.properties.people_positive]))
    newData_allpeople = new Map(state.data.features.map(d => [d.properties.label, d.properties.people_tested]))
    newData_name = new Map(state.data.features.map(d => [d.properties.label, d.properties.modzcta_name]))

    // newData_facility = new Map(state.data2.map(d => [d["Facility Zip Code"], d["Facility Name"]]))

    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    colorScale = d3.scaleLinear()
        .range(["#ffe6e6", "#4d0000"])
        .domain([0, d3.max(state.data.features, d => d.properties.people_positive)])

    svg

        .selectAll(".polygon")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.geojson.features)
        .join("path")
        .attr("d", path)
        .attr("class", "polygon")
        .style("stroke", "black")
        .attr("fill", d => {
            // console.log("tooltop d", d)
            let value = newData.get(d.properties.postalCode);

            return (value != null ? colorScale(value) : "#FBF6F5")
        })
        .on('mouseover', (event, d) => {
            // console.log("tooltip d", newData.get(d.properties.postalCode))
            div
                .transition()
                .duration(50)
                .style('opacity', 1);
            div
                .html("Number of positive tested people: " + "<h3><strong>"
                    + newData.get(d.properties.postalCode) + "</strong></h3>" + "<br>"
                    + "Number of people tested: " + "<h3><strong>" + newData_allpeople.get(d.properties.postalCode) + "</strong></h3>" + "<br>"
                    + "Neighborhood name: " + "<h3><strong>" + newData_name.get(d.properties.postalCode) + "</strong></h3>"
                    + "Zip code: " + "<h3><strong>" + d.properties.postalCode + "</strong></h3>"
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
        .selectAll(".circle")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.data2, d => d["Location"])
        .join("circle")
        // .attr("d", path)
        .attr("class", "circle")
        .style("stroke", "black")
        .attr("fill", "black")
        .attr("r", 4)
        .attr("transform", d => {
            // d.features.map(e => { console.log(e); })
            // console.log(d.features);
            const [x, y] = projection([d.X, d.Y]);
            return `translate(${x}, ${y})`;
        })

    // const button1 = d3.select("#data2")

    // button1.on("change", function (d) {
    //     svg
    //         .selectAll(".circle")
    //         // all of the features of the geojson, meaning all the states as individuals
    //         .data(state.data2, d => d)
    //         .join("circle")
    //         // .attr("d", path)
    //         .attr("class", "circle")
    //         .style("stroke", "black")
    //         .attr("fill", "black")
    //         .attr("r", 4)
    //         .attr("transform", d => {
    //             // d.features.map(e => { console.log(e); })
    //             // console.log(d.features);
    //             const [x, y] = projection([d.Long, d.Lat]);
    //             return `translate(${x}, ${y})`;
    //         })
    //         .on('mouseover', (event, d) => {
    //             // console.log("tooltip d", newData.get(d.properties.postalCode))
    //             div
    //                 .transition()
    //                 .duration(50)
    //                 .style('opacity', 1);
    //             div
    //                 // .html("Number of positive tested people: " + "<h3><strong>"
    //                 //     + newData.get(d.properties.postalCode) + "</strong></h3>" + "<br>"
    //                 //     + "Number of people tested: " + "<h3><strong>" + newData_allpeople.get(d.properties.postalCode) + "</strong></h3>" + "<br>"
    //                 //     + "Neighborhood name: " + "<h3><strong>" + newData_name.get(d.properties.postalCode) + "</strong></h3>"
    //                 //     + "Zip code: " + "<h3><strong>" + d.properties.postalCode + "</strong></h3>"
    //                 // )

    //                 .style("left", (event.pageX + 10) + "px")
    //                 .style("top", (event.pageY - 28) + "px");
    //         })
    //         .on('mouseout', () => {
    //             div
    //                 .transition()
    //                 .duration(100)
    //                 .style('opacity', 0);
    //         })
    // })

    draw(); // calls the draw function
}

function draw() {

};





// // LEGENDS
// keys = ["20", "30", "40", "50", "70"]
// legendColor = d3.scaleOrdinal().domain(["20", "30", "40", "50", "70"])
//     .range(["#d8c9c7",
//         "#b89e99",
//         "#a98883",
//         "#8a5e57",
//         "#57170d",
//     ])
// legendHeight = innerHeight * 0.05
// svg.selectAll("myrect")
//     .data(keys)
//     .enter()
//     .append("rect")
//     .attr("width", 35)
//     .attr("height", 11)
//     .attr("y", innerHeight * 0.02)
//     .attr("x", function (d, i) { return innerWidth / 2.8 + i * 30 })
//     // .attr({
//     //     class: "legend",
//     //     transform: function (d, i) {
//     //         return "translate(0," + (i + legendHeight - 65) + ")";
//     //     }
//     // })
//     .style("fill", d => legendColor(d))

// svg.selectAll("mylabels")
//     .data(keys)
//     .enter()
//     .append("text")
//     .style("font-size", 12)
//     .attr("y", innerHeight * 0.02 - 4)
//     .attr("x", function (d, i) { return innerWidth / 2.8 + 10 + i * 30 })
//     .style("fill", "black")
//     .text(d => d)
//     .style("text-anchor", "center")
//     .style("alignment-baseline", "middle")


