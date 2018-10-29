import * as main from './main.js'
import * as config from './config.js'
import * as draw from './draw.js'

setSliders()
setRunButton()

function setRunButton(){
    
    
    
    $("#runButton").button().click(function(){
    
        
        //Get slider values
        var trials = $("#trials .slider").slider("value");
        var width = $("#width .slider").slider("value");
        var crowdPen = $("#crowdPen .slider").slider("value")/100;
        var dirPen = $("#dirPen .slider").slider("value")/100;
        var height = $("#height .slider").slider("value");
        var axons = $("#axons .slider").slider("value");
        var axonShare = $("#axonType .slider").slider("value")/100;
       
        //Kill any web worker
        if (typeof(w) !== "undefined") {
            w.terminate();
        }
        
        //Remove svgs
        removeElement("gridSvg");
        removeElement("walksHist");
        removeElement("clustersHist");
        
        //Make tab stuff visible
        var tab = document.getElementsByClassName("tab");
        tab[0].style.visibility='visible';
        document.getElementById("walks").style.visibility = 'visible';
        document.getElementById("clusters").style.visibility = 'hidden';
        
        main.animate(width, height, axons, axonShare, crowdPen, dirPen);
        startWorker(trials, width, height, axons, axonShare, config.steps, crowdPen, dirPen);
        
    }); 
    $("#runButton").css({ width: '100px', 'padding-top': '10px', 'padding-bottom': '10px' });
    
}

function startWorker(trials, width, height, axons, axonShare, steps, crowdPen, dirPen){

    if(typeof(Worker) == "undefined") {
        console.log("Web workers not supported :(")
        return
    }
    

    var w = new Worker("worker.js");
    w.postMessage([trials, width, height, axons, axonShare, steps, crowdPen, dirPen]);

    w.onmessage = function(e) {
        
        var walks = e.data[0];
        var clusters = e.data[1];
        
        
        draw.histogram(walks, "#walks", "walksHist");
        var mean = d3.mean(walks);
        var stdDev = d3.deviation(walks);
        var walksD = document.getElementById("walksData");
        walksD.innerHTML = "Mean: " + Number(mean.toFixed(2)) + ", SD: " + Number(stdDev.toFixed(2))
        
        draw.histogram(clusters, "#clusters", "clustersHist");
        var mean = d3.mean(clusters);
        var stdDev = d3.deviation(clusters);
        var clusterD = document.getElementById("clusterData");
        clusterD.innerHTML = "Mean: " + Number(mean.toFixed(2)) + ", SD: " + Number(stdDev.toFixed(2))
    }
}

function removeElement(elementId){
    var element = document.getElementById(elementId);
    if(element){
        element.parentNode.removeChild(element);
    }
}

function setSliders(){
    
    
    $("#trials .label").text("Trials: " + config.trials);
    $("#axons .label").text("Axons: " + config.axons);
    $("#axonType .label").text("Axon type split: " + config.axonShare);
    $("#width .label").text("Width: " + config.width);
    $("#height .label").text("Height: " + config.height);
    $("#crowdPen .label").text("Proximity penalty: " + config.crowdPen);
    $("#dirPen .label").text("Forward incentive: " + config.dirPen);
    
    
    $( "#height .slider" ).slider({
        range: false,
        orientation: "horizontal",
        min: 10,
        max: 100,
        value: config.height,
        slide: function( event, ui ) {
            $("#height .label").text("Height: " + ui.value);
        }
    });
    
    $( "#width .slider" ).slider({
        range: false,
        orientation: "horizontal",
        min: 10,
        max: 100,
        value: config.width,
        slide: function( event, ui ) {
            $("#width .label").text("Width: " + ui.value);
        }
    });

    $( "#axons .slider" ).slider({
        range: false,
        orientation: "horizontal",
        min: 5,
        max: 100,
        value: config.axons,
        slide: function( event, ui ) {
            $("#axons .label").text("Axons: " + ui.value);
        }
    });
    
    $( "#axonType .slider" ).slider({
        range: false,
        orientation: "horizontal",
        min: 0,
        max: 100,
        value: config.axonShare*100,
        slide: function( event, ui ) {
            $("#axonType .label").text("Axon type split: " + ui.value/100);
        }
    });
    
    $( "#trials .slider" ).slider({
        range: false,
        orientation: "horizontal",
        min: 10,
        max: 10000,
        value: config.trials,
        slide: function( event, ui ) {
            $("#trials .label").text("Trials: " + ui.value);
        }
    });
    
    $( "#crowdPen .slider" ).slider({
        range: false,
        orientation: "horizontal",
        min: 0,
        max: 100,
        value: config.crowdPen*100,
        slide: function( event, ui ) {
            $("#crowdPen .label").text("Crowding penalty: " + ui.value/100);
        }
    });
    
    $( "#dirPen .slider" ).slider({
        range: false,
        orientation: "horizontal",
        min: 0,
        max: 45,
        value: config.dirPen*100,
        slide: function( event, ui ) {
            $("#dirPen .label").text("Forward incentive: " + ui.value/100);
        }
    });
}

