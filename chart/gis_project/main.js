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

let width3 = 540;
let height3 = 300;
let margin3 = { top: 20, bottom: 50, left: 40, right: 20 };

let svg3;
let div3;

let state = {
    geojson: null,
    taxes: null,
    income: null

};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    d3.json("../data/usState.json"),
    d3.csv("../data/Average_cost_per_pack_LAT_LONG.csv", d3.autoType),
    d3.csv("../data/income_2019.csv", d => ({
        ...d,
        Percentage: +d.Percentage,
        Income: d.Income,
    })),
]).then(([geojson, taxes, income]) => {
    state.geojson = geojson;
    state.taxes = taxes;
    state.income = income;
    console.log("state: ", state);
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

    const dataYear = state.taxes.filter(d => d.Year === 2015)
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

    // SECOND MAP
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
    //LEGENDS
    const keysText = ["5", "7", "9", "10", "11"]
    const legendColor = d3.scaleLinear().domain(["5", "7", "9", "10", "11"])
        .range(["#efefef", "#b4b4b4", "#959595", "#505050", "black"])
    svg2.selectAll("myrect")
        .data(keysText)
        .enter()
        .append("rect")
        .attr("width", 30)
        .attr("height", 11)
        .attr("stroke", "black")
        .attr("y", height2 - height2 / 14)
        .attr("x", function (d, i) { return width2 - width2 / 2.5 - 20 + i * 30 })
        .style("fill", d => legendColor(d))

    svg2.selectAll("mylabels")
        .data(keysText)
        .enter()
        .append("text")
        .style("font-size", 10)
        .attr("y", height2 - height2 / 12)
        .attr("x", function (d, i) { return width2 - width2 / 2.5 + 5 + i * 30 })
        .style("fill", "black")
        .text(d => d)
        .style("text-anchor", "center")
        .style("alignment-baseline", "middle")



    //BAR CHART

    svg3 = d3
        .select("#bar-income")
        .append("svg")
        .attr("width", width3)
        .attr("height", height3);

    div3 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    const yScale = d3
        .scaleBand()
        .domain(state.income.map(d => d['Income']))
        .range([margin3.top, height3 - margin3.bottom])
        .paddingInner(0.2)
        .paddingOuter(0.2)

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(state.income, d => d.Percentage)])
        .range([margin3.left, width3 - margin3.right]);

    console.log("x", xScale.domain(), "y", yScale.domain())

    const xAxis = d3.axisBottom(xScale).ticks(state.income.length)
    const yAxis = d3.axisLeft(yScale).tickValues([])

    // reference for d3.axis: https://github.com/d3/d3-axis

    svg3
        .selectAll("rect")
        .data(state.income)
        .join("rect")
        .attr("class", "rect")
        .attr("x", margin3.left)//d => xScale(d.Percentage))
        .attr("y", d => yScale(d.Income))
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d.Percentage) - margin3.right)
        .attr("fill", "lightgrey")
        .on('mouseover', (event, d) => {
            // console.log("tooltip d", d)
            div3
                .transition()
                .duration(50)
                .style('opacity', 1);
            div3
                .html("Income: " + "<h3><strong>" + d.Income + "</strong></h3>" +
                    "Percentage: " + "<strong>" + d.Percentage + "%" + "</strong>"
                )

                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            div3
                .transition()
                .duration(100)
                .style('opacity', 0);
        })
    svg3
        .selectAll("text")
        .data(state.income)
        .join("text")
        .attr("class", "label_bar")
        // this allows us to position the text in the center of the bar
        .attr("y", d => yScale(d.Income))
        .attr("x", d => xScale(d.Percentage) + 10)
        .text(d => d.Income)
        .attr("dy", "1.6em")


    svg3
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height3 - margin3.bottom})`)
        //.attr("transform", `translate(0,${height3 - margin3.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", "18%")
        .attr("dy", "2.2em")
        .text("Percentage")
        .attr("font-size", "16")
        .attr("fill", "black")
        .attr('opacity', 0.8)

    svg3
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin3.left - 10},0)`)
        // .attr("transform", `translate(${margin3.left}, ${margin3.right})`)
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", "80%") //in the middle of line
        .attr("dx", "-1em")
        .attr("writing-mode", "vertical-rl")
        .text("Annual Household Income")
        .attr("font-size", "16")
        .attr("fill", "black")
        .attr('opacity', 0.8)


}
function draw() {

};
