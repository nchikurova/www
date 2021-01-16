d3.csv("../data/horizontalchart.csv", d3.autoType).then(data => {
    //console.log(data);
    data.sort((first, second) => d3.ascending(first.Quantity, second.Quantity))

    /** CONSTANTS */
    // constants help us reference the same values throughout our code
    const width = window.innerWidth * 0.6,
        height = window.innerHeight / 2,
        paddingInner = 0.2,
        paddingOuter = 0.2,
        margin = { top: 10, bottom: 10, left: 100, right: 60 };

    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const yScale = d3
        .scaleBand()
        .domain(data.map(d => d.Description))
        .range([margin.bottom, height - margin.top])
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)

    //console.log(xScale)

    const xScale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([margin.left, width - margin.right]) // range!!!! might be changed

    // if I want to add axis

    // const yAxis = d3
    //     .axisLeft(yScale)

    // const xAxis = d3
    //     .axisBottom(xScale)

    /** MAIN CODE */
    const svg = d3
        .select("#d3-container1")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // append rects
    const rect = svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("class", "rect")
        .attr("y", (d, i) => (margin.top + i * 35))
        .attr("width", d => xScale(d.Quantity))
        .attr("x", margin.left)
        .attr("height", 30)
        .attr("fill", "brown")
        .attr("opacity", 1)
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .on('mouseover', (event, d) => {
            //console.log("d for tooltips", d)
            div
                .transition()
                .duration(50)
                .style('opacity', 1);
            div
                .html("<strong>" + d.Quantity + " %" + " " + "</strong>" + "<br>"
                    + "of " + d.Description
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
    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    const text = svg
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("class", "label_h")
        .attr("y", (d, i) => (margin.top - 15 + i * 35))
        .attr("x", margin.left + 10)
        // .text(d => d.Quantity + "%")
        .attr("dy", "1.8em")
        .attr("dx", "-.8")
        .attr("fill", "white")
        .text(d => d.type)

    const labels = svg
        .selectAll("text.label_word")
        .data(data)
        .join("text")
        .attr("class", "label_word")
        .attr("y", (d, i) => (margin.top - 10 + i * 35))
        .attr("x", d => xScale(d.Quantity) + 110)
        .text(d => d.Quantity + "%")
        .attr("dy", "1.8em")
        .attr("dx", "-.8")
        .attr("fill", "black")


    // svg
    //     .append("g")
    //     .attr("class", "axis")
    //     .attr("transform", `translate(80,0)`)
    //     .call(yAxis);

    // svg
    //     .append("g")
    //     .attr("class", "axis") // .attr("class, "axis") - x axis shows up on the top
    //     .attr("transform", `translate(0,${height - margin.bottom - 40})`)
    //     .call(xAxis);
});
