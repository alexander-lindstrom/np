import * as main from './main.js'
import * as config from './config.js'

setSliders()
setRunButton()

function setRunButton(){

    $("#runButton").button().click(function(){
        
        //Rem any old histogram
        var element = document.getElementById("histSvg");
        if(element){
            element.parentNode.removeChild(element);
        }
        
        
        var trials = $("#trials .slider").slider("value");
        var width = $("#width .slider").slider("value");
        var crowdPen = $("#crowdPen .slider").slider("value")/100;
        var dirPen = $("#dirPen .slider").slider("value")/100;

        main.walkLength(trials, width, crowdPen, dirPen);
    }); 
}

function setSliders(){
    
    
    $("#trials .label").text("Trials: " + config.trials);
    $("#width .label").text("Width: " + config.width);
    $("#crowdPen .label").text("Crowding penalty: " + config.crowdPen);
    $("#dirPen .label").text("Direction penalty: " + config.dirPen);
    
    
    $( "#trials .slider" ).slider({
        range: false,
        orientation: "horizontal",
        min: 10,
        max: 100000,
        value: config.trials,
        slide: function( event, ui ) {
            $("#trials .label").text("Trials: " + ui.value);
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
            $("#dirPen .label").text("Direction penalty: " + ui.value/100);
        }
    });
}

