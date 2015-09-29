var c = document.getElementById("pict");
var ctx = c.getContext("2d");
var w = c.width;

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//ctx.fillStyle = "#FF0000";
//ctx.fillRect(0,0,20,100);
ctx.font = "14px Arial";

for (var i=0; i<alphabet.length; i++){
    ctx.fillText(alphabet[i],10,20+20*i);
}

//console.log(alphabet);
