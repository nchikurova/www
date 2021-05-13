// svg
//         .selectAll(".state")
//         // all of the features of the geojson, meaning all the states as individuals
//         .data(state.geojson.features)
//         .join("path")
//         .attr("d", path)
//         .attr("class", "state")
//         .attr("fill", d => {
//             //console.log("d", d)
//             let value = newData.get(d.properties.NAME);
//             return (value != 0 ? colorScale(value) : "grey")

//         })
//         .style("stroke", "black")
//         .on('mouseover', (event, d) => {
//             //console.log("tooltip d", d)
//             div
//                 .transition()
//                 .duration(50)
//                 .style('opacity', 1);
//             div
//                 .html(
//                     "State: " + "<strong><h3>" + d.properties.NAME + "</strong></h3>" +
//                     "Average Cost per Pack: " + newDataYear.get(d.properties.NAME) +
//                     "<br>" + formatNumber(newData.get(d.properties.NAME))

//                 )
//                 .style("left", (event.pageX + 10) + "px")
//                 .style("top", (event.pageY - 28) + "px");
//         })
//         .on('mouseout', () => {
//             div
//                 .transition()
//                 .duration(100)
//                 .style('opacity', 0);
//         })
