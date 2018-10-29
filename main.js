import * as config from './config.js'
import * as draw from './draw.js'
import * as sim from './simulate.js'

var walks = [];

export function animate(width, height, axons, axonShare, crowdPen, dirPen){
    
    var scaleI, scaleJ;
    scaleI = scaleJ = getScale(width, height);
    var svg = d3.select('body')
        .append('svg')
        .attrs({width: width * scaleJ, 
            height: height * scaleI, id: "gridSvg"});
    var grid = initGrid(height, width);

    draw.drawGrid(svg, grid, height, width, scaleI, scaleJ);
    sim.simulate(svg, grid, true, width, height, axons, axonShare, crowdPen, 
        dirPen, scaleI, scaleJ, config.steps);

}

export function animateCallback(svg, grid){
    console.log("Animation completed.")
}

function getScale(width, height){
    
        return 0.5*(screen.width/width);
}

//Currently unused
export function walkLength(trials, width, height, axons, steps,
    crowdPen, dirPen){
    
    var scale = getScale(width, height);
    walks = [];
    
    for(var i = 0; i <= trials; i++){
        var grid = initGrid(height, width);
        sim.simulate(false, grid, false, width, height, axons, crowdPen, dirPen, scale, steps);
        
    }
    draw.histogram(walks);
    var mean = d3.mean(walks);
    var stdDev = d3.deviation(walks);
}

//Curently unused
export function simulateCallback(lens){

    for(var i = 0; i < lens.length; i++){
        walks.push(lens[i]);
    }
}


function initGrid(height, width){
    
    var grid = new Array(height);
    
    for(var i = 0; i < height; i++){
        grid[i] = new Array(width);
        
        for(var j = 0; j < width; j++){
            grid[i][j] = Math.random() * 
                (config.maxGridPen - config.minGridPen) + 
                config.minGridPen
        }
    }
    return grid
}


function pixelToGrid(px, py){
    var i,j 
    j = Math.floor(px/config.scale);
    i = Math.floor(py/config.scale);
    return [i, j]
}

