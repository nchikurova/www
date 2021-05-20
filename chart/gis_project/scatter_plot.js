'use strict';
d3.csv("../data/Average_cost_per_pack_LAT_LONG2.csv", d3.autoType).then(data => {

    //console.log(data);
    let width = 500;
    let height = 420;
    let margin = { top: 20, bottom: 50, left: 60, right: 20 };
    let tooltip;
    let xScale;
    let yScale;
    let svg_scatter;
    let div;
    let width_scatter = 360;
    let height_scatter = 340;
    let margin_scatter = { top: 20, bottom: 20, left: 160, right: 20 };
    let xScale_scatter;
    let yScale_scatter;
    let svg_scatter_bar;
    let div_scatter;

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
        .attr("width", width)
        .attr("height", height);
    // .attr("viewBox", "0 0 300 320")
    // .append("g")
    // .attr("transform", "translate(0,0)")

    svg_scatter
        .append("g")
        .attr("class", "axis x-axis-scatter")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label-scatter")
        .attr("x", "50%")
        .attr("dy", "3em")
        .text("Year")
        .attr("font-size", "14")
        .attr("fill", "black")
        .attr('opacity', 0.9)

    svg_scatter
        .append("g")
        .attr("class", "axis y-axis-scatter")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label-scatterplot")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - 25)
        .text("Average cost of cigarettes per pack ($)")
        .attr("font-size", "14")
        .attr("fill", "black")
        .attr('opacity', 0.8)


    svg_scatter.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Data_Value))
        .attr("r", 4)
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
                .attr("fill", 'steelblue')

            tooltip.transition()
                .duration('50')
                .style("opacity", 0);
        })
    // BAR CHART TOP 10

    const scatterData = data.filter(d => d.Year === 2019)
    const topTen = scatterData.filter(d => d.Data_Value > 8.6)
    console.log("scatterData", scatterData, topTen)

    svg_scatter_bar = d3
        .select("#scatter-bar")
        .append("svg")
        // .attr("width", width_scatter)
        // .attr("height", height_scatter);
        .attr("viewBox", "0 0 400 340")
        .append("g")
        .attr("transform", "translate(0,0)")

    div_scatter = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    yScale_scatter = d3
        .scaleBand()
        .domain(["New York", "District of Columbia", "Connecticut", "Rhode Island", "Massachusetts", "Alaska", "Hawaii", "Minnesota", "Illinois", "Vermont"])

        // .domain(topTen, d => d['LocationDesc'])
        .range([margin_scatter.top, height_scatter - margin_scatter.bottom])
        .paddingInner(0.2)
        .paddingOuter(0.2);


    xScale_scatter = d3
        .scaleLinear()
        .domain([0, d3.max(topTen, d => d.Data_Value)])//58])
        .range([margin_scatter.left, width_scatter - margin_scatter.right]);

    //console.log("x_bar", xScale_bar.domain(), "y_bar", yScale_bar.domain())
    // reference for d3.axis: https://github.com/d3/d3-axis
    const xAxis_scatter = d3.axisBottom(xScale_scatter)//.ticks(data_bar.length)
    const yAxis_scatter = d3.axisLeft(yScale_scatter)//.tickValues([])

    svg_scatter_bar
        .selectAll("rect")
        .data(topTen)
        .join("rect")
        .attr("class", "rect.scatter")
        .attr("y", d => yScale_scatter(d.LocationDesc))
        .attr("x", margin_scatter.left)//d => xScale_bar(d))
        .attr("height", yScale_scatter.bandwidth())
        .attr("width", d => xScale_scatter(d.Data_Value) - margin_scatter.left)//- margin_scatter.right)
        .attr("fill", " rgb(190, 184, 192)")

        .on('mouseover', (event, d) => {
            // console.log("tooltip d", d)
            div_scatter
                .transition()
                .duration(50)
                .style('opacity', 1);
            div_scatter
                .html("State: " + "<h3><strong>" + d.LocationDesc + "</strong></h3>" +
                    "Average Cost " + "<strong>" + formatNumber(d.Data_Value) + "</strong>"
                )

                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            div_scatter
                .transition()
                .duration(100)
                .style('opacity', 0);
        })

    //append text
    const text1 = svg_scatter_bar
        .selectAll("text")
        .data(topTen)
        .join("text")
        .attr("class", "label_bar_scatter")// this allows us to position the text in the center of the bar
        .attr("x", margin_scatter.left + 20)//d => xScale_scatter(d.Data_Value))// + (xScale.bandwidth() / 2))
        .attr("y", d => yScale_scatter(d.LocationDesc))
        .text(d => `${"$" + formatNumber(d.Data_Value)}`)
        .attr("dy", "1em");


    svg_scatter_bar
        .append("g")
        .attr("class", "axis x-axis-scatter")
        .attr("transform", `translate(0, ${height_scatter - margin_scatter.bottom})`)
        //.attr("transform", `translate(0, ${ height3 - margin3.bottom})`)
        .call(xAxis_scatter)
        .append("text")
        .attr("class", "axis-label-scatter")
        .attr("x", "60%")
        .attr("dy", "2.8em")
        .text("Average Cost Per Pack, $")
        .attr("font-size", "14")
        .attr("fill", "black")
        .attr('opacity', 0.8)

    svg_scatter_bar
        .append("g")
        .attr("class", "axis y-axis-scatter")
        .attr("transform", `translate(${margin_scatter.left}, 0)`)

        .call(yAxis_scatter)
        .append("text")
        .attr("class", "axis-label-scatter")
    // .attr("y", "40%") //in the middle of line
    // .attr("dx", "-0.7em")
    // .attr("writing-mode", "vertical-rl")
    // .text("State")
    // .attr("font-size", "16")
    // .attr("fill", "black")
    // .attr('opacity', 0.8)



})



