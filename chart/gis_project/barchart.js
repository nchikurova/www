'use strict';


Promise.all([
    d3.csv("../data/topten.csv")])
    .then(([data_bar]) => {
        // console.log("data_bar", data_bar);
        let width_bar = 500;
        let height_bar = 400;
        let margin_bar = { top: 60, bottom: 50, left: 150, right: 40 };


        const svg_barchart = d3
            .select("#bar-two")
            .append("svg")
            .attr("width", width_bar)
            .attr("height", height_bar);

        const div_bar = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        const yScale_bar = d3
            .scaleBand()
            .domain(["District of Columbia", "Connecticut", "Rhode Island", "New York", "Minnesota", "California", "Washington", "Vermont", "Massachusetts", "New Jersey"])

            //.domain(data_bar, d => d['LocationDesc'])
            .range([margin_bar.top, height_bar - margin_bar.bottom])
            .paddingInner(0.2)
            .paddingOuter(0.2);


        const xScale_bar = d3
            .scaleLinear()
            .domain([0, d3.max(data_bar, d => d.Data_Value)])//58])
            .range([margin_bar.left, width_bar - margin_bar.right]);

        //console.log("x_bar", xScale_bar.domain(), "y_bar", yScale_bar.domain())
        // reference for d3.axis: https://github.com/d3/d3-axis
        const xAxis_bar = d3.axisBottom(xScale_bar)//.ticks(data_bar.length)
        const yAxis_bar = d3.axisLeft(yScale_bar)//.tickValues([])

        svg_barchart
            .selectAll("rect")
            .data(data_bar)
            .join("rect")
            .attr("class", "rect.bar")
            .attr("y", d => yScale_bar(d.LocationDesc))
            .attr("x", margin_bar.left)//d => xScale_bar(d))
            .attr("height", yScale_bar.bandwidth())
            .attr("width", d => xScale_bar(d.Data_Value) - margin_bar.left)
            .attr("fill", "lightgrey")

            .on('mouseover', (event, d) => {
                // console.log("tooltip d", d)
                div_bar
                    .transition()
                    .duration(50)
                    .style('opacity', 1);
                div_bar
                    .html("State: " + "<h3><strong>" + d.LocationDesc + "</strong></h3>" +
                        "Percentage of taxes from retail price per pack: " + "<strong>" + d.Data_Value + "</strong>"
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
        const text1 = svg_barchart
            .selectAll("text")
            .data(data_bar)
            .join("text")
            .attr("class", "label_bar")// this allows us to position the text in the center of the bar
            .attr("x", d => xScale_bar(d.Data_Value))// + (xScale.bandwidth() / 2))
            .attr("y", d => yScale_bar(d.LocationDesc))
            .text(d => `${d.Data_Value + "%"}`)
            .attr("dy", "1em");
        // const text2 = svg_barchart
        //     .selectAll("text")
        //     .data(data_bar)
        //     .join("text")
        //     .attr("class", "label_bar_value")// this allows us to position the text in the center of the bar
        //     .attr("x", margin_bar.left + 30)// + (xScale.bandwidth() / 2))
        //     .attr("y", d => yScale_bar(d.LocationDesc))
        //     .text(d => `${d.LocationDesc}`)
        //     .attr("dy", "1em");

        svg_barchart
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height_bar - margin_bar.bottom})`)
            //.attr("transform", `translate(0,${height3 - margin3.bottom})`)
            .call(xAxis_bar)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "50%")
            .attr("dy", "2.2em")
            .text("Percentage of the retail price")
            .attr("font-size", "16")
            .attr("fill", "black")
            .attr('opacity', 0.8)

        svg_barchart
            .append("g")
            .attr("class", "axis y-axis-scatter")
            .attr("transform", `translate(${margin_bar.left},0)`)

            .call(yAxis_bar)
            .append("text")
            .attr("class", "axis-label")
            .attr("y", "40%") //in the middle of line
            .attr("dx", "-0.7em")
            .attr("writing-mode", "vertical-rl")
            .text("State")
            .attr("font-size", "16")
            .attr("fill", "black")
            .attr('opacity', 0.8)



    })

