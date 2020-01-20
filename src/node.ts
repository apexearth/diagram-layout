import {createData} from './generate'
import {createDiagram} from './diagram'

const d3 = require('d3');

const width = 800;
const height = 800;

const data = createData();

const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("stroke-width", 2);

const g = svg.append("g")
    .attr("cursor", "grab");

const zoomed = () => {
    g.attr("transform", d3.event.transform);
};

const render = (diagram) => {
    g.selectAll("line")
        .data(diagram.lines)
        .join("line")
        .attr("x1", d => d.x1 + 100)
        .attr("y1", d => d.y1 + height / 2)
        .attr("x2", d => d.x2 + 100)
        .attr("y2", d => d.y2 + height / 2)
        .attr("stroke-width", 1)
        .attr("stroke", "#aaa");

    g.selectAll("rect")
        .data(diagram.rectangles)
        .join("rect")
        .attr("x", d => d.x + 100)
        .attr("y", d => d.y + height / 2)
        // .attr("width", d => d.width / 10)
        // .attr("height", d => d.height / 10)
        // .transition()
        // .duration(300)
        // .delay((d, i) => i * 10)
        .attr("width", d => d.width)
        .attr("height", d => d.height)
        .attr("fill", (d, i) => d3.schemeDark2[i % 8])

};


setInterval(() => {
    render(createDiagram(data))
    svg.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));

}, 100);

const node = svg.node();

export default node