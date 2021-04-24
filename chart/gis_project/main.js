'use strict';

let width = 360;
let height = 300;
let margin = { top: 60, bottom: 50, left: 40, right: 40 };

let svg;
let slider;
let gTime;

let state = {
    geojson: null,
    taxes: null,
    selectedYear: null
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
    d3.csv("../data/Average_cost_per_pack_LAT_LONG.csv", d3.autoType),
]).then(([geojson, taxes]) => {
    state.geojson = geojson;
    state.taxes = taxes;
    console.log("state: ", state);
    init();
});


function init() {

    // const dataTime = d3.range(0, 50).map(function (d) {
    //     return new Date(1970 + d, 10, 3);
    // });
    // console.log("dataTime", dataTime)

    // slider = d3
    //     .sliderHorizontal()
    //     .min(d3.min(dataTime))
    //     .max(d3.max(dataTime))
    //     .step(1000 * 60 * 60 * 24 * 365)
    //     .width(innerWidth)
    //     .tickFormat(d3.timeFormat('%Y'))
    //     //.ticks(6)
    //     .tickValues(dataTime)
    //     .default(new Date(1990, 10, 3))
    //     .on('onchange', val => {
    //         d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
    //     });

    // gTime = d3
    //     .select('div#slider-time')
    //     .append('svg')
    //     .attr('width', 500)
    //     .attr('height', 100)
    //     .append('g')
    //     .attr('transform', 'translate(30,30)')
    //     .call(slider);

    // d3.select('p#value-time').text(d3.timeFormat('%Y')(slider.value()));



    const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
    const path = d3.geoPath().projection(projection);

    svg = d3
        .select("#map-container")
        .append("svg")
        .attr("viewBox", "0 0 800 620")
        .append("g")
        .attr("transform", "translate(0,0)")


    const palette = [
        '#fff7ea',
        '#fcd0b1',
        '#faa580',
        '#f77552',
        '#f03528',
        '#c51625',
        '#96071e',
        '#680114',
        '#3d0000'
    ];

    const colorScale = d3.scaleLinear()
        //.range(["#e7eff0", "#C8E1E5", "#B7D0D0", "#82C0CC", "#458A93", "#16697A", "#1C474D", "#0e2629"])//"#1C474D"])
        .domain([0, d3.max(state.taxes, d => d.Data_Value)])
        .range(["white", "#171730"])
    //console.log("colorDomain", colorScale.domain())

    //formatTime = d3.format(",") //if value interpreted by number
    const formatNumber = d3.format(",.2f");

    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const newData = new Map(state.taxes.map(d => [d.LocationDesc, d.Data_Value]))
    const newDataYear = new Map(state.taxes.map(d => [d.LocationDesc, d.Year]))

    // UI ELEMENT SETUP
    const selectElement = d3.select("#dropdown").on("change", function () {
        console.log("new selected year  is", this.value);
        // `this` === the selectElement
        // this.value holds the dropdown value a user just selected
        state.selectedYear = this.value;
        draw(); // re-draw the graph based on this new selection
    });

    // add in dropdown options from the unique values in the data
    selectElement
        .selectAll("option")
        .data([
            ...Array.from(new Set(state.taxes.map(d => d.Year))),
            // default_selection,
        ])
        .join("option")
        .attr("value", d => d)
        .text(d => d);
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

    svg
        .selectAll(".circle")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.taxes, d => d)
        .join("circle")

        .attr("class", "circle")
        .attr("fill", "#171730")
        .attr('r', d => d.Data_Value)
        .attr("opacity", 0.5)
        .attr("transform", d => {
            // d.features.map(e => { console.log(e); })
            // console.log(d.features);
            const [x, y] = projection([d.Longitude, d.Latitude]);
            return `translate(${x}, ${y})`;
        })

    // // Run the code every 0.1 second
    // d3.interval(function () {
    //     // At the end of our data, loop back
    //     time = (time < 214) ? time + 1 : 0
    //     update(formattedData[time]);
    // }, 100);

    // // First run of the visualization
    // update(formattedData[0]);

}
// called every times state is updated

function draw() {

    svg
        .selectAll(".circle")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.taxes, d => d)
        .join("circle")

        .attr("class", "circle")
        .attr("fill", "blue")
        .attr('r', d => d.Data_Value * 1.5)
        .attr("opacity", 0.5)
        .attr("transform", d => {
            // d.features.map(e => { console.log(e); })
            // console.log(d.features);
            const [x, y] = projection([d.Longitude, d.Latitude]);
            return `translate(${x}, ${y})`;
        })
        .on('mouseover', (event, d) => {
            console.log("tooltip d", d)
            div
                .transition()
                .duration(50)
                .style('opacity', 1);
            div
                .html(
                    "State: " + "<strong><h3>" + d.LocationDesc + "</strong></h3>" +
                    "Average Cost per Pack: " + d.Data_Value
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

};
