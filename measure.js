import * as main from './main.js'
import * as config from './config.js'
import * as draw from './draw.js'

setSliders()
setRunButton()

function setRunButton(){

    $("#runButton").button().click(function(){
        
        //Remove any old svgs
        removeElement("histWalks");
        removeElement("histClusters");
        removeElement("gridSvg");
        
        var trials = $("#trials .slider").slider("value");
        var width = $("#width .slider").slider("value");
        var crowdPen = $("#crowdPen .slider").slider("value")/100;
        var dirPen = $("#dirPen .slider").slider("value")/100;
        var height = $("#height .slider").slider("value");
        var axons = $("#axons .slider").slider("value");
        var axonShare = $("#axonType .slider").slider("value")/100;
        var steps = $("#steps .slider").slider("value");
        
        main.animate(width, height, axons, axonShare, steps, crowdPen, dirPen);
        console.log(axonShare)
        startWorker(trials, width, height, axons, axonShare, steps, crowdPen, dirPen);
        
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
        
        
        draw.histogram(walks, "histWalks");
        var mean = d3.mean(walks);
        var stdDev = d3.deviation(walks);
        
        draw.histogram(clusters, "histClusters");
        var mean = d3.mean(clusters);
        var stdDev = d3.deviation(clusters);
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
    $("#steps .label").text("Max iterations: " + config.steps);
    $("#axons .label").text("Axons: " + config.axons);
    $("#axonType .label").text("Axon type split: " + config.axonShare);
    $("#width .label").text("Width: " + config.width);
    $("#height .label").text("Height: " + config.height);
    $("#crowdPen .label").text("Crowding penalty: " + config.crowdPen);
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
    
    $( "#steps .slider" ).slider({
        range: false,
        orientation: "horizontal",
        min: 50,
        max: 1000,
        value: config.steps,
        slide: function( event, ui ) {
            $("#steps .label").text("Max iterations: " + ui.value);
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

