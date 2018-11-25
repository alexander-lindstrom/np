import * as config from './config.js'

export function drawGrid(svg, grid, height, width, scaleI, scaleJ){
    
    fillGrid(svg, grid, height, width, scaleI, scaleJ) 
}

function fillGrid(svg, grid, height, width, scaleI, scaleJ){

    for(var i = 0; i < height; i++){
        for(var j = 0; j < width; j++){
        
            fillSquare(svg, j, i, scaleI, scaleJ, grid[i][j], width)
        }
    }
}

export function getColor(penalty){
    
    var intensity = 255  * (1 - penalty);
    return d3.rgb(intensity, intensity, intensity);
}

function fillSquare(svg, x, y, scaleI, scaleJ, penalty, width){
    
    var squareId = "s" + indexToId(y, x, width);
    var color = getColor(penalty);
    svg.append('rect')
        .attrs({x: x*scaleJ, y: y*scaleI, width: scaleJ, height: scaleI, fill: color,
            class: "square", id: squareId})
}

export function indexToId(i, j, width){
    return i*width + j;
}

export function updateSquareFill(squareIndex, penalty){
    
    var color = getColor(penalty);
    var id = "#s" + squareIndex; 
    d3.select(id).transition().duration(500).style("fill", color);
       
}


export function drawLine(svg, fromX, fromY, toX, toY, scaleI, scaleJ, type){

    fromX = fromX*scaleJ + scaleJ/2;
    fromY = fromY*scaleI + scaleI/2;
    toX =  toX*scaleJ + scaleJ/2;
    toY = toY*scaleI + scaleI/2;
    
    if (type){
        var color = "red"
    }  
    else{
        var color = "blue"
    }
    
    svg.append('line')
        .attrs({x1: fromX, y1: fromY, x2: fromX,
        y2: fromY, class: "line", stroke: color})
        .transition()
        .duration(500)
        .attr({
            x2: toX,
            y2: toY
        })
}

function intOnly(data){
    
    var cleaned = [];
    for(var i = 0; i < data.length; i++){
        if (Number.isInteger(data[i])){
            cleaned.push(data[i]);
        }
    }
    return cleaned;
}

export function histogram(values, divId, svgId){

    
    var color = "steelblue";
    var formatCount = d3.format(",.0f");

    var margin = {top: 20, right: 30, bottom: 30, left: 70},
        width = screen.width*0.40 - margin.left - margin.right,
        height = screen.height*0.30 - margin.top - margin.bottom;
        
    var max = d3.max(values);
    var min = d3.min(values);
    var x = d3.scale.linear()
          .domain([min, max])
          .range([0, width]);
    
    //Uniformly spaced bins
    var data = d3.layout.histogram()
        .bins(intOnly(x.ticks(60)))
        (values);
               
    var yMax = d3.max(data, function(d){return d.length});
    var yMin = d3.min(data, function(d){return d.length});
    var colorScale = d3.scale.linear()
                .domain([yMin, yMax])
                .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
                
    var y = d3.scale.linear()
        .domain([0, yMax])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
        
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
        

    var svg = d3.select(divId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", svgId)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", (x(data[0].dx) - x(0)) - 1)
        .attr("height", function(d) { return height - y(d.y); })
        .attr("fill", function(d) { return colorScale(d.y) });
    
    /* Bin value above rectangle:
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -12)
        .attr("x", (x(data[0].dx) - x(0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });
        
   */

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
        
    return svg;
}


























