'use strict';


Promise.all([
    // d3.csv("../data/Avg_consump_per_capita_yearly.csv", d => ({
    //     Avg_consum_per_capita: +d.Avg_consum_per_capita,
    //     Year: d.Year,
    // })),
    d3.csv("../data/Avg_cost_consum.csv", d => ({
        Avg_cost: +d.Avg_cost,
        Avg_consum_per_capita: +d.Avg_consum_per_capita,
        Year: d.Year
    })),
])
    .then(([cost]) => {
        console.log("data_lines", cost);
        let width_line = 540;
        let height_line = 400;
        let margin_line = { top: 60, bottom: 50, left: 60, right: 40 };

        //console.log("cost", cost)

        const formatValue = d3.format(" $.2f")
        const svg_linechart = d3
            .select("#linechart")
            .append("svg")
            .attr("width", width_line)
            .attr("height", height_line);

        const yScale_consump = d3
            .scaleLinear()
            .domain(d3.extent(cost, d => d.Avg_consum_per_capita))
            .range([height_line - margin_line.bottom, margin_line.top])


        const yScale_cost = d3
            .scaleLinear()
            .domain(d3.extent(cost, d => d.Avg_cost))
            .range([height_line - margin_line.bottom, margin_line.top])

        const xScale_line = d3
            .scaleLinear()
            .domain(d3.extent(cost, d => d.Year))
            .range([margin_line.left, width_line - margin_line.right]);

        // const xScale_cost = d3
        //     .scaleLinear()
        //     .domain(d3.extent(cost, d => d.Year2))
        //     .range([margin_line.left, width_line - margin_line.right]);

        console.log("x_line", xScale_line.domain(), "y_consum", yScale_consump.domain(), "y_cost", yScale_cost.domain())
        // reference for d3.axis: https://github.com/d3/d3-axis
        const xAxis_line = d3.axisBottom(xScale_line).tickFormat(d3.format("d"))
        const yAxis_consump = d3.axisLeft(yScale_consump)//.tickValues([])
        const yAxis_cost = d3.axisRight(yScale_cost).tickFormat(d3.format("$.1f"))
        // const xAxis_cost = d3.axisBottom(xScale_cost).tickFormat(d3.format("d")).tickValues([])//tickFormat(d3.format("d"))


        const line_consump = d3.line()
            //.defined(d => !isNaN(d.Avg_consum_per_capita))
            .x(d => xScale_line(d.Year)) // set the x values for the line generator
            .y(d => yScale_consump(d.Avg_consum_per_capita)) // set the y values for the line generator 
            .curve(d3.curveMonotoneX) // apply smoothing to the line

        const line_cost = d3.line()
            //.defined(d => !isNaN(d.Avg_cost))
            .x(d => xScale_line(d.Year)) // set the x values for the line generator
            .y(d => yScale_cost(d.Avg_cost)) // set the y values for the line generator 
            .curve(d3.curveMonotoneX) // apply smoothing to the line

        const line1 = svg_linechart
            .selectAll("path.trend")
            .data([cost])
            .join("path")
            .attr("class", "trend")
            .attr("fill", "none")
            .attr("stroke-width", 4)
            .attr("opacity", 1)
            .attr("d", line_consump)

        const line2 = svg_linechart
            .selectAll("path.trend1")
            .data([cost])
            .join("path")
            .attr("class", "trend1")
            .attr("fill", "none")
            .attr("stroke-width", 4)
            .attr("opacity", 1)
            .attr("d", line_cost)


        svg_linechart
            .append("g")
            .attr("class", "axis x-axis-line")
            .attr("transform", `translate(0, ${height_line - margin_line.bottom})`)
            .call(xAxis_line)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "50%")
            .attr("dy", "2.6em")
            .text("Year")
            .attr("font-size", "18")
            .attr("fill", "black")
            .attr('opacity', 0.8)

        svg_linechart
            .append("g")
            .attr("class", "axis y-axis-line")
            .attr("transform", `translate(${margin_line.left},0)`)
            .call(yAxis_consump)
            .append("text")
            .attr("class", "axis-label")
            .attr("y", "28%") //in the middle of line
            .attr("dx", "6.7em")
            .text("Consumption ")
            .attr("font-size", "17")
            .attr("fill", "black")
            .attr('opacity', 0.8)

        svg_linechart
            .append("g")
            .attr("class", "axis y-axis-line")
            .attr("transform", `translate(${width_line - margin_line.right}, 0)`)
            .call(yAxis_cost)
            .append("text")
            .attr("class", "axis-label")
            .attr("y", "80%") //in the middle of line
            .attr("dx", "-27em")
            //.attr("transform", "rotate(-35)")
            .text("Average Cost, $")
            .attr("font-size", "16")
            .attr("fill", "black")
            .attr('opacity', 0.8)

    })
