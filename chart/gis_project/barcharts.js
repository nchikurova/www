'use strict';


Promise.all([
    d3.csv("../data/topten.csv"),
    d3.csv("../data/Education.csv", d => ({
        Education: d.Education,
        Data_Value: +d.Data_Value
    })),
    d3.csv("../data/fed_tax_topten.csv", d => ({
        LocationDesc: d.LocationDesc,
        Data_Value: +d.Data_Value
    })),
    d3.csv("../data/by_region.csv", d => ({
        Region: d["U.S. Census Region"],
        Percentage: +d.Percentage
    }))
])
    .then(([data_bar, data_bar2, data_fed, data_reg]) => {
        console.log("data_region", data_reg);

        let width_fed = 380; //bar-one
        let height_fed = 400;
        let margin_fed = { top: 20, bottom: 50, left: 160, right: 20 };

        let width_bar = 380; //bar-two
        let height_bar = 400;
        let margin_bar = { top: 20, bottom: 50, left: 160, right: 40 };

        let width_bar2 = 400; //bar-education
        let height_bar2 = 360;
        let margin_bar2 = { top: 20, bottom: 50, left: 235, right: 20 };


        let width_reg = 360; //bar-region
        let height_reg = 200;
        let margin_reg = { top: 20, bottom: 40, left: 100, right: 20 };

        // FEDERAL AND STATE TAX TOP TEN BARCHART

        const svg_fed = d3
            .select("#bar-one")
            .append("svg")
            .attr("width", width_fed)
            .attr("height", height_fed);


        const div_fed = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        const yScale_fed = d3
            .scaleBand()
            .domain(["District of Columbia", "Connecticut", "New York", "Rhode Island", "Minnesota", "Massachusetts", "Hawaii", "Vermont", "Washington",])
            .range([margin_fed.top, height_fed - margin_fed.bottom])
            .paddingInner(0.2)
            .paddingOuter(0.2);


        const xScale_fed = d3
            .scaleLinear()
            .domain([0, d3.max(data_fed, d => d.Data_Value)])//58])
            .range([margin_fed.left, width_fed - margin_fed.right]);

        //console.log("x_bar", xScale_bar.domain(), "y_bar", yScale_bar.domain())
        // reference for d3.axis: https://github.com/d3/d3-axis
        const xAxis_fed = d3.axisBottom(xScale_fed)//.ticks(data_bar.length)
        const yAxis_fed = d3.axisLeft(yScale_fed)//.tickValues([])

        svg_fed
            .selectAll("rect")
            .data(data_fed)
            .join("rect")
            .attr("class", "rect.bar")
            .attr("y", d => yScale_fed(d.LocationDesc))
            .attr("x", margin_fed.left)
            .attr("height", yScale_fed.bandwidth())
            .attr("width", d => xScale_fed(d.Data_Value) - margin_fed.left)
            .attr("fill", "lightgrey")//"rgb(190, 184, 192)")

            .on('mouseover', (event, d) => {
                // console.log("tooltip d", d)
                div_fed
                    .transition()
                    .duration(50)
                    .style('opacity', 1);
                div_fed
                    .html("State: " + "<h3><strong>" + d.LocationDesc + "</strong></h3>" +
                        "Federal and State Tax: " + "<strong>" + d.Data_Value + "</strong>"
                    )

                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on('mouseout', () => {
                div_fed
                    .transition()
                    .duration(100)
                    .style('opacity', 0);
            })

        // append text
        const text5 = svg_fed
            .selectAll("text")
            .data(data_fed)
            .join("text")
            .attr("class", "label_bar")
            .attr("x", margin_fed.left + 20)
            .attr("y", d => yScale_fed(d.LocationDesc))
            .text(d => `${"$" + d.Data_Value}`)
            .attr("dy", "1em");

        svg_fed
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height_fed - margin_fed.bottom})`)
            .call(xAxis_fed)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "60%")
            .attr("dy", "2.2em")
            .text("Federal and State Tax, $")
            .attr("font-size", "16")
            .attr("fill", "black")
            .attr('opacity', 0.8)

        svg_fed
            .append("g")
            .attr("class", "axis y-axis-scatter")
            .attr("transform", `translate(${margin_fed.left},0)`)
            .call(yAxis_fed)

        // TOP 10 STATES WITH THE HIGHEST FED AND STATE TAX AS A % OF RETAIL PRICE
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
            .attr("fill", "rgb(190, 184, 192)")
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
            .attr("class", "label_bar")
            .attr("x", margin_bar.left + 20)
            .attr("y", d => yScale_bar(d.LocationDesc))
            .text(d => `${d.Data_Value + "%"}`)
            .attr("dy", "1em");

        svg_barchart
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height_bar - margin_bar.bottom})`)
            .call(xAxis_bar)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "60%")
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

        // EDUCATION BARCHART

        const svg_barchart2 = d3
            .select("#bar-education")
            .append("svg")
            .attr("width", width_bar2)
            .attr("height", height_bar2);

        const div_bar2 = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const yScale_bar2 = d3
            .scaleBand()
            .domain(["GED", "Some High School (no degree)",
                "A High School Diploma",
                "Some College (no degree)",
                "Associate's Degree",
                "An Undergraduate Degree",
                "A Graduate Degree"])
            .range([margin_bar2.top, height_bar2 - margin_bar2.bottom])
            .paddingInner(0.2)
            .paddingOuter(0.2);


        const xScale_bar2 = d3
            .scaleLinear()
            .domain([0, d3.max(data_bar2, d => d.Data_Value)])//58])
            .range([margin_bar2.left, width_bar2 - margin_bar2.right]);

        //console.log("x_bar", xScale_bar.domain(), "y_bar", yScale_bar.domain())
        // reference for d3.axis: https://github.com/d3/d3-axis
        const xAxis_bar2 = d3.axisBottom(xScale_bar2)//.ticks(data_bar.length)
        const yAxis_bar2 = d3.axisLeft(yScale_bar2)//.tickValues([])

        svg_barchart2
            .selectAll("rect")
            .data(data_bar2)
            .join("rect")
            .attr("class", "rect.bar")
            .attr("y", d => yScale_bar2(d.Education))
            .attr("x", margin_bar2.left)//d => xScale_bar(d))
            .attr("height", yScale_bar2.bandwidth())
            .attr("width", d => xScale_bar2(d.Data_Value) - margin_bar2.left)
            .attr("fill", "rgb(190, 184, 192)")

            .on('mouseover', (event, d) => {
                // console.log("tooltip d", d)
                div_bar2
                    .transition()
                    .duration(50)
                    .style('opacity', 1);
                div_bar2
                    .html("Education: " + "<h3><strong>" + d.Education + "</strong></h3>" +
                        "Percentage of people: " + "<strong>" + d.Data_Value + "%" + "</strong>"
                    )

                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on('mouseout', () => {
                div_bar2
                    .transition()
                    .duration(100)
                    .style('opacity', 0);
            })

        // append text
        const text4 = svg_barchart2
            .selectAll("text")
            .data(data_bar2)
            .join("text")
            .attr("class", "label_bar")
            .attr("x", margin_bar2.left + 30)
            .attr("y", d => yScale_bar2(d.Education))
            .text(d => `${d.Data_Value + "%"}`)
            .attr("dy", "1.2em");

        svg_barchart2
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height_bar2 - margin_bar2.bottom})`)
            .call(xAxis_bar2)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "60%")
            .attr("dy", "2.2em")
            .text("Percentage")
            .attr("font-size", "16")
            .attr("fill", "black")
            .attr('opacity', 0.8)

        svg_barchart2
            .append("g")
            .attr("class", "axis y-axis-scatter")
            .attr("transform", `translate(${margin_bar2.left},0)`)
            .call(yAxis_bar2)


        ///////////------------------//////////////////
        //BAR CHART BY REGION

        const svg_reg = d3
            .select("#bar-region")
            .append("svg")
            .attr("width", width_reg)
            .attr("height", height_reg);

        const div_reg = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)

        const yScale_reg = d3
            .scaleBand()
            .domain(["Midwest", "South", "Northeast", "West"])
            .range([margin_reg.top, height_reg - margin_reg.bottom])
            .paddingInner(0.2)
            .paddingOuter(0.2)

        const xScale_reg = d3
            .scaleLinear()
            .domain([0, d3.max(data_reg, d => d.Percentage)])
            .range([margin_reg.left, width_reg - margin_reg.right]);

        //console.log("x", xScale.domain(), "y", yScale.domain())

        const xAxis_reg = d3.axisBottom(xScale_reg)
        const yAxis_reg = d3.axisLeft(yScale_reg)//.tickValues([])

        // reference for d3.axis: https://github.com/d3/d3-axis

        svg_reg
            .selectAll("rect")
            .data(data_reg)
            .join("rect")
            .attr("class", "rect")
            .attr("x", margin_reg.left)
            .attr("y", d => yScale_reg(d.Region))
            .attr("height", yScale_reg.bandwidth())
            .attr("width", d => xScale_reg(d.Percentage) - margin_reg.left)
            .attr("fill", "lightgrey")
            .on('mouseover', (event, d) => {
                // console.log("tooltip d", d)
                div_reg
                    .transition()
                    .duration(50)
                    .style('opacity', 1);
                div_reg
                    .html("U.S. Census Region: " + "<h3><strong>" + d.Region + "</strong></h3>" +
                        "Percentage: " + "<strong>" + d.Percentage + "%" + "</strong>"
                    )

                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on('mouseout', () => {
                div_reg
                    .transition()
                    .duration(100)
                    .style('opacity', 0);
            })
        svg_reg
            .selectAll("text")
            .data(data_reg)
            .join("text")
            .attr("class", "label_bar")
            .attr("y", d => yScale_reg(d.Region))
            .attr("x", margin_reg.left + 20)
            .text(d => `${d.Percentage + "%"}`)
            .attr("dy", "1.2em")


        svg_reg
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height_reg - margin_reg.bottom})`)
            .call(xAxis_reg)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "50%")
            .attr("dy", "2.2em")
            .text("Percentage")
            .attr("font-size", "16")
            .attr("fill", "black")
            .attr('opacity', 0.8)

        svg_reg
            .append("g")
            .attr("class", "axis y-axis-scatter")
            .attr("transform", `translate(${margin_reg.left},0)`)
            .call(yAxis_reg)

    })

