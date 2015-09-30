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
    //decrypt();
    document.getElementById("plaintextArea").value = decrypt(perm);    
}

function updatePermutation(){
    erasePermutation();
    drawPermutation();
    document.getElementById("plaintextArea").value = decrypt(perm);   
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

//Actually, log-likelihood
function likelihood(text){
    var s=0.0;
    //output=document.getElementById("plaintextArea").value;
    for(var i = 0; i < text.length-1; i++){
        s += parseFloat(trans[text.substring(i,i+2)]);
    }
    return s;
}

/*
ctx.font = "14px Arial";
//Draw alphabet on left and right side of canvas
for (var i=0; i<alphabet.length; i++){
    ctx.fillText(wrapSpace(alphabet[i]),10,20+20*i);
    ctx.fillText(wrapSpace(alphabet[i]),w-25,20+20*i);
}*/

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
        updatePermutation();
        return true;
    }
    var delta = newLL - initialLL;
    //console.log("deltaLL = ",delta);
    T = parseFloat(document.getElementById("temperatureArea").value);
    //console.log("T = ", T); 
    var beta = 1.0/T;
    if (Math.random()<Math.pow(10.0,beta*delta)){
        //Accept the move
        //console.log("Move accepted by Metropolis");
        updatePermutation();
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

function go(){
    for(var i = 0; i<1000; i++){
        trialMove();
    }
}

perm = initialPermutation();
randomizePermutation();
drawPermutation();
showAlphabets();
document.getElementById("plaintextArea").value = decrypt(perm);

//console.log(alphabet);
//var alphabet2 = alphabet.slice(0);
//alphabet2[0] = "O";
//console.log(alphabet2);
//console.log(alphabet);
