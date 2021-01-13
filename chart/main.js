const width = window.innerWidth * 0.9,
    height = window.innerHeight * 0.7,
    margin = { top: 20, bottom: 50, left: 60, right: 40 };


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
    d3.json("../lib/data/usState.json"),
    d3.csv("../lib/data/number_cases.csv"
    ),
]).then(([geojson, week_1]) => {
    state.geojson = geojson;
    state.week_1 = week_1;
    console.log("state: ", state);
    init();

});

/*
 * INITIALIZING FUNCTION
  */
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

    cleanData = d3.groups(state.week_1, d => d.state)

    console.log("clean data", cleanData)

    // Map state => total noconfidence
    totalsByState = new Map(
        cleanData.map(d => {
            const totalObject = d[1].find(r => r.category === 'Total');
            return [d[0], totalObject];
        })
    )
    console.log("totalsMap", totalsByState)

    noconfByState = new Map(
        cleanData.map(d => {
            const totalObject = d[1].find(r => r.category === 'Total');
            return [d[0], totalObject.noconf];
        })
    )
    console.log("noconfByState", noconfByState)

    ////// DATA MANIPULATION

    // totalNoconf = new Map(state.week_1.map(d => [d.category, d.characteristics]))
    // console.log("category", totalNoconf)


    // const total_value_array = new Map(state.week_1.map(d => [d.category, d.noconf]))

    // console.log("Total_value_array", total_value_array)
    // const neededArray = new Array(state.week_1.map(d => d.noconf))

    // console.log("neededArray", neededArray)

    // // gives me one number, and I need an Array!
    // console.log("Found", (state.week_1.map(d => [d.category === "Total", d.noconf])[0][1]))

    // // this array gives me the last value of the column, and I need the first one!

    // totalWeekly = new Map(state.week_1.map(d => [d.state, d.noconf]))

    // console.log("totalWeekly", totalWeekly)
    /////////
    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    colorScale = d3.scaleLinear()
        .range(["#C8E1E5", "#1C474D"])
        .domain([d3.min(state.week_1, d => d.noconf), 1300000])
    // I needed to exclude US total numbers
    //.domain([d3.min(state.week_1, d => d.noconf), d3.max(state.week_1, d => d.noconf)]);

    // console.log("color", colorScale.domain())

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
            let value = noconfByState.get(d.properties.STUSPS);
            return (value != 0 ? colorScale(value) : "grey")
        })
        .on('mouseover', d => {
            div
                .transition()
                .duration(50)
                .style('opacity', 0.8);
            div
                .html("<h2><strong>" + "Week 1" + "</strong></h2>" +
                    d.properties.NAME + " " + d.properties.STUSPS)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            div
                .transition()
                .duration(100)
                .style('opacity', 0);
        })

    draw(); // calls the draw function
}

function draw() {

}
