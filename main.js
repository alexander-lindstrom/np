import * as config from './config.js'
import * as draw from './draw.js'
import * as sim from './simulate.js'

var walks = [];

export function animate(){

    
    var svg = d3.select('body')
        .append('svg')
        .attrs({width: config.width * config.scale, 
            height: config.height * config.scale});
    var grid = initGrid(config.height, config.width);
    draw.drawGrid(svg, grid, config.height, config.width);
    onHover(svg, grid);
    sim.simulate(svg, grid, true);

}

export function walkLength(trials, width, crowdPen, dirPen){
    
    walks = [];
    console.log(trials, width, crowdPen, dirPen);
    
    //var checkpoints = [Math.floor(0.4*trials), Math.floor(0.6*trials), 
    //    Math.floor(0.8*trials), trials];
    //var svg;
    
    for(var i = 0; i <= trials; i++){
        var grid = initGrid(config.height, width);
        sim.simulate(false, grid, false, width, crowdPen, dirPen);
        
    }
    draw.histogram(walks);
    var mean = d3.mean(walks);
    var stdDev = d3.deviation(walks);
    console.log(mean, stdDev);
}

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

function onHover(svg, grid){
    
    var i,j 
    var px, py
    
    svg.on('touchmove mousemove', function() {
        [px, py] = d3.mouse(this);
        [i, j] = pixelToGrid(px, py)
        document.getElementById("hoverPenalty").innerHTML = "Penalty: " + 
            Number(grid[i][j].toFixed(2));
    });
}

function pixelToGrid(px, py){
    var i,j 
    j = Math.floor(px/config.scale);
    i = Math.floor(py/config.scale);
    return [i, j]
}