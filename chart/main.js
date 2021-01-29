

let bardata = [];

for (var i = 0; i < 100; i++) {
    bardata.push(Math.random() * 30);
}

var height = 440,
    width = 700,
    tempColor;

var yScale = d3.scaleLinear()
    .domain([0, d3.max(bardata)])
    .range([0, height - 40])

var xScale = d3.scaleBand()
    .domain(bardata)
    .range([0, width])
    .paddingInner(.1)
    .paddingOuter(.1)

var colors = d3.scaleLinear()
    .domain([0, bardata.length * .33,
        bardata.length * .66,
        bardata.length])
    .range(['#B58929', '#C61C6F',
        '#268BD2', '#85992C'])

var myChart = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .selectAll('rect')
    .data(bardata)
    .enter()
    .append('rect')

    .attr('fill', (d, i) => colors(i)) //if i want the color to be ralated to the index
    .attr('height', d => yScale(d))
    .attr('y', d => height - yScale(d))

    .attr('width', d => xScale.bandwidth())
    // .attr('height', 0)
    .attr('x', d => xScale(d))
    // .attr('y', height)

    .on('mouseover', function (event, d) {

        tooltip.transition()
            .duration(200)
            .style('opacity', .9)

        tooltip.html('<div style="font-size: 20; font-weight: bold">' +
            d + '</div>')
            .style('left', (event.pageX - 35 + 'px'))
            .style('top', (event.pageY - 30 + 'px'))

        tempColor = this.style.fill;
        d3.select(this)
            .style('fill', 'lightyellow')
    })
    .on('mouseout', function (d) {

        tooltip.html('')
        d3.select(this)

            .style('fill', tempColor)
    });

var tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0)

// myChart.transition()
//     .duration(2000)
//     .attr('height', d => yScale(d))
//     .attr('y', d => height - yScale(d))
//     .delay((d, i) => i * 20)
//     .ease(d3.easeLinear)
//.remove().duration(2000)


const button1 = d3.select('#tr_2');

button1.on('change', function (d) {
    myChart.transition().duration(2000)
        .attr('y', d => height - yScale(d))
        .delay((d, i) => i * 30)
        .style('fill', 'brown')
        .transition().duration(2000)
        .attr('y', d => height - yScale(d))
        .delay((d, i) => i * 30)
        .style('fill', 'orange')
        .transition().duration(2000)
        .attr('y', d => height - yScale(d))
        .delay((d, i) => i * 30)
        .style('fill', 'yellow')
        .transition().duration(2000)
        .attr('y', d => height - yScale(d))
        .delay((d, i) => i * 30)
        .style('fill', 'green')
});
const button2 = d3.select('#tr_1');

button2.on('change', function (d) {
    myChart.transition().duration(2000)
        .attr('y', d => height - yScale(d))
        .delay((d, i) => i * 20)
        .style('fill', (d, i) => colors(i))
});
const button3 = d3.select('#tr_3');

button3.on('click', function (d) {
    myChart
        .transition()
        .duration(2000)
        .attr('height', d => yScale(d))
        .attr('y', d => height - yScale(d) / 1.5)
        .delay((d, i) => i * 20)
        .ease(d3.easeLinear)
        .style("fill", "brown")

});

const button4 = d3.select('#tr_4');

button4.on('click', function (d) {
    myChart
        .transition()
        .duration(2000)
        .attr('height', d => height - yScale(d))// - height)
        .attr('y', d => yScale(d) / 2)// - yScale(d) / 0.5)
        .delay((d, i) => i * 20)
        .ease(d3.easeBounce)
        .style("fill", "#C61C6F")

});

const button5 = d3.select('#tr_5');

button5.on('change', function (d) {

    myChart.transition().duration(2000)
        .attr('height', d => yScale(d))
        .attr('y', d => height - yScale(d) / 2)
        .delay((d, i) => i * 20)
        .style('fill', '#268BD2')
        .ease(d3.easeBounceOut)

});
