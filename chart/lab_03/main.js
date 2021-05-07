//declaring width and height for all svg containers

width = 500
height = 400
margin = { top: 20, bottom: 20, left: 20, right: 40 };

width2 = 500,
    height2 = 400
margin2 = { top: 0, bottom: 0, left: 20, right: 40 };



let svg;
let svg2;


let state = {
    geojson: null,
    data: null,
    data2: null,
    stateData: null


};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    //d3.json("../data/NYC.json"), //geojsom
    d3.json("https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/ArcGIS/rest/services/NYC_Neighborhood_Tabulation_Areas/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=pgeojson"), //geojsom

    d3.json("../data/Noise_complaints.geojson"),
    // , d => ({
    //     people_tested: +d.features.properties.people_tested
    // })), //data
    d3.csv("../data/nys_retail_food_store_xy.csv"), //data2
    d3.json("../data/NYSjson.json"),//stateData


]).then(([geojson, data, data2, stateData]) => {
    state.geojson = geojson; //NYC

    state.data = data;
    state.data2 = data2;//Retail food
    state.stateData = stateData;//New York State json

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

    newData = new Map(state.data.features.map(d => [d.properties.ntaname, d.properties.NUMPOINTS]))
    //geoData = new Map(state.geojson.features.map(d => [d.properties.PO_NAME, d.properties.latitude]))
    // newData_allpeople = new Map(state.data.features.map(d => [d.properties.label, d.properties.people_tested]))
    // newData_name = new Map(state.data.features.map(d => [d.properties.label, d.properties.modzcta_name]))
    console.log(newData)
    //console.log(geoData)


    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    colorScale = d3.scaleLinear().range(["#efefef", "black"])
        //d3.scaleOrdinal(d3.interpolateBuPu(0.5))
        // .range(["#BCDFE3",

        //     "#1E4C58"
        // ])
        .domain([0, 7000])//d3.max(state.data.features, d => d.properties.NUMPOINTS)])
    console.log("domain", colorScale.domain())

    svg
        .selectAll(".polygon")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.geojson.features)
        .join("path")
        .attr("d", path)
        .attr("class", "firstmap_polygon")
        .style("stroke", "black")
        .attr("fill", d => {
            //console.log("tooltop d", d)
            let value = newData.get(d.properties.NTAName);

            return (value != null ? colorScale(value) : "#FBF6F5")
        })
        .on('mouseover', (event, d) => {
            // console.log("tooltip d", newData.get(d.properties.postalCode))
            div
                .transition()
                .duration(50)
                .style('opacity', 1);
            div
                .html("Neighborhood name: " + "<h3><strong>" + d.properties.NTAName + "</strong></h3>" +
                    "Number of Noise Related Complaints in 2020: " + "<strong>" + newData.get(d.properties.NTAName) + "</strong>"
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
    //LEGENDS
    keys = ["500", "2000", "4000", "7000", "18000"]
    legendColor = d3.scaleLinear().domain(["500", "2000", "4000", "7000", "18000"])
        .range(["#efefef", "#b4b4b4", "#959595", "#505050", "black"])
    svg.selectAll("myrect")
        .data(keys)
        .enter()
        .append("rect")
        .attr("width", 30)
        .attr("height", 11)
        .attr("stroke", "black")
        .attr("y", height - height / 14)
        .attr("x", function (d, i) { return width - width / 2.5 - 20 + i * 30 })
        .style("fill", d => legendColor(d))

    svg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .style("font-size", 12)
        .attr("y", height - height / 12)
        .attr("x", function (d, i) { return width - width / 2.5 - 20 + i * 30 })
        .style("fill", "black")
        .text(d => d)
        .style("text-anchor", "center")
        .style("alignment-baseline", "middle")

    //SECOND CHART
    const topFive = state.data.features.filter(d => d.properties.NUMPOINTS > 5000)

    topFiveData = new Map(topFive.map(d => [d.properties.ntaname, d.properties.NUMPOINTS]))

    svg2 = d3
        .select("#d3-container2")
        .append("svg")
        .attr("width", width2)
        .attr("height", height2);

    div2 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    //console.log(topFiveData)
    const xScale = d3
        .scaleBand()
        .domain(topFiveData, d => d.ntaname)
        .range([margin2.left, width2 - margin2.right])
        .paddingInner(0.5);


    const yScale = d3
        .scaleLinear()
        .domain([0, 18606])
        .range([height2 - margin2.bottom, margin2.top]);

    console.log("x", xScale.domain(), "y", yScale.domain())
    // reference for d3.axis: https://github.com/d3/d3-axis
    const xAxis = d3.axisBottom(xScale)//.ticks(state.data.length);


    // reference for d3.axis: https://github.com/d3/d3-axis

    svg2
        .selectAll("rect")
        .data(topFiveData)
        .join("rect")
        .attr("y", d => yScale(d.NUMPOINTS))
        .attr("x", d => xScale(d.ntaname))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height2 - margin2.bottom - yScale(d.NUMPOINTS))
        .attr("fill", "steelblue")
        .on('mouseover', (event, d) => {
            // console.log("tooltip d", d)
            div2
                .transition()
                .duration(50)
                .style('opacity', 1);
            div2
                .html("Neighborhood name: " + "<h3><strong>" + d.ntaname + "</strong></h3>" +
                    "Number of Noise Related Complaints in 2020: " + "<strong>" + d.NUMPOINTS + "</strong>"
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

    // append text
    const text = svg
        .selectAll("text")
        .data(topFiveData)
        .join("text")
        .attr("class", "label")
        // this allows us to position the text in the center of the bar
        .attr("x", d => xScale(d.ntaname) + (xScale.bandwidth() / 2))
        .attr("y", d => yScale(d.NUMPOINTS))
        .text(d => d.NUMPOINTS)
        .attr("dy", "1.25em");

    svg2
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height2 - margin2.bottom})`)
        .call(xAxis)




};






