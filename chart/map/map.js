//declaring width and height for all svg containers

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

width5 = 800,
    height5 = 600
margin5 = { top: 0, bottom: 0, left: 20, right: 40 };

let svg;
let svg2;
let svg3;
let svg4;
let svg5;

let state = {
    geojson: null,
    data: null,
    data2: null,
    data3: null,
    data4: null,
    stationsData: null,
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    d3.json("../data/NYC.json"), //geojsom

    d3.json("../data/nyc_zip_code_covid.geojson", d => ({
        people_tested: +d.features.properties.people_tested
    })), //data
    d3.csv("../data/nys_retail_food_store_xy.csv"), //data2
    d3.json("../data/NYSjson.json"),//stateData
    d3.csv("../data/NYS_Health_Facility_deleted_missing.csv"),//data3
    d3.csv("../data/NYS_Retail_Food_Stores_NEW.csv",
        d => ({
            Longitude: +d["Longitude"].trim(),
            Latitude: +d["Latitude"],
            entityName: d["Entity Name"]
        })),//data4
    d3.csv("../data/subway_stations_clean.csv")

]).then(([geojson, data, data2, stateData, data3, data4, stationsData]) => {
    state.geojson = geojson; //NYC
    state.data = data;//Covid positive tested
    state.data2 = data2;//Retail food
    state.stateData = stateData;//New York State json
    state.data3 = data3;// Health Facility given
    state.data4 = data4;// Health Faciliity cleaned
    state.stationsData = stationsData;// Subway Map 

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
    // console.log(newData_name)


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
                .html("Neighborhood name: " + "<h3><strong>" + newData_name.get(d.properties.postalCode) + "</strong></h3>" +
                    "Number of positive tested people: " + "<strong>"
                    + newData.get(d.properties.postalCode) + "</strong>" + "<br>"
                    + "Number of people tested: " + "<strong>" + newData_allpeople.get(d.properties.postalCode) + "</strong>" + "<br>"
                    + "Zip code: " + "<strong>" + d.properties.postalCode + "</strong>"
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
    keys = ["20", "80", "100", "160", "200"]
    legendColor = d3.scaleOrdinal().domain(["20", "80", "100", "160", "200"])
        .range(["#d8c9c7",
            "#b89e99",
            "#a98883",
            "#8a5e57",
            "#57170d",
        ])
    svg.selectAll("myrect")
        .data(keys)
        .enter()
        .append("rect")
        .attr("width", 30)
        .attr("height", 11)
        .attr("y", height - height / 14)
        .attr("x", function (d, i) { return width - width / 3 - 20 + i * 30 })
        .style("fill", d => legendColor(d))

    svg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .style("font-size", 12)
        .attr("y", height - height / 12)
        .attr("x", function (d, i) { return width - width / 3 - 10 + i * 30 })
        .style("fill", "black")
        .text(d => d)
        .style("text-anchor", "center")
        .style("alignment-baseline", "middle")

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
        .style("opacity", 0)

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
        .data(state.data2, d => d["Entity.Name"])
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
                    "Latitude: " + "<strong>"
                    + d.Y + "</strong>" + "<br>" +
                    "Longitude: " + "<strong>"
                    + d.X + "</strong>" + "<br>"
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
    const projection3 = d3.geoAlbersUsa().fitSize([width3, height3], state.stateData);
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
        .data(state.stateData.features)
        .join("path")
        .attr("d", path3)
        .attr("class", "polygon")
        .style("stroke", "black")
        .attr("fill", '#Ecf3e5')
    svg3
        .selectAll("circle")
        .data(state.data3, d => d["Facility Name"])
        .join("circle")
        .attr("class", "circle")
        .style("stroke", "black")
        .attr("fill", "green")
        .attr("r", 2)
        .attr("transform", d => {
            let point3 = projection3([+d["Facility Longitude"], +d["Facility Latitude"]]);
            return (point3 != null ? (`translate(${point3[0]},${point3[1]})`) : [])
        })

        .on('mouseover', (event, d) => {
            // console.log("tooltip d", d)
            div3
                .transition()
                .duration(50)
                .style('opacity', 1);
            div3
                .html("Facility Name: " + "<strong><h3>" + d["Facility Name"] + "</strong></h3>"
                    + "Latitude: " + d["Facility Latitude"] + "<br>"
                    + "Longitude: " + d["Facility Longitude"]
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
        .data(state.geojson.features)
        .join("path")
        .attr("d", path4)
        .attr("class", "polygon")
        .style("stroke", "black")
        .attr("fill", 'transparent')

    svg4
        .selectAll("circle")
        .data(state.data4, d => d.entityName)
        .join("circle")
        .attr("class", "circle")
        .style("stroke", "black")
        .attr("fill", "blue")
        .attr("r", 2)
        .attr("transform", d => {
            let point4 = projection4([d.Longitude, d.Latitude]);
            // console.log(point)
            return (point4 != null ? (`translate(${point4[0]},${point4[1]})`) : [])
        })

        .on('mouseover', (event, d) => {
            // console.log("tooltip d", d)
            div4
                .transition()
                .duration(50)
                .style('opacity', 1);
            div4
                .html(
                    "Facility Name: " + "<strong><h3>" + d.entityName + "</strong></h3>"
                    + "Latitude: " + d["Latitude"] + "<br>"
                    + "Longitude: " + d["Longitude"]
                )
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            div4
                .transition()
                .duration(100)
                .style('opacity', 0);
        })


    // FIFTH MAP

    const projection5 = d3.geoAlbersUsa().fitSize([width5, height5], state.geojson);
    const path5 = d3.geoPath().projection(projection5);

    svg5 = d3
        .select("#d3-container5")
        .append("svg")
        .attr("width", width5)
        .attr("height", height5);

    div5 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg5
        .selectAll(".polygon")
        .data(state.geojson.features)
        .join("path")
        .attr("d", path5)
        .attr("class", "polygon")
        .style("stroke", "black")
        .attr("fill", '#FDE0BF')
        .style("opacity", 0.7)

    svg5
        .selectAll("circle")
        .data(state.stationsData, d => d)
        .join("circle")
        .attr("class", "circle")
        .style("stroke", "black")
        .style("stroke-width", "0.01px")
        .attr("fill", d => {
            if (d["Route1"] === "R" || d["Route1"] === "Q" || d["Route1"] === "W" || d["Route1"] === "N") return "#FBD532";
            else if (d["Route1"] === "1" || d["Route1"] === "2" || d["Route1"] === "3") return "red";
            else if (d["Route1"] === "4" || d["Route1"] === "5" || d["Route1"] === "6") return "green";
            else if (d["Route1"] === "B" || d["Route1"] === "D" || d["Route1"] === "F" || d["Route1"] === "M" || d["Route1"] === "FS") return "#FB921E";
            else if (d["Route1"] === ("7")) return "purple";
            else if (d["Route1"] === "G" || d["Route1"] === "GS") return "#7DBB3E";
            else if (d["Route1"] === "J" || d["Route1"] === "Z") return "#AF8017";
            else if (d["Route1"] === "L") return "#7B7D79";
            else if (d["Route1"] === "A" || d["Route1"] === "C" || d["Route1"] === "E" || d["Route1"] === "e") return "#0E5DA9";
            else return "grey";
        })
        .attr("r", 2)
        .attr("transform", d => {
            let point5 = projection5([d["Entrance Longitude"], d["Entrance Latitude"]]);
            // console.log(point)
            return (point5 != null ? (`translate(${point5[0]},${point5[1]})`) : [])
        })

        .on('mouseover', (event, d) => {
            // console.log("tooltip d", d)
            div5
                .transition()
                .duration(50)
                .style('opacity', 1);
            div5
                .html(
                    "Subway Station Name: " + "<strong><h3>" + d["Station Name"] + "</strong></h3>"
                    + "Latitude: " + d["Entrance Latitude"] + "<br>"
                    + "Longitude: " + d["Entrance Longitude"] + "<br>"
                    + "Route: " + d["Route1"]
                )
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            div5
                .transition()
                .duration(100)
                .style('opacity', 0);
        })
    draw(); // calls the draw function
}
function draw() {

};






