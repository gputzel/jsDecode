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

//Wrapper for the canvas that draws the permutation
function PermutationCanvasState(canvas,alphabet){
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.alphabet = alphabet;
    //this.perm = new Object();

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
    /*for(var i = 0; i < alphabet.length; i++){
        this.perm[alphabet[i]] = i;
    }*/

    //var myState = this;
}

PermutationCanvasState.prototype.clear = function(){
    this.ctx.clearRect(0,0,this.width,this.height);
}

PermutationCanvasState.prototype.draw = function(perm){
    var alphabet = this.alphabet;
    var ctx = this.ctx;
    //var perm = this.perm;

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

function initialPermutation(alphabet){
    var d = new Object();
    var alph = alphabet;
    //Initialize the dictionary with the identity mapping
    for (var i=0; i<alph.length; i++){
        d[alph[i]]=i;
    }
    return d;
}

function randomizePermutation(alphabet){
    //Randomize the dictionary
    var alph = alphabet;
    var j = 0;
    var temp = 0;
    for (var i=1; i<alph.length; i++){
        //Swap element i randomly with some element j <= i
        j = Math.floor(Math.random()*(i+1));
        //d[alph[i]] = d[alph[j]]
        //d[alph[j]] = d[alph[i]]
        temp = perm[alph[i]];
        perm[alph[i]] = perm[alph[j]];
        perm[alph[j]] = temp;
    }
}

//decrypt the plaintext according to the input permutation
function decrypt(p){
    var ciphertext=document.getElementById("ciphertextArea").value;
    myFunc=function(c){
        return alphabet[p[c]];
    };
    var plainText = ciphertext.split('').map(myFunc).join("");
    return plainText;
    //document.getElementById("plaintextArea").value = plainText;
}

//Actually, log-likelihood
function likelihood(text){
    var s=0.0;
    //output=document.getElementById("plaintextArea").value;
    for(var i = 0; i < text.length-1; i++){
        s += parseFloat(trans[text.substring(i,i+2)]);
    }
    return s;
}

//returns the current log-likelihood
function currentLL(){
    return likelihood(decrypt(perm));
}

function resetPermutation(){
    randomizePermutation(alphabet);
    //erasePermutation();
    pcState.draw(perm);
    //showAlphabets();
    //drawPermutation();
    //decrypt();
    document.getElementById("plaintextArea").value = decrypt(perm);    
}

function updatePermutation(){
    pcState.draw(perm);
    document.getElementById("plaintextArea").value = decrypt(perm);    
}

function trialMove(){
    output=document.getElementById("plaintextArea").value;
    initialLL = likelihood(output);
    //console.log(initialLL);
    //generate trial move
    //perm[alphabet[i]]=perm[alphabet[j]] and vice versa
    var len = alphabet.length;
    var i = Math.floor(Math.random()*len);
    var j = i;
    while (i === j){
        j = Math.floor(Math.random()*len);
    }
    //console.log("Trial move:", i, j);
    //Make the change to the permutation (we will undo it if
    //the move is rejected)
    var temp = perm[alphabet[i]];
    perm[alphabet[i]] = perm[alphabet[j]];
    perm[alphabet[j]] = temp;
    //Find the new likelihood
    var newOutput = decrypt(perm);
    newLL = likelihood(newOutput);
    //console.log("New LL: ", newLL);
    //If the new LL is greater, then accept the move
    if (newLL > initialLL){
        //console.log("Move accepted, increases LL.");
        //updatePermutation();
        return true;
    }
    var delta = newLL - initialLL;
    //console.log("deltaLL = ",delta);
    //T = parseFloat(document.getElementById("temperatureArea").value);
    //console.log("T = ", T); 
    var beta = 1.0/T;
    if (Math.random()<Math.pow(10.0,beta*delta)){
        //Accept the move
        //console.log("Move accepted by Metropolis");
        //updatePermutation();
        return true;
    }
    else{
        //Undo the move
        temp = perm[alphabet[i]];
        perm[alphabet[i]] = perm[alphabet[j]];
        perm[alphabet[j]] = temp;
        return false;
    }
    //console.log(Math.pow(10.00,0.5));
}

function thousandMoves(){
    for (var i=0;i<1000;i++){
        trialMove();
    }
    updatePermutation();
}

function step(){
    for (var i=0;i<100;i++){
        trialMove();
    }
    updatePermutation();
    llList.push(currentLL());
    llList.shift();

    path
        .attr("d",line)
        .attr("transform",null)
        .transition()
            .duration(50)
            .ease("linear")
            .attr("transform", "translate(" + x(-1) + ",0)");
}

function go(){
    //console.log("Go go go");
    document.getElementById("goButton").innerHTML="Stop";
    document.getElementById("goButton").onclick=stop;
    //w.postMessage("Go");
    plotTimer = setInterval(step,50);
}

function stop(){
    //console.log("Stopping");
    document.getElementById("goButton").innerHTML="Go!";
    document.getElementById("goButton").onclick=go;
    //w.postMessage("Stop");
    clearInterval(plotTimer);
}

function initListData(){
    var ll = currentLL();
    for (var i=0; i<llListLength; i++){
        llList.push(ll);
    }
}

var pcState;
var perm;
var alphabet;
var plotTimer;
var llListLength = 100;
var llList=[];
var T = 5.0;

var svg;
var path;
var line;
var x,y;

function init(){
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");

    /*$('input[type="range"]').rangeslider({
        onSlide : function(position,value){console.log(value);}
    });*/

    pcState = new PermutationCanvasState(document.getElementById('permutationCanvas'),alphabet);
    perm = initialPermutation(alphabet);
    resetPermutation();

    initListData();
    
    //var width = 200;
    //var height = 150;
    var margin = {top: 20, right: 20, bottom: 20, left: 40},
        width = 250 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;


    x = d3.scale.linear()
        .domain([0,llListLength-1])
        .range([0,width]);
    y = d3.scale.linear()
        .domain([-1600,0])
        .range([height,0]);
    line = d3.svg.line()
        .x(function(d,i) { return x(i);})
        .y(function(d,i) { return y(d);});
    svg = d3.select("#likelihood").append("svg")
        .attr("width",width+margin.left + margin.right).attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + 0 +"," + 0 + ")");
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.svg.axis().scale(x).ticks(0).orient("bottom"));
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).ticks(0).orient("left"));
    path = svg.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(llList)
        .attr("class", "line")
        .attr("d", line);
    //document.getElementById("goButton").innerHTML = "1000 Trial Moves";
    //document.getElementById("goButton").onclick = thousandMoves;
    //randomizePermutation(alphabet);
    //pcState.draw(perm);

    //Check for web workers, and if they are available, change
    //the 1000 Trial Moves button to Go!
    //var w = undefined;
    /*if(typeof(Worker) === "undefined") {
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
    }*/
}
