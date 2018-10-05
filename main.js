import * as config from './config.js'
import * as draw from './draw.js'
import * as sim from './simulate.js'

run()

function run(){

    var grid = initGrid();
    var svg = d3.select('body')
        .append('svg')
        .attrs({width: config.width * config.scale, 
            height: config.height * config.scale});
    draw.drawGrid(svg, grid);
    onHover(svg, grid);
    sim.simulate(svg, grid);
}

function initGrid(){
    
    var grid = new Array(config.height);
    
    for(var i = 0; i < config.height; i++){
        grid[i] = new Array(config.width);
        
        for(var j = 0; j < config.width; j++){
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
        console.log(i,j)
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