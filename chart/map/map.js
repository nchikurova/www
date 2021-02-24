width = 400
height = 400
margin = { top: 20, bottom: 20, left: 20, right: 40 };

width2 = 500,
    height2 = 400
margin2 = { top: 0, bottom: 0, left: 20, right: 40 };

width3 = 500,
    height3 = 400
margin3 = { top: 0, bottom: 0, left: 20, right: 40 };

width4 = 500,
    height4 = 400
margin4 = { top: 0, bottom: 0, left: 20, right: 40 };

let svg;
let svg2;
let svg3;
let svg4;

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
    d3.csv("../data/nys_retail_food_store_xy.csv"),
    d3.json("../data/NYSjson.json")
    // , d => ({
    //     Y: d['Y'].trim(),
    //     X: d['X'].trim()
    // }))
]).then(([geojson, data, data2, stateData]) => {
    state.geojson = geojson;
    state.data = data;
    state.data2 = data2;
    state.stateData = stateData;
    console.log("state: ", state);
    init();

});


function init() {
    // our projection and path are only defined once, and we don't need to access them in the draw function,
    // so they can be locally scoped to init()

    // FIRST MAP
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
    console.log(newData_name)
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
        .attr("class", "firstmap_polygon")
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
    // LEGENDS
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
    //     .attr("y", height * 0.5)
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
    //     .attr("y", innerHeight * 0.02)
    //     .attr("x", function (d, i) { return innerWidth / 2.8 + 10 + i * 30 })
    //     .style("fill", "black")
    //     .text(d => d)
    //     .style("text-anchor", "center")
    //     .style("alignment-baseline", "middle")

    //SECOND MAP
    const projection2 = d3.geoAlbersUsa().fitSize([width2, height2], state.stateData); //state.geojson);
    const path2 = d3.geoPath().projection(projection2);

    svg2 = d3
        .select("#d3-container2")
        .append("svg")
        .attr("width", width2)
        .attr("height", height2);

    div2 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg2

        .selectAll(".polygon")
        .data(state.stateData.features)
        .join("path")
        .attr("d", path2)
        .attr("class", "polygon")
        .style("stroke", "black")
        .attr("fill", 'transparent')

    svg2
        .selectAll("circle")
        .data(state.data2, d => d["Entity.Name"])//newData_stores, d => d)//state.data2)//, d => [d.Long, d.Lat])
        .join("circle")
        .attr("class", "circle")
        .style("stroke", "black")
        .attr("fill", d => {
            let value = projection2([+d.X, +d.Y]);

            return (value != 'NA' ? "brown" : "transparent")
        })
        .attr("r", 2)
        .attr("transform", d => {
            let point = projection2([+d.X, +d.Y]);
            // console.log(point)
            // return (value != null ? colorScale(value) : "#FBF6F5")
            return (point != null ? (`translate(${point[0]},${point[1]})`) : [])
        })

        .on('mouseover', (event, d) => {
            // console.log("tooltip d", d)
            div2
                .transition()
                .duration(50)
                .style('opacity', 1);
            div2
                .html("Entity Name: " + "<h3><strong>"
                    + d["Entity.Name"] + "</strong></h3>" + "<br>" +
                    "Latitude: " + "<h3><strong>"
                    + d.Y + "</strong></h3>" + "<br>" +
                    "Longitude: " + "<h3><strong>"
                    + d.X + "</strong></h3>" + "<br>"
                )

                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            div2
                .transition()
                .duration(100)
                .style('opacity', 0);
        })

    // THIRD MAP
    const projection3 = d3.geoAlbersUsa().fitSize([width3, height3], state.geojson);
    const path3 = d3.geoPath().projection(projection3);

    svg3 = d3
        .select("#d3-container3")
        .append("svg")
        .attr("width", width3)
        .attr("height", height3);

    div3 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg3

        .selectAll(".polygon")
        .data(state.data.features)
        .join("path")
        .attr("d", path3)
        .attr("class", "polygon")
        .style("stroke", "black")
        .attr("fill", 'transparent')


    // FOURTH MAP

    const projection4 = d3.geoAlbersUsa().fitSize([width4, height4], state.geojson);
    const path4 = d3.geoPath().projection(projection4);

    svg4 = d3
        .select("#d3-container4")
        .append("svg")
        .attr("width", width4)
        .attr("height", height4);

    div4 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg4

        .selectAll(".polygon")
        .data(state.data.features)
        .join("path")
        .attr("d", path4)
        .attr("class", "polygon")
        .style("stroke", "black")
        .attr("fill", 'transparent')

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


