d3.csv("../data/percentage_only.csv", d3.autoType).then(data => {

    data.sort((first, second) => d3.descending(first.Quantity, second.Quantity))

    const formatPercentage = d3.format(".0%")
    /** CONSTANTS */
    // constants help us reference the same values throughout our code
    const width = window.innerWidth, //* 0.4,
        height = 400,//= window.innerHeight / 3,
        paddingInner = 0.4,
        paddingOuter = 0.4,
        margin = { top: 20, bottom: 10, left: 100, right: 40 };

    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.Description))
        .range([margin.left, width - margin.right])
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)

    const yScale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top])

    const yAxis = d3
        .axisLeft(yScale)

    const xAxis = d3
        .axisBottom(xScale)
        .tickFormat("").tickValues([]);

    /** MAIN CODE */
    const svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // append rects
    const rect = svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("class", "rect")
        .attr("x", (d, i) => (margin.left + i * 55))//d => xScale(d.Description))
        .attr("y", d => yScale(d.Quantity))//margin.bottom)
        .attr("height", d => height - margin.bottom - yScale(d.Quantity))
        .attr("width", 45)//xScale.bandwidth())
        .attr("fill", "brown")
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
                    + "of " + d.Description)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            div
                .transition()//
                .duration(100)
                .style('opacity', 0);
        })
    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //append text
    const text = svg
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("class", "label")
        .attr("x", (d, i) => (margin.left + i * 56))
        .attr("y", d => yScale(d.Quantity) - 50)
        .text(d => d.Quantity + "%")
        .attr("dy", "1.8em")
        .attr("dx", "-.8")
        .attr("fill", "#5F5D5C")
        ;

    svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(80,0)`)
        .call(yAxis);

    // svg
    //     .append("g")
    //     .attr("class", "axis") // .attr("class, "axis") - x axis shows up on the top
    //     .attr("transform", `translate(${margin.left},0)`)
    //     .call(xAxis);
});
