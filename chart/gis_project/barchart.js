'use strict';


Promise.all([
    d3.csv("../data/topten.csv", d3.autoType)]).then((data_bar) => {
        console.log("data", data_bar);

        let width_bar = 360;
        let height_bar = 300;
        let margin_bar = { top: 60, bottom: 50, left: 60, right: 40 };
        let tooltip;
        let xScale_bar;
        let yScale_bar;
        let svg_barchart;
        let div_bar;

        svg_barchart = d3
            .select("#bar-two")
            .append("svg")
            .attr("width", width_bar)
            .attr("height", height_bar);

        div_bar = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .attr("position", "absolute");

        yScale_bar = d3
            .scaleBand()
            .domain(data_bar, d => d['LocationDesc'])
            .range([margin_bar.top, width_bar - margin_bar.bottom])
            .paddingInner(0.2)
            .paddingOuter(0.2);


        xScale_bar = d3
            .scaleLinear()
            .domain([0, 58])//d3.max(data_bar, d => d.Data_Value)])//58])
            .range([margin3.left, width3 - margin3.right]);

        console.log("x", xScale_bar.domain(), "y", yScale_bar.domain())
        // reference for d3.axis: https://github.com/d3/d3-axis
        const xAxis = d3.axisBottom(xScale_bar).ticks(data_bar.length)
        const yAxis = d3.axisLeft(yScale_bar).tickValues([])


        // reference for d3.axis: https://github.com/d3/d3-axis

        svg_barchart
            .selectAll("rect")
            .data(data_bar)
            .join("rect")
            .attr("y", d => yScale_bar(d.LocationDesc))
            .attr("x", margin_bar.left)//d => xScale_bar(d))
            .attr("height", yScale_bar.bandwidth())
            .attr("width", d => xScale_bar(d.Data_Value))// - margin3.right)//height_bar - yScale_bar(d.Data_Value))
            .attr("fill", "lightgrey")
            .on('mouseover', (event, d) => {
                // console.log("tooltip d", d)
                div_bar
                    .transition()
                    .duration(50)
                    .style('opacity', 1);
                div_bar
                    .html("Neighborhood name: " + "<h3><strong>" + d.LocationDesc + "</strong></h3>" +
                        "Number of Noise Related Complaints in 2020: " + "<strong>" + d.Data_Value + "</strong>"
                    )

                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on('mouseout', () => {
                div_bar
                    .transition()
                    .duration(100)
                    .style('opacity', 0);
            })

        // append text
        svg_barchart
            .selectAll("text")
            .data(data_bar)
            .join("text")
            .attr("class", "label_bar")
            // this allows us to position the text in the center of the bar
            .attr("x", d => xScale_bar(d.Data_Value))// + (xScale.bandwidth() / 2))
            .attr("y", d => yScale_bar(d.LocationDesc))
            .text(d => `${d.LocationDesc + d.Data_Value}`)
            .attr("dy", "1.25em");

        svg_barchart
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height_bar - margin_bar.bottom})`)
            //.attr("transform", `translate(0,${height3 - margin3.bottom})`)
            .call(xAxis)

        svg_barchart
            .append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${margin_bar.left},0)`)
            // .attr("transform", `translate(${margin3.left}, ${margin3.right})`)
            .call(yAxis)
        // svg_barchart
        //     .append("g")
        //     .attr("class", "axis")
        //     .attr("transform", `translate(0, ${height_bar - margin_bar.bottom})`)
        //     .call(xAxis)
        //     .on('mouseover', function (d) {
        //         d3.select(d.LocationDesc)
        //             .transition()
        //             .duration('50')
        //             .attr('opacity', '1')
        //             .attr('fill', 'steelblue')
        //     })

    })

