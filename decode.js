var c = document.getElementById("pict");
var ctx = c.getContext("2d");
var w = c.width;
var h = c.height;

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");

function initialPermutation(){
    var d = new Object();
    var alph = alphabet;
    //Initialize the dictionary with the identity mapping
    for (var i=0; i<alph.length; i++){
        d[alph[i]]=i;
    }
    return d;
}

function randomizePermutation(){
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

function drawPermutation(){
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

function resetPermutation(){
    randomizePermutation();
    erasePermutation();
    //showAlphabets();
    drawPermutation();
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

perm = initialPermutation();
randomizePermutation();
drawPermutation();
showAlphabets();

//console.log(alphabet);
//var alphabet2 = alphabet.slice(0);
//alphabet2[0] = "O";
//console.log(alphabet2);
//console.log(alphabet);
