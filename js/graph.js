const object = { //enum For ButtonClicks
    RAUTE:1,
    LINK:2,
    ATTRIBUT:3,
    RECHTECK:4
};

const rechteck = { //default values from rectangle
    baseColor:"Blue",
    hoverColor:"LightBlue",
    baseText:"Rechteck"
}

const MAX_SCALE_IN = 2; //Define how far you can Zoom in
const MAX_SCALE_OUT = 0.5; //Define how far you can Zoom out
const SCALE_RESOLUTION = 0.1; //Define how fast you can Zoom in and out


var selectedObject = object.RAUTE; //Selected object to draw

var graph = new joint.dia.Graph; //graph contains a reference to all components of your diagram

var hoveredCell = null; //cell Object under mouse hoover (null by default)

var scaleX = 1; //Scale value x
var scaleY = 1; //Scale value y

var translateAllowed = false;
var xTransOffset = 0; //Translation x offset (to set click x point to center)
var yTransOffset = 0; //Translation y offset (to set click y point to center)

var transX = 0; //Translation x coordinate
var transY = 0; //Translation y coordinate

var paper = new joint.dia.Paper({ //paper is responsible for rendering the graph
    el: document.getElementById('myholder'),
    model: graph,
    width: 600,
    height: 600,
    gridSize: 10,
    drawGrid: true,
    background: {
        color: 'rgba(0, 255, 0, 0.3)'
    }
});



//--------------------------------------------------
//----------------------EVENTS----------------------
//--------------------------------------------------
//-------------------DOUBLE-CLICK-------------------
//Creates an selected Object by doubleClick on empty space
paper.on('blank:pointerdblclick', function(evt, x, y) { 
    var obj;
    if(selectedObject == object.ATTRIBUT) {
        obj = new joint.shapes.standard.Ellipse();
        obj.position(x, y);
        obj.resize(100, 40);
        obj.attr({
            body: {
                fill: '#F39C12',
                rx: 50,
                ry: 50,
            },
            label: {
                text: 'World!',
                fill: 'gray',
                fontSize: 18,
                fontWeight: 'bold',
                fontVariant: 'small-caps',
                textShadow: '1px 1px 1px black'
            }
        });
    } else if (selectedObject == object.RECHTECK) {
        obj = new joint.shapes.standard.Rectangle();
        obj.position(x, y);
        obj.resize(100, 40);
        obj.attr({
        body: {
            fill: 'blue'
        },
        label: {
            text: 'Hello',
            fill: 'white'
        }
        });
    } else if (selectedObject == object.RAUTE) {
        obj = new joint.shapes.standard.Rectangle();
        obj.position(x, y);
        obj.resize(50, 50);
           obj.attr({
            body: {
                fill: 'blue'
            },
            label: {
                text: 'Hello',
                fill: 'white',
            }
        });
        obj.rotate(45);
     
    }
     obj.addTo(graph);
});

//----------------HOVER-OVER-ELEMENT----------------
//on mouseOver change Color from element to secondary Colors
paper.on('element:mouseover', function(elementView) {
    var currentElement = elementView.model;
    currentElement.attr('body/stroke', 'darkgreen');
    currentElement.attr('body/fill', 'lightblue');
    //window.alert("HEY");
});

//on mouseOver change Color from element to Primary Colors
paper.on('element:mouseout', function(elementView) {
    var currentElement = elementView.model;
    currentElement.attr('body/stroke', 'black');
    currentElement.attr('body/fill', 'blue');
    //window.alert("HEY");
});

//-----------------HOVER-OVER-CELL------------------
//on mouseOver store cell in hoveredCell
paper.on('cell:mouseover', function(evt) {
    hoveredCell = evt.model;
    //currentElement.attr('body/stroke', 'green');
    //window.alert("HEY");
});

//on mouseout clear var hoveredCell (default value = null)
paper.on('cell:mouseout', function(evt) {
    hoveredCell = null;
    //window.alert("HEY");
});

//----------------------SCALE-----------------------
//Scale the paper with Scroll
paper.on('blank:mousewheel', function(evt, x, y, delta) {

    scaleX += delta * SCALE_RESOLUTION;
    scaleY += delta * SCALE_RESOLUTION;
    if(scaleX < MAX_SCALE_IN) {
        paper.scale(scaleX, scaleY);
    } else {
        scaleX = MAX_SCALE_IN;
        scaleY = MAX_SCALE_IN;
    }

    if(scaleX > MAX_SCALE_OUT){
        paper.scale(scaleX, scaleY);
    } else {
        scaleX = MAX_SCALE_OUT;
        scaleY = MAX_SCALE_OUT;
    }
});

//---------------------TRANSLATE--------------------
//Translate the paper with pointerdown and move

//generate an Offset by pointerDown position for translate and grant permission to translate
paper.on('blank:pointerdown', function(evt, x, y) {
    translateAllowed = true;
    xTransOffset = -x;
    yTransOffset = -y;
});

//translate the paper
paper.on('blank:pointermove', function(evt, x, y) {
    if(translateAllowed)
    {
        transX += x + xTransOffset;
        transY += y + yTransOffset;
        paper.translate(transX * scaleX, transY * scaleY );
    }
});

//remove permission to translate
paper.on('blank:pointerup', function() {
    translateAllowed = false;
});

//--------------------------------------------------
//---------------------FUNCTIONS--------------------
//--------------------------------------------------
//------------------KEYPRESS-EVENT------------------
document.addEventListener('keydown', logKey);

function logKey(e) {

    if(e.code == "KeyH")
    {
        paper.translate(0,0);
        paper.scale(1,1);
    }
    if(hoveredCell != null && e.code == "Delete") {
        hoveredCell.remove();
    }
}

//-----------------buttonClickEvent-----------------
//Select an Object to draw with doubleclick on empty space
function selectBtnClick(string) {
    if(string == "Raute"){
        selectedObject = object.RAUTE;
    } else  if(string == "Link"){
        selectedObject = object.LINK;
    } else  if(string == "Attribut"){
        selectedObject = object.ATTRIBUT;
    } else  if(string == "Rechteck"){
        selectedObject = object.RECHTECK;
    }
}

//resets color from all Elements
function resetAll(paper) {
    paper.drawBackground({
        color: 'white'
    })

    var elements = paper.model.getElements();
    for (var i = 0, ii = elements.length; i < ii; i++) {
        var currentElement = elements[i];
        currentElement.attr('body/stroke', 'black');
    }

    var links = paper.model.getLinks();
    for (var j = 0, jj = links.length; j < jj; j++) {
        var currentLink = links[j];
        currentLink.attr('line/stroke', 'black');
        currentLink.label(0, {
            attrs: {
                body: {
                    stroke: 'black'
                }
            }
        })
    }
}


    /*var elements = paper.model.getElements();
    for (var i = 0, ii = elements.length; i < ii; i++) {
        var currentElement = elements[i];
        currentElement.attr('body/stroke', 'orange');
    }

    var links = paper.model.getLinks();
    for (var j = 0; j < links.length; j++) {
        
        var currentLink = links[j];
        currentLink.attr('line/stroke', 'orange');
    }*/


/*var link = new joint.shapes.standard.Link();
    link.source(rect1);
    link.target(rect2);
    link.addTo(graph);
    link.attr({
            line: {
                sourceMarker: {
                    'd': 'M 0 0 0 0 0 0 Z'
                },
                targetMarker: {
                    'd': 'M 0 0 0 0 0 0 Z'
                }
            }
        });*/

