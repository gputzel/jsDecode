var c = document.getElementById("pict");
var ctx = c.getContext("2d");
var w = c.width;

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");

function randomDictionary(alph){
    var d = new Object();
    //Initialize the dictionary with the identity mapping
    for (var i=0; i<alph.length; i++){
        d[alph[i]]=i
    }
    //Now randomize the dictionary
    var j = 0;
    var temp = 0;
    for (i=1; i<alph.length; i++){
        //Swap element i randomly with some element j <= i
        j = Math.floor(Math.random()*(i+1));
        //d[alph[i]] = d[alph[j]]
        //d[alph[j]] = d[alph[i]]
        temp = d[alph[i]];
        d[alph[i]] = d[alph[j]];
        d[alph[j]] = temp;
    }
    return d;
}

perm = randomDictionary(alphabet);

function drawPermutation(){
    ctx.strokeStyle="#FF0000";
    for(var i=0; i < alphabet.length; i++){
        //console.log(i,alphabet[i],perm[alphabet[i]])
        ctx.moveTo(25, 16+20*i);
        ctx.lineTo(w-32,16+20*perm[alphabet[i]]);
    }
    ctx.stroke();
}

drawPermutation();

//ctx.fillStyle = "#FF0000";
//ctx.fillRect(0,0,20,100);
ctx.font = "14px Arial";

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

//Draw alphabet on left and right side of canvas
for (var i=0; i<alphabet.length; i++){
    ctx.fillText(wrapSpace(alphabet[i]),10,20+20*i);
    ctx.fillText(wrapSpace(alphabet[i]),w-25,20+20*i);
}

//console.log(alphabet);
//var alphabet2 = alphabet.slice(0);
//alphabet2[0] = "O";
//console.log(alphabet2);
//console.log(alphabet);
