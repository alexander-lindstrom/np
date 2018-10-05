import * as config from './config.js'

export function drawGrid(svg, grid){
    
    fillGrid(svg, grid, config.height, config.width, config.scale) 
}

function fillGrid(svg, grid, height, width, scale){

    for(var i = 0; i < height; i++){
        for(var j = 0; j < width; j++){
        
            fillSquare(svg, j, i, scale, grid[i][j])
        }
    }
}

export function getColor(penalty){
    
    var intensity = 255  * (1 - penalty);
    return d3.rgb(intensity, intensity, intensity);
}

function fillSquare(svg, x, y, scale, penalty){
    
    var squareId = indexToId(y, x);
    var color = getColor(penalty);
    svg.append('rect')
        .attrs({x: x*scale, y: y*scale, width: scale, height: scale, fill: color,
            class: "square", id: squareId})
}

export function indexToId(i, j){
    return i*config.width + j;
}

export function drawLine(svg, fromX, fromY, toX, toY){

    var scale = config.scale;
    fromX = fromX*scale + scale/2;
    fromY = fromY*scale + scale/2;
    toX =  toX*scale + scale/2;
    toY = toY*scale + scale/2;
    
       
    svg.append('line')
        .attrs({x1: fromX, y1: fromY, x2: toX,
            y2: toY, class: "line"})
}
