var r = 6;
var space = 2;
var block = r * 2 + space;
var width = r * 14 + 7 * space;
var clockTop = 20;
var clockLeft = 200;
var fixedColor = '#66ccff'
var ax = 0;
var ay = 1000;
var reduceFactor = 0.5;

var colorBallsSet = new Array();
var then = new Date();

function ColorBall(){
    this.x = 0;
    this.y = 0;
    this.color = createNewColor();
    var dir = Math.random() * 2 * Math.PI;
    this.vx = Math.sin(dir) * 250;
    this.vy = Math.cos(dir) * 250;
    //this.vx = Math.random() * 500 - 250;
    //this.vy = Math.random() * 500 - 250;
}

function createNewColor()
{
    return '#'+('00000'+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
}
var cxt = null;
// function magic()
// {
    var canvas = document.getElementById('canvas');
    cxt = canvas.getContext('2d');
    //cxt.
    refreshContent();
    //setTimeout('onload()', 100);
// }

function refreshContent()
{
    var now = new Date();
    drawString(cxt, dateToString(now));
    if(dateToString(now) != dateToString(then)){
        chooseBallsToAdd(dateToString(now), dateToString(then));
        then = now;
    }
    updateColorBalls(cxt)
    drawColorBalls(cxt);
    window.requestAnimationFrame(refreshContent);
    console.log(colorBallsSet.length);
}

function chooseBallsToAdd(now, then)
{
    for(var i = 0; i < now.length; i++)
        if(now[i] != then[i]){
            addColorBalls(i*width+clockLeft, now[i]);
        }
}

function addColorBalls(startWidth, digitToAdd)
{
    for (i = 0; i < digit[digitToAdd].length; i++)
        for (j = 0; j < digit[digitToAdd][i].length; j++)
            if(digit[digitToAdd][i][j]){
                correntBall = new ColorBall();
                correntBall.x = block*j+startWidth;
                correntBall.y = block*i+clockTop;
                colorBallsSet.push(correntBall);
            }
}
var lastTick = new Date().getTime();
function updateColorBalls(cxt)
{
    var tick = new Date().getTime();
    var t = (tick - lastTick) / 1000;
    lastTick = tick;
    
    var validBallNum = 0;
    for(var i = 0; i < colorBallsSet.length; i++){
        colorBallsSet[i].x += colorBallsSet[i].vx * t + 0.5 * ax * t * t;
        colorBallsSet[i].y += colorBallsSet[i].vy * t + 0.5 * ay * t * t;
        colorBallsSet[i].vx += ax * t;
        colorBallsSet[i].vy += ay * t;
        if(colorBallsSet[i].y >= cxt.canvas.height - r){
            colorBallsSet[i].y = cxt.canvas.height - r;
            colorBallsSet[i].vy = (0 - reduceFactor) * colorBallsSet[i].vy;
        }
        if(colorBallsSet[i].x>(0-r) && colorBallsSet[i].x<(cxt.canvas.width+r))
            colorBallsSet[validBallNum++] = colorBallsSet[i];
    }
    for(i = validBallNum; i < colorBallsSet.length; i++)
        colorBallsSet.pop();
}

function drawColorBalls(cxt){
    for(i = 0; i < colorBallsSet.length; i++){
        cxt.fillStyle = colorBallsSet[i].color;
        cxt.beginPath();
        cxt.arc(colorBallsSet[i].x, colorBallsSet[i].y, r, 0, Math.PI*2, true);
        cxt.closePath();
        
        cxt.fill();
    }
}

function dateToString(date)
{
    return checkNum(date.getHours()) + ':' + 
           checkNum(date.getMinutes()) + ':' +
           checkNum(date.getSeconds());
}

function checkNum(num)
{
    return num<10 ? '0'+num : num;
}

function drawString(cxt, string){
    cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
    for (var i = 0; i < string.length; i++)
        drawSingleDigit(cxt, string[i], (width*i)+clockLeft);
}

function drawSingleDigit(cxt, digitToDraw, startWidth)
{
    if (digitToDraw == ':')
        digitToDraw = 10;
    for (i = 0; i < digit[digitToDraw].length; i++)
        for (j = 0; j < digit[digitToDraw][i].length; j++){
            cxt.fillStyle = fixedColor;
            cxt.beginPath();
            if(digit[digitToDraw][i][j])
                cxt.arc(block*j+startWidth, block*i+clockTop, r, 0, Math.PI*2, true);
            cxt.closePath();
            cxt.fill();
        }
}