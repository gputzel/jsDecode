/*var c = document.getElementById("pict");
var ctx = c.getContext("2d");
var w = c.width;
var h = c.height;

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");
*/

/*function drawPermutation(alphabet,perm){
    ctx.strokeStyle="#FF0000";
    ctx.beginPath();
    for(var i=0; i < alphabet.length; i++){
        //console.log(i,alphabet[i],perm[alphabet[i]])
        ctx.moveTo(25, 16+20*i);
        ctx.lineTo(w-32,16+20*perm[alphabet[i]]);
    }
    ctx.stroke();
    ctx.closePath();
}*/

/*function showAlphabets(alphabet){
    ctx.font = "14px Arial";
    //Draw alphabet on left and right side of canvas
    for (var i=0; i<alphabet.length; i++){
        ctx.fillText(wrapSpace(alphabet[i]),10,20+20*i);
        ctx.fillText(wrapSpace(alphabet[i]),w-25,20+20*i);
    }
}*/

/*function erasePermutation(){
    ctx.fillStyle="white";
    ctx.fillRect(24,0,w-50,h); 
}*/

/*function updatePermutation(){
    erasePermutation();
    drawPermutation();
    //document.getElementById("plaintextArea").value = decrypt(perm);   
}*/

//For the display of the alphabet, wrap the space
//character in single quotes
function wrapSpace(s){
    if (s === " "){
        return "'  '";
    }
    else {
        return s;
    }
}

/*
ctx.font = "14px Arial";
//Draw alphabet on left and right side of canvas
for (var i=0; i<alphabet.length; i++){
    ctx.fillText(wrapSpace(alphabet[i]),10,20+20*i);
    ctx.fillText(wrapSpace(alphabet[i]),w-25,20+20*i);
}*/

function go(){
    //console.log("Go go go");
    document.getElementById("goButton").innerHTML="Stop";
    document.getElementById("goButton").onclick=stop;
    w.postMessage("Go");
}

function stop(){
    //console.log("Stopping");
    document.getElementById("goButton").innerHTML="Go!";
    document.getElementById("goButton").onclick=go;
    w.postMessage("Stop");
}

function thousandMoves(){
    for(var i = 0; i<1000; i++){
        trialMove();
    }
}

//Wrapper for the canvas that draws the permutation
function PermutationCanvasState(canvas,alphabet){
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.alphabet = alphabet;
    this.perm = new Object();

    this.lines = [];

    //Positions of letters of the left (ciphertext) and right(output)
    //alphabets
    this.leftAlphaX = 10;
    this.rightAlphaX = this.width - 25;
    this.AlphaY = new Object();
    for(var i = 0; i < alphabet.length; i++){
       this.AlphaY[i] = 20+20*i; 
    }
    //Positions of left and right endpoints of lines
    this.leftLineX = 25;
    this.rightLineX = this.width - 32;
    this.LineY = new Object();
    for(var i = 0; i < alphabet.length; i++){
        this.LineY[i] = 16+20*i;
    }

    //initialize the permutation
    for(var i = 0; i < alphabet.length; i++){
        this.perm[alphabet[i]] = i;
    }

    //var myState = this;
}

PermutationCanvasState.prototype.clear = function(){
    this.ctx.clearRect(0,0,this.width,this.height);
}

PermutationCanvasState.prototype.draw = function(){
    var alphabet = this.alphabet;
    var ctx = this.ctx;
    var perm = this.perm;

    this.clear();
    ctx.font = "14px Arial";
    //Draw alphabet on left and right side of canvas
    for (var i=0; i<alphabet.length; i++){
        ctx.fillText(wrapSpace(alphabet[i]),this.leftAlphaX,this.AlphaY[i]);
        ctx.fillText(wrapSpace(alphabet[i]),this.rightAlphaX,this.AlphaY[i]);
    }
    
    //Draw the lines
    ctx.strokeStyle="#FF0000";
    ctx.beginPath();
    for(var i=0; i < alphabet.length; i++){
        ctx.moveTo(this.leftLineX, this.LineY[i]);
        ctx.lineTo(this.rightLineX, this.LineY[perm[alphabet[i]]]);
    }
    ctx.stroke();
    ctx.closePath();
}

/*
var c = document.getElementById("pict");
var ctx = c.getContext("2d");
var w = c.width;
var h = c.height;
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");
*/

function init(){
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");
    var s = new PermutationCanvasState(document.getElementById('permutationCanvas'),alphabet);
    s.draw();

    //Check for web workers, and if they are available, change
    //the 1000 Trial Moves button to Go!
    //var w = undefined;
    if(typeof(Worker) === "undefined") {
        document.getElementById("goButton").innerHTML = "1000 Trial Moves";
        document.getElementById("goButton").onclick = thousandMoves;
    }
    else{
        if(typeof(w) == "undefined"){
            //console.log("Creating worker");
            w = new Worker("worker.js");
            w.onmessage = function(event){
                console.log("Message from worker:",event.data);
            };
            w.postMessage("Blah");
        }
    }
}
