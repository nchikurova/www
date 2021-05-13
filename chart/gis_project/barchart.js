'use strict';


Promise.all([d3.csv("../data/top10_%_of_taxes.csv", d3.autoType)]).then((data_bar) => {
    console.log("data", data_bar);

    //d3.csv("../data/top10_%_of_taxes.csv", d3.autoType).then(data_bar => {

    console.log(data_bar);
    let width_bar = 360;
    let height_bar = 300;
    let margin_bar = { top: 60, bottom: 50, left: 60, right: 40 };
    let tooltip;
    let xScale_bar;
    let yScale_bar;
    let svg_barchart;
    let div2;

    div2 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .attr("position", "absolute");

    yScale_bar = d3
        .scaleBand()
        .domain(data_bar, d => d.LocationDesc)
        .range([margin_bar.left, width_bar - margin_bar.right])
        .paddingInner(0.5);


    xScale_bar = d3
        .scaleLinear()
        .domain([0, 58])
        .range([height_bar - margin_bar.bottom, margin_bar.top]);

    console.log("x", xScale_bar.domain(), "y", yScale_bar.domain())
    // reference for d3.axis: https://github.com/d3/d3-axis
    const xAxis = d3.axisBottom(xScale_bar)//.ticks(state.data.length);


    // reference for d3.axis: https://github.com/d3/d3-axis

    svg_barchart
        .selectAll("rect")
        .data(data_bar)
        .join("rect")
        .attr("y", d => yScale_bar(d.LocationDesc))
        .attr("x", d => xScale_bar(d.Data_Value))
        .attr("width", xScale_bar.bandwidth())
        .attr("height", d => yScale_bar(d.Data_Value))//height_bar - yScale_bar(d.Data_Value))
        .attr("fill", "steelblue")
        .on('mouseover', (event, d) => {
            // console.log("tooltip d", d)
            div2
                .transition()
                .duration(50)
                .style('opacity', 1);
            div2
                .html("Neighborhood name: " + "<h3><strong>" + d.LocationDesc + "</strong></h3>" +
                    "Number of Noise Related Complaints in 2020: " + "<strong>" + d.Data_Value + "</strong>"
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
    const text2 = svg_barchart
        .selectAll("text")
        .data(data_bar)
        .join("text")
        .attr("class", "label")
        // this allows us to position the text in the center of the bar
        .attr("x", d => xScale_bar(d.LocationDesc))// + (xScale.bandwidth() / 2))
        .attr("y", d => yScale_bar(d.Data_Value))
        .text(d => d.Data_Value)
        .attr("dy", "1.25em");

    svg_barchart
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height_bar - margin_bar.bottom})`)
        .call(xAxis)
        .on('mouseover', function (d) {
            d3.select(d.LocationDesc)
                .transition()
                .duration('50')
                .attr('opacity', '1')
                .attr('fill', 'steelblue')
        })
})


    //const newData = new Map(state.taxes.map(d => [d.LocationDesc, d.Data_Value]))
    //const newDataYear = new Map(state.taxes.map(d => [d.LocationDesc, d.Year]))
