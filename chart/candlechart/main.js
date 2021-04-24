// source: https://observablehq.com/@d3/candlestick-chart
width = 360;

height = 240;

margin = { top: 20, bottom: 50, left: 40, right: 40 };
let svg;

let state = {
    data: null
};
parseDate = d3.utcParse("%Y-%m-%d")

Promise.all([

    d3.csv("../data/TSLA.csv",
        d => ({
            date: new Date(parseDate(d["Date"])),
            high: +d["High"],
            low: +d["Low"],
            open: +d["Open"],
            close: +d["Close"]
        }))

]).then(([data]) => {

    state.data = data;

    console.log("state: ", state);
    init();

});

function init() {

    svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("viewBox", "0 0 400 320")
        .append("g")
        .attr("transform", "translate(0,0)")

    console.log('state.data[0]', state.data[0])
    x = d3.scaleBand()

        .domain(d3.utcDay
            .range(state.data[0].date, +state.data[state.data.length - 1].date + 1)
            .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
        .range([margin.left, width - margin.right])
        .padding(0.2)

    // console.log("x domain", x.domain())
    y = d3.scaleLog()
        .domain([d3.min(state.data, d => d.low), d3.max(state.data, d => d.high)])
        .rangeRound([height - margin.bottom, margin.top])

    // console.log("y domain", y.domain())
    xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickValues(d3.utcMonday
                .every(width > 720 ? 1 : 2)
                .range(state.data[0].date, state.data[state.data.length - 1].date))

            .tickFormat(d3.utcFormat("%-m/%-d")))
        .call(g => g.select(".domain").remove())

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y)
            .tickFormat(d3.format("$~f"))
            .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - margin.left - margin.right))
        .call(g => g.select(".domain").remove())

    // function formatChange(y1, y0) {
    //     const f = d3.format("+.2%");
    //     return (y0, y1) => f((y1 - y0) / y0);
    // }
    const formatValue = d3.format(".2f")

    const formatDate = d3.utcFormat("%B %-d, %Y")

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    const g = svg.append("g")
        //  .attr("stroke-linecap", "round")
        .attr("stroke", "black")
        .selectAll("g")
        .data(state.data)
        .join("g")
        .attr("transform", d => `translate(${x(d.date)},0)`)
    //  .attr("font-size", "12px")

    g.append("line")
        .attr("y1", d => y(d.low))
        .attr("y2", d => y(d.high));

    g.append("line")
        .attr("y1", d => y(d.open))
        .attr("y2", d => y(d.close))
        .attr("stroke-width", x.bandwidth())
        .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0]
            : d.close > d.open ? d3.schemeSet1[2]
                : d3.schemeSet1[8]);

    //     g.append("title")
    //         .text(d => `${formatDate(d.date)}
    // Open: ${formatValue(d.open)}
    // Close: ${formatValue(d.close)} (${formatChange(d.open, d.close)})
    // Low: ${formatValue(d.low)}
    // High: ${formatValue(d.high)}`)
    //         .style("font-size", "12px");

}
