import * as config from './config.js'

run()

function run(){

    grid = initGrid();
    console.log(grid);
}

function initGrid(){
    
    var grid = new Array(config.height);
    for(var i = 0; i < config.height; i++){
    
        grid[i] = new Array(config.width);
        for(var j = 0; j < config.width; j++){
            
            grid[i][j] = Math.floor(Math.random() * 
                (config.maxGridPenalty - config.minGridPanelty) + 
                consts.minGridPenalty)
        }
    }
}