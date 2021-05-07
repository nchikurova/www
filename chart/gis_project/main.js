'use strict';

let width = 360;
let height = 300;
let margin = { top: 60, bottom: 50, left: 40, right: 40 };

let svg;
let projection;
let path;
let div;
let bubble;

let state = {
    geojson: null,
    taxes: null,

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
//const formatValue = d3.format(",d")
//const newData = new Map(state.taxes.map(d => [d.LocationDesc, d.Data_Value]))
const formatNumber = d3.format(",.2f");
function textTween(text, valueof) {
    if (typeof valueof !== "function") {
        const value = +valueof;
        valueof = () => value;
    }
    return text.textTween(function (d) {
        const value = +this.textContent;//.replace(/,/g, "");
        const i = d3.interpolateNumber(value, valueof(d));
        return t => formatNumber(i(t));
    });
}
function init() {


    projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
    path = d3.geoPath().projection(projection);

    svg = d3
        .select("#map-container")
        .append("svg")
        .attr("viewBox", "0 0 500 320")
        .append("g")
        .attr("transform", "translate(0,0)")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)

    //formatTime = d3.format(",") //if value interpreted by number

    //const formatValue = d3.format(",d")

    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //const newData = new Map(state.taxes.map(d => [d.LocationDesc, d.Data_Value]))
    //const newDataYear = new Map(state.taxes.map(d => [d.LocationDesc, d.Year]))


    svg
        .selectAll(".state")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.geojson.features)
        .join("path")
        .attr("d", path)
        .attr("stroke-linejoin", "round")
        .attr("class", "state")
        .attr("fill", "grey")
        .attr('opacity', 0.5)

    draw();


    svg.append("g")
        .attr("fill", "brown")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .selectAll("circle")
        .data(state.taxes
            .map(d => d.Data_Value)
            .sort((a, b) => b.Data_Value - a.Data_Value))
        .join("circle")
        // .attr("transform", d => {

        //     const [x, y] = projection([d.Longitude, d.Latitude]);
        //     return `translate(${x}, ${y})`;
        // })
        .attr("transform", d => `translate(${path.centroid(state.geojson)})`)
        .attr("r", d => d.Data_Value)
        .append("title")
        .text(d => `${d.LocationDesc}
    ${d.Data_Value}`);
}
function draw() {
    const t = svg.transition()
        .duration(5000)
        .ease(d3.easeLinear);

    bubble = svg
        //.append("g")
        .selectAll("g")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.taxes, d => d.Id)
        //.data(state.taxes.filter(d => d.Year === Year), d => d.Data_Value)
        // .join("circle")
        .join(enter =>
            enter
                .append("g")
                .attr("transform", d => {
                    // d.features.map(e => { console.log(e); })
                    // console.log(d.features);
                    const [x, y] = projection([d.Longitude, d.Latitude]);
                    return `translate(${x}, ${y})`;
                })
                .call(g => g.append("circle")
                    .attr("fill", "brown")
                    .attr("class", "circle")
                    .attr("opacity", 0.3)
                    .attr("stroke", "currentColor")
                    .attr('r', 0))
                //d => d.Data_Value * 1.5)
                //.attr("opacity", 0.5)

                .call(g => g.append("text")
                    .attr("class", 'text')
                    .attr("dy", "0.35em")
                    .attr("fill-opacity", 1)
                    .attr("y", -2)
                    .text(d => d.LocationDesc)
                    .attr("font-size", 10)
                    .call(text => text.append("tspan")
                        .style("font-variant-numeric", "tabular-nums")
                        .attr("x", 0)
                        .attr("y", 12)
                        .text(0))
                    .transition(t)
                    .attr("opacity", 0.5))
            ,
            update => update,
            exit => exit.call(bubble => bubble.transition(t)
                .call(g => g.select("circle").attr("r", 0))
                .call(g => g.select("text").attr("fill-opacity", 0))
                .call(g => g.select("tspan").call(textTween, 0))
                .remove())
            // exit => exit.call(exit => exit.transition()
            //     .remove())
        )
    // .call(selection =>
    //     selection.transition(d3.easeElastic)
    //         .delay(d => d.Year + 1)
    //         .attr("opacity", 0.3)
    //         //.attr("fill", "blue")
    //         .attr("r", d => d.Data_Value * 1.5))
    bubble.select("circle").transition(t)
        .attr("r", d => d.Data_Value * 1.5);

    bubble.select("tspan").transition(t)
        .call(textTween, d => d.Data_Value);
};
