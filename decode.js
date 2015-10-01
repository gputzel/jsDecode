/*var c = document.getElementById("pict");
var ctx = c.getContext("2d");
var w = c.width;
var h = c.height;

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");
*/

function drawPermutation(perm){
    ctx.strokeStyle="#FF0000";
    ctx.beginPath();
    for(var i=0; i < alphabet.length; i++){
        //console.log(i,alphabet[i],perm[alphabet[i]])
        ctx.moveTo(25, 16+20*i);
        ctx.lineTo(w-32,16+20*perm[alphabet[i]]);
    }
    ctx.stroke();
    ctx.closePath();
}

function showAlphabets(){
    ctx.font = "14px Arial";
    //Draw alphabet on left and right side of canvas
    for (var i=0; i<alphabet.length; i++){
        ctx.fillText(wrapSpace(alphabet[i]),10,20+20*i);
        ctx.fillText(wrapSpace(alphabet[i]),w-25,20+20*i);
    }
}

function erasePermutation(){
    ctx.fillStyle="white";
    ctx.fillRect(24,0,w-50,h); 
}

function updatePermutation(){
    erasePermutation();
    drawPermutation();
    document.getElementById("plaintextArea").value = decrypt(perm);   
}

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
}

function stop(){
    //console.log("Stopping");
    document.getElementById("goButton").innerHTML="Go!";
    document.getElementById("goButton").onclick=go;
}

function thousandMoves(){
    for(var i = 0; i<1000; i++){
        trialMove();
    }
}

var c = document.getElementById("pict");
var ctx = c.getContext("2d");
var w = c.width;
var h = c.height;
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");

drawPermutation();
showAlphabets();
//document.getElementById("plaintextArea").value = decrypt(perm);
w = undefined;

//Check for web workers, and if they are available, change
//the 1000 Trial Moves button to Go!
if(typeof(Worker) === "undefined") {
    document.getElementById("goButton").innerHTML = "1000 Trial Moves";
    document.getElementById("goButton").onclick = thousandMoves;
}
else{
    if(typeof(w) == "undefined"){
        console.log("Creating worker");
        w = new Worker("worker.js");
        w.onmessage = function(event){
            console.log(event.data);
        };
    }
}

//console.log(alphabet);
//var alphabet2 = alphabet.slice(0);
//alphabet2[0] = "O";
//console.log(alphabet2);
//console.log(alphabet);
