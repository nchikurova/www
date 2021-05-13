'use strict';
d3.csv("../data/Average_cost_per_pack_LAT_LONG2.csv", d3.autoType).then(data => {

    //console.log(data);
    let width = 360;
    let height = 300;
    let margin = { top: 60, bottom: 50, left: 60, right: 40 };
    let tooltip;
    let xScale;
    let yScale;
    let svg_scatter;
    let div;

    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .attr("position", "absolute");

    xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([margin.left, width - margin.right])

    yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Data_Value))
        .range([height - margin.bottom, margin.top])

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))

    const yAxis = d3.axisLeft(yScale);
    const formatNumber = d3.format(",.2f");

    svg_scatter = d3
        .select("#scatterplot-container")
        .append("svg")
        .attr("viewBox", "0 0 600 420")
        .append("g")
        .attr("transform", "translate(0,0)")

    svg_scatter
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", "30%")
        .attr("dy", "3em")
        .text("Year")
        .attr("font-size", "9")
        .attr("fill", "black")
        .attr('opacity', 0.8)

    svg_scatter
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", "50%") //in the middle of line
        .attr("dx", "-3em")
        .attr("writing-mode", "vertical-rl")
        .text("Average cost of cigarettes per pack ($)")
        .attr("font-size", "9")
        .attr("fill", "black")
        .attr('opacity', 0.8)


    svg_scatter.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Data_Value))
        .attr("r", 2)
        .attr("opacity", 0.2)
        .attr("stroke", "black")
        .style("fill", "black")

        .on('mouseover', (event, d) => {
            //console.log("tooltip d", d)
            div
                .transition()
                .duration(50)
                .style('opacity', 1);
            div
                .html(
                    "State: " + "<strong><h3>" + d.LocationDesc + "</strong></h3>" +
                    "Average Cost per Pack: " + formatNumber(d.Data_Value) +
                    "<br>" + d.Year

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

        //     // Marks the ones already viewed
        .on('mouseout', function (d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1')
                .attr('stroke', 'steelblue')

            tooltip.transition()
                .duration('50')
                .style("opacity", 0);
        })
    // .on('mouseover', function (d) {
    //     d3.select(d.LocationDesc)
    //         .transition()
    //         .duration('50')
    //         .attr('opacity', '1')
    //         .attr('fill', 'steelblue')
    // })
})


    //const newData = new Map(state.taxes.map(d => [d.LocationDesc, d.Data_Value]))
    //const newDataYear = new Map(state.taxes.map(d => [d.LocationDesc, d.Year]))
