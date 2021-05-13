'use strict';

let width = 460;
let height = 400;
let margin = { top: 60, bottom: 50, left: 40, right: 40 };

let svg;
let projection;
let path;
let div;
let bubble;

let width2 = 460;
let height2 = 400;
let margin2 = { top: 60, bottom: 50, left: 40, right: 40 };

let svg2;
let projection2;
let path2;
let div2;

let width3 = 460;
let height3 = 400;
let margin3 = { top: 60, bottom: 50, left: 40, right: 40 };

let svg3;
let projection3;
let path3;
let div3;

let state = {
    geojson: null,
    taxes: null,
    topten: null

};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    d3.json("../data/usState.json"),
    d3.csv("../data/Average_cost_per_pack_LAT_LONG.csv", d3.autoType),
    //d3.csv("../data/top10_%_of_taxes.csv", d3.autoType)
]).then(([geojson, taxes, topten]) => {
    state.geojson = geojson;
    state.taxes = taxes;
    state.topten = topten;
    //console.log("state: ", state);
    init();
});
//const formatValue = d3.format(",d")
//const newData = new Map(state.taxes.map(d => [d.LocationDesc, d.Data_Value]))
const formatNumber = d3.format(",.2f");

function init() {


    projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
    path = d3.geoPath().projection(projection);

    svg = d3
        .select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    // .attr("viewBox", "0 0 500 320")
    // .append("g")
    // .attr("transform", "translate(0,0)")
    // .attr("text-anchor", "middle")
    // .attr("font-family", "sans-serif")
    // .attr("font-size", 10)

    //formatTime = d3.format(",") //if value interpreted by number

    //const formatValue = d3.format(",d")

    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const dataYear = state.taxes.filter(d => d.Year === 2010)
    //console.log("dataYear", dataYear)
    const newData = new Map(dataYear.map(d => [d.LocationDesc, d.Data_Value]))
    const newDataYear = new Map(dataYear.map(d => [d.LocationDesc, d.Year]))


    const colorScale = d3.scaleLinear().range(["whitesmoke", "black"]).domain([3, d3.max(state.taxes, d => d.Data_Value)])
    //console.log(colorScale.domain())
    // svg
    //     .selectAll(".state")
    //     // all of the features of the geojson, meaning all the states as individuals
    //     .data(state.geojson.features)
    //     .join("path")
    //     .attr("d", path)
    //     .attr("stroke-linejoin", "round")
    //     .attr("class", "state")
    //     .attr("fill", "grey")
    //     .attr('opacity', 0.5)

    // draw();


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
                    "Average Cost per Pack: " + newDataYear.get(d.properties.NAME) +
                    "<br>" + formatNumber(newData.get(d.properties.NAME))

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


    projection2 = d3.geoAlbersUsa().fitSize([width2, height2], state.geojson);
    path2 = d3.geoPath().projection(projection2);

    svg2 = d3
        .select("#map-container2")
        .append("svg")
        // .attr("viewBox", "0 0 500 320")
        // .append("g")
        // .attr("transform", "translate(0,0)")
        // .attr("text-anchor", "middle")
        // .attr("font-family", "sans-serif")
        // .attr("font-size", 10)
        .attr("width", width2)
        .attr("height", height2);

    //formatTime = d3.format(",") //if value interpreted by number

    //const formatValue = d3.format(",d")

    div2 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const dataYear2 = state.taxes.filter(d => d.Year === 2019)
    //console.log("dataYear2", dataYear2)
    const newData2 = new Map(dataYear2.map(d => [d.LocationDesc, d.Data_Value]))
    const newDataYear2 = new Map(dataYear2.map(d => [d.LocationDesc, d.Year]))

    const colorScale2 = d3.scaleLinear().range(["whitesmoke", "black"]).domain([3, d3.max(state.taxes, d => d.Data_Value)])
    //console.log(colorScale2.domain())
    //const colorScale = d3.scaleOrdinal().range(["white", "whitesmoke", "grey", "black"]).domain([0, d3.max(state.taxes, d => d.Data_Value)])
    //console.log(colorScale.domain())
    // svg2
    //     .selectAll(".state")
    //     // all of the features of the geojson, meaning all the states as individuals
    //     .data(state.geojson.features)
    //     .join("path")
    //     .attr("d", path2)
    //     .attr("stroke-linejoin", "round")
    //     .attr("class", "state")
    //     .attr("fill", "grey")
    //     .attr('opacity', 0.5)

    // draw();


    svg2
        .selectAll(".state")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.geojson.features)
        .join("path")
        .attr("d", path)
        .attr("class", "state")
        .attr("fill", d => {
            //console.log("d", d)
            let value = newData2.get(d.properties.NAME);
            return (value != 0 ? colorScale2(value) : "grey")

        })
        .style("stroke", "black")
        .on('mouseover', (event, d) => {
            //console.log("tooltip d", d)
            div2
                .transition()
                .duration(50)
                .style('opacity', 1);
            div2
                .html(
                    "State: " + "<strong><h3>" + d.properties.NAME + "</strong></h3>" +
                    "Average Cost per Pack: " + newDataYear2.get(d.properties.NAME) +
                    "<br>" + formatNumber(newData2.get(d.properties.NAME))

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

    //BAR CHART
    // const topFive = state.data.features.filter(d => d.properties.NUMPOINTS > 5000)

    // topFiveData = new Map(topFive.map(d => [d.properties.ntaname, d.properties.NUMPOINTS]))
    // console.log("topFiveData", topFiveData)
    // svg3 = d3
    //     .select("#d3-container2")
    //     .append("svg")
    //     .attr("width", width2)
    //     .attr("height", height2);

    // div2 = d3.select("body").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0)

    // //console.log(topFiveData)
    // const xScale = d3
    //     .scaleBand()
    //     .domain(topFiveData, d => d.key)
    //     .range([margin2.left, width2 - margin2.right])
    //     .paddingInner(0.5);


    // const yScale = d3
    //     .scaleLinear()
    //     .domain([0, 18606])
    //     .range([height2 - margin2.bottom, margin2.top]);

    // console.log("x", xScale.domain(), "y", yScale.domain())
    // // reference for d3.axis: https://github.com/d3/d3-axis
    // const xAxis = d3.axisBottom(xScale)//.ticks(state.data.length);


    // // reference for d3.axis: https://github.com/d3/d3-axis

    // svg2
    //     .selectAll("rect")
    //     .data(topFiveData)
    //     .join("rect")
    //     .attr("y", d => yScale(d.value))
    //     .attr("x", d => xScale(d.key))
    //     .attr("width", xScale.bandwidth())
    //     .attr("height", d => yScale(d.value))//height2 - yScale(d.value))
    //     .attr("fill", "steelblue")
    //     .on('mouseover', (event, d) => {
    //         // console.log("tooltip d", d)
    //         div2
    //             .transition()
    //             .duration(50)
    //             .style('opacity', 1);
    //         div2
    //             .html("Neighborhood name: " + "<h3><strong>" + d.key + "</strong></h3>" +
    //                 "Number of Noise Related Complaints in 2020: " + "<strong>" + d.value + "</strong>"
    //             )

    //             .style("left", (event.pageX + 10) + "px")
    //             .style("top", (event.pageY - 28) + "px");
    //     })
    //     .on('mouseout', () => {
    //         div2
    //             .transition()
    //             .duration(100)
    //             .style('opacity', 0);
    //     })

    // // append text
    // const text2 = svg2
    //     .selectAll("text")
    //     .data(topFiveData)
    //     .join("text")
    //     .attr("class", "label")
    //     // this allows us to position the text in the center of the bar
    //     .attr("x", d => xScale(d.key))// + (xScale.bandwidth() / 2))
    //     .attr("y", d => yScale(d.value))
    //     .text(d => d.value)
    //     .attr("dy", "1.25em");

    // svg2
    //     .append("g")
    //     .attr("class", "axis")
    //     .attr("transform", `translate(0, ${height2 - margin2.bottom})`)
    //     .call(xAxis)
}
function draw() {

};
