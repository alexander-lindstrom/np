import * as main from './main.js'
import * as config from './config.js'
import * as draw from './draw.js'

setSliders()
setRunButton()

function setRunButton(){

    $("#runButton").button().click(function(){
        
        //Remove any old svgs
        removeElement("histSvg");
        removeElement("gridSvg");
        

        
        var trials = $("#trials .slider").slider("value");
        var width = $("#width .slider").slider("value");
        var crowdPen = $("#crowdPen .slider").slider("value")/100;
        var dirPen = $("#dirPen .slider").slider("value")/100;
        var height = $("#height .slider").slider("value");
        var axons = $("#axons .slider").slider("value");
        var steps = $("#steps .slider").slider("value");
        
        main.animate(width, height, axons, steps, crowdPen, dirPen);
        startWorker(trials, width, height, axons, steps, crowdPen, dirPen);
        
    }); 
}

function startWorker(trials, width, height, axons, steps, crowdPen, dirPen){

    if(typeof(Worker) == "undefined") {
        console.log("Web workers not supported :(")
        return
    }
    

    var w = new Worker("worker.js");
    w.postMessage([trials, width, height, axons, steps, crowdPen, dirPen]);

    w.onmessage = function(e) {
        var walks = e.data;
        draw.histogram(walks);
        var mean = d3.mean(walks);
        var stdDev = d3.deviation(walks);
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
    $("#steps .label").text("Steps: " + config.steps);
    $("#axons .label").text("Axons: " + config.axons);
    $("#width .label").text("Width: " + config.width);
    $("#height .label").text("Height: " + config.height);
    $("#crowdPen .label").text("Crowding penalty: " + config.crowdPen);
    $("#dirPen .label").text("Direction penalty: " + config.dirPen);
    
    
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
        min: 1,
        max: 100,
        value: config.axons,
        slide: function( event, ui ) {
            $("#axons .label").text("Axons: " + ui.value);
        }
    });
    
    $( "#steps .slider" ).slider({
        range: false,
        orientation: "horizontal",
        min: 100,
        max: 10000,
        value: config.steps,
        slide: function( event, ui ) {
            $("#steps .label").text("Steps: " + ui.value);
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

