import * as config from './config.js'
import * as draw from './draw.js'

export async function simulate(svg, grid){
    
    var positions = new Array(config.steps + 1);
    var walkers = config.startSquares.length;
    var last = new Array(walkers);
    var reached = new Array(walkers);
    
    for(var i = 0; i < config.steps + 1; i++){
        positions[i] = new Array(walkers)
    }
    
    positions[0] = config.startSquares;
    
    for(var k = 0; k < walkers; k++){
        var a,b 
        [a, b] = positions[0][k];
        updatePenalty(grid, a, b);
        reached[k] = false;
        last[k] = [-1, -1]
    }
    
    
    /* Main loop */
    for(var i = 0; i < config.steps; i++){
    
        //Pause for effect
        await sleep(config.delay);
        for(var j = 0; j < walkers; j++){
            
            //Skip walker if target has been reached
            if(reached[j]){
                continue;
            }
            
            var coords, penalties, next, curr
            curr = positions[i][j];
            
            [coords, penalties] = getNeighboors(grid, curr)
            next = chooseStep(coords, penalties, last[j]);
            moveTo(positions, next, i, j);
            draw.drawLine(svg, curr[1], curr[0], next[1], next[0]);
            updatePenalty(grid, next[0], next[1]);
            
            //Check if target has been reached for walker j
            if(targetReached(next)){
                reached[j] = true;
            }
            last[j] = curr;   
        }
    }
}

function posEquals(pos1, pos2){
    return (pos1[0] == pos2[0] && pos1[1] == pos2[1]);
}

function targetReached(pos){
    
    //Check if right edge has been reached
    return (pos[1] == (config.width-1))
}

function updatePenalty(grid, i, j){
    
    var squareId = draw.indexToId(i, j);
    var penalty = grid[i][j] + config.crowdPen;
    if (penalty > 1){
        penalty = 1;
    }
    
    grid[i][j] = penalty;
    var color = draw.getColor(penalty);
    var square = document.getElementById(squareId);
    square.style.fill = color;
}

function moveTo(positions, next, iteration, walker){ 

    positions[iteration+1][walker] = next;
}

function chooseStep(coords, penalties, last){
    
    var min = 1e9
    var index;
    for(var i = 0; i < coords.length; i++){
        if (penalties[i] <= min && !(posEquals(coords[i], last))){
            
            min = penalties[i];
            index = i;
        }
    }
    return coords[index]
}

function getNeighboors(grid, pos){
    
    
    var i, j
    [i, j] = pos;
    var coords = [];
    var penalties = [];
    
    //right
    if(onGrid(i, j+1)){
        coords.push([i, j+1])
        penalties.push(grid[i][j+1] + config.rightPen)
    }
    //down
    if(onGrid(i-1, j)){
        coords.push([i-1, j])
        penalties.push(grid[i-1][j] + config.downPen)
    }
    //up
    if(onGrid(i+1, j)){
        coords.push([i+1, j])
        penalties.push(grid[i+1][j] + config.upPen)
    }
    //left
    if(onGrid(i, j-1)){
        coords.push([i, j-1])
        penalties.push(grid[i][j-1] + config.leftPen)
    }
    return [coords, penalties]
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function onGrid(i, j){
    return !(i < 0 || i >= config.height || j < 0 || j >= config.width)
}