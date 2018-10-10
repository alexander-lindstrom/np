import * as config from './config.js'
import * as draw from './draw.js'
import * as main from './main.js'

//animate = true for animation
export async function simulate(svg, grid, animate, width=config.width,
    crowdPen=config.crowdPen, dirPen=config.dirPen){
    
    var height = config.height;
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
    
        if (animate){
            await sleep(config.delay);
        }
        
        for(var j = 0; j < walkers; j++){
            
            //Skip walker if target has been reached
            if(reached[j]){
                continue;
            }
            
            var coords, penalties, next, curr
            curr = positions[i][j];
            
            [coords, penalties] = getNeighboors(grid, curr, height, width, 
                dirPen)
            next = chooseStep(coords, penalties, last[j]);
            moveTo(positions, next, i, j);
            updatePenalty(grid, next[0], next[1], crowdPen);
            
            //Animate if enabled
            if (animate){
                
                
                draw.drawLine(svg, curr[1], curr[0], next[1], next[0]);
                updateSquareColor(grid, next[0], next[1]);
            }
            
            //Check if target has been reached for walker j
            if(targetReached(next, width)){
                reached[j] = true;
            }
            last[j] = curr;   
        }
    }
    if(!animate){
        getWalkLengths(positions, walkers);
    }
    
}

//Return walk lengths [walker1_length, walker2_length, ...]
function getWalkLengths(positions, walkers){
    
    
    var lens = new Array(walkers).fill(0);
    for(var i = 0; i < positions.length; i++){
        for(var j = 0; j < walkers; j++){
            if(positions[i][j]){
                lens[j] += 1;
            }
        }
    }
    main.simulateCallback(lens);
}

function posEquals(pos1, pos2){
    return (pos1[0] == pos2[0] && pos1[1] == pos2[1]);
}

function targetReached(pos, width){
    
    //Check if right edge has been reached
    return (pos[1] == (width-1))
}

function updateSquareColor(grid, i, j){
    
    var squareId = draw.indexToId(i, j);
    draw.updateSquareFill(squareId, grid[i][j]);
}

function updatePenalty(grid, i, j, crowdPen){
   
    var penalty = grid[i][j] + crowdPen;
    if (penalty > 1){
        penalty = 1;
    }
    
    grid[i][j] = penalty;
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

function getNeighboors(grid, pos, height, width, dirPen){
    
    
    var i, j
    [i, j] = pos;
    var coords = [];
    var penalties = [];
    
    //right
    if(onGrid(i, j+1, height, width)){
        coords.push([i, j+1])
        penalties.push(grid[i][j+1] + 0)
    }
    //down
    if(onGrid(i-1, j, height, width)){
        coords.push([i-1, j])
        penalties.push(grid[i-1][j] + dirPen)
    }
    //up
    if(onGrid(i+1, j, height, width)){
        coords.push([i+1, j])
        penalties.push(grid[i+1][j] + dirPen)
    }
    //left
    if(onGrid(i, j-1, height, width)){
        coords.push([i, j-1])
        penalties.push(grid[i][j-1] + dirPen*2)
    }
    return [coords, penalties]
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function onGrid(i, j, height, width){
    return !(i < 0 || i >= height || j < 0 || j >= width)
}