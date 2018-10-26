//Very ugly workaround

var walks = [];




self.onmessage = function (msg) {
   
    var data = msg.data;
    var trials = data[0];
    var width = data[1];
    var height = data[2];
    var axons = data[3];
    var steps =  data[4];
    var crowdPen = data[5];
    var dirPen = data[6];
    
    console.log(trials, width, height, axons, steps, crowdPen, dirPen)
    
    for(var i = 0; i <= trials; i++){

        var grid = initGrid(height, width);
        simulate(grid, width, height, axons, crowdPen, dirPen, steps);
        
    }
    postMessage(walks);
    close();
}

//Duplicate of initGrid in main.js. Careful! Hardcoded values here.
function initGrid(height, width){
    
    var maxGridPen = 0.5;
    var minGridPen = 0;
    var grid = new Array(height);
    
    for(var i = 0; i < height; i++){
        grid[i] = new Array(width);
        
        for(var j = 0; j < width; j++){
            grid[i][j] = Math.random() * 
                (maxGridPen - minGridPen) + 
                minGridPen
        }
    }
    return grid
}


//Below is a re-write of the content in simulate.js. Everything related to animation
//has been removed. This means any changes has to be made in both
//places...
async function simulate(grid, width, height, axons, crowdPen, dirPen, 
    steps){

    var startGrid = grid.slice(); //Keep a copy of the initial grid 
    var positions = new Array(steps + 1);
    var follows = new Array(axons); //[followingId, timeStep, IdStep]
    var visitedGrid = createVisitedGrid(height, width); //Keep track of which axons have visit
                                                        //which square.
    var last = new Array(axons);
    var reached = new Array(axons);
    
    for(var i = 0; i < steps + 1; i++){
        positions[i] = new Array(axons)
    }
    
    positions[0] = setStartPositions(height, axons);
    
    for(var k = 0; k < axons; k++){
        var a,b 
        [a, b] = positions[0][k];
        updateVisitedGrid(visitedGrid, [a, b], k);
        updatePenalty(grid, startGrid, visitedGrid, a, b, crowdPen);
        reached[k] = false;
        last[k] = [-1, -1]
    }
 
    
    /* Main loop */
    for(var i = 0; i < steps; i++){
    
        
        for(var j = 0; j < axons; j++){
            
            //Skip axon if target has been reached
            if(reached[j]){
                continue;
            }
            
            var coords, penalties, next, curr
            curr = positions[i][j];
            
            [coords, penalties] = getNeighboors(grid, curr, height, width, 
                dirPen)
            next = chooseStep(positions, coords, penalties, last[j], follows, j, i);
            updateVisitedGrid(visitedGrid, next, j);
            moveTo(positions, next, i, j);
            updatePenalty(grid, startGrid, visitedGrid, next[0], next[1], crowdPen);
            collision(positions, visitedGrid, follows, next, j, i);
            
            
            //Check if target has been reached for walker j
            if(targetReached(next, width)){
                reached[j] = true;
            }
            last[j] = curr;  
        }
        if(checkForStop(reached)){
            break;
        }
    }
    
    getWalkLengths(positions, axons)
}

//Stop if there are no more active axons
function checkForStop(reached){
    
    for(var i = 0; i < reached.length; i++){
        if(!reached[i]){
            return false;
        }
    }
    return true; 
}

//Check and handle a potential collision
function collision(positions, visitedGrid, follows, pos, selfId, iteration){
    
    //If axon is already following, no need to do anything
    if(follows[selfId]){
        return
    }
    
    //Check if square has been visited
    var numVisit = visitedGrid[pos[0]][pos[1]].length;
    if (numVisit > 0){
        
        //Only assign to follows if it was another axon
        for(var i = 0; i < numVisit; i++){
            var candidate = visitedGrid[pos[0]][pos[1]][i];
            if(candidate != selfId){
            
                //Avoid having two axons follows eachother
                var candData = follows[candidate];
                if(candData && candData[0][0] == selfId){
                    continue;
                }
                
                var idStep = getIdStep(positions, candidate, pos, iteration);
                follows[selfId] = [];
                follows[selfId].push([candidate, iteration, idStep]);
                break;
               
            }
        }
    }
}

function getIdStep(positions, followingId, pos, iteration){
    
    for(var i = 0; i <= iteration + 1; i++){
        if (posEquals(positions[i][followingId], pos)){
            return i;
        }
    }
}

function updateVisitedGrid(visitedGrid, pos, id){
    visitedGrid[pos[0]][pos[1]].push(id);
}

function createVisitedGrid(height, width){

    var grid = new Array(height);
    
    for(var i = 0; i < height; i++){
        grid[i] = new Array(width);
        
        for(var j = 0; j < width; j++){
            grid[i][j] = [];
        }
    }
    return grid
}

//Return start squares on the form [[x, y], [x, y]]
function setStartPositions(height, axons){
    
    var squares = [];
    var yval = linspace(0, height-1, axons);
    for(var i = 0; i < axons; i++){
        squares.push([yval[i], 0]);
    }
    return squares;
}

//Discrete linspace
function linspace(a, b, n) {

    if(typeof n === "undefined"){
        n = Math.max(Math.round(b-a)+1,1);
    } 
    if(n<2){ 
        return n===1?[a]:[];
    }
    
    var i,arr = Array(n);
    n--;
    for(i=n;i>=0;i--){ 
        arr[i] = Math.round((i*b+(n-i)*a)/n); 
    }
    return arr;
}

//Return walk lengths [axon1_length, axon2_length, ...]
function getWalkLengths(positions, axons){
    
    
    var lens = new Array(axons).fill(0);
    for(var i = 0; i < positions.length; i++){
        for(var j = 0; j < axons; j++){
            if(positions[i][j]){
                lens[j] += 1;
            }
        }
    }
    for(var i = 0; i < lens.length; i++){
        walks.push(lens[i]);
    }
}

function posEquals(pos1, pos2){
    return (pos1[0] == pos2[0] && pos1[1] == pos2[1]);
}

function targetReached(pos, width){
    
    //Check if right edge has been reached
    return (pos[1] == (width-1))
}



function updatePenalty(grid, startGrid, visitedGrid, i, j, crowdPen){
   
    var n = visitedGrid[i][j].length;
    var penalty = startGrid[i][j] + n*crowdPen;
    
    if (penalty > 1){
        penalty = 1;
    }
    
    grid[i][j] = penalty;
}


function moveTo(positions, next, iteration, walker){ 

    positions[iteration+1][walker] = next;
}

function chooseStep(positions, coords, penalties, last, follows, selfId, iteration){
    

    if (follows[selfId]){
        var followingId = follows[selfId][0][0];
        var timeStep = follows[selfId][0][1];
        var idStep = follows[selfId][0][2];
        return positions[idStep + iteration - timeStep][followingId]
    }
    
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
    //up
    if(onGrid(i-1, j, height, width)){
        coords.push([i-1, j])
        penalties.push(grid[i-1][j] + dirPen)
    }
    //down
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

function onGrid(i, j, height, width){
    return !(i < 0 || i >= height || j < 0 || j >= width)
}