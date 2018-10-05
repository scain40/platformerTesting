canvas=document.getElementById("game");
context=canvas.getContext("2d");
var stuff = new Environment();
var stick = new Stickman();
stick.x = 50;
stick.y = 0;
stick.posCol = [0,1];
var fps = 60;
setInterval(gameLoop,1000/fps);
function Stickman(){
    this.x;
    this.y;
    this.speed = 0;
    this.state = 0;
    this.posCol;
    this.moveDirection = "Stopped";
    this.characterWidth = 5;
    this.draw = function(x, y){
        context.strokeStyle = '#000000';
        context.fillStyle = "#000000";
        context.beginPath();
        context.moveTo(x,y-10);
        context.lineTo(x,y-15);
        context.stroke();
        context.moveTo(x-5,y);
        context.lineTo(x,y-10);
        context.lineTo(x+5,y);
        context.stroke();
        context.moveTo(x,y-15);
        context.arc(x,y-17,2,0,Math.PI*2);
        //Arms up if 1, down if 0
        if(this.speed<0){
            context.moveTo(x+6,y-19);
            context.lineTo(x,y-15);
            context.lineTo(x-6,y-19);
        }else{
            context.moveTo(x+6, y-11);
            context.lineTo(x,y-15);
            context.lineTo(x-6,y-11);
        }
        context.stroke();
        console.log("drawn");
    };
}

function Platform(x,y,width,height, surround){
    this.x = x;
    this.y = y;
    this. width = width;
    this.height = height;
    this.neighbours = surround;
}

function Environment(){
    this.platforms = [
        new Platform(100,550,100,10, [0,1]),
        new Platform(200,500,50,10, [0,1,2]),
        new Platform(300,500,50,10,[0,1,2,3]),
        new Platform(400,500,50,10,[0,2,3,4]),
        new Platform(450,450,20,10,[0,2,3,4,5]),
        new Platform(500,450,20,10,[0,3,4,5,6]),
        new Platform(550,450,20,10,[0,5,6,7]),
        new Platform(700,480,40,10,[0,6,7,8]),
        new Platform(800,480,40,10,[0,7,8])


    ]
}

function drawEnvironment(){
    let i = 0;
    let platforms = stuff.platforms;
    context.strokeStyle="#0f0024"
    context.fillStyle="#edfff4";
    while(i!=platforms.length){
        context.beginPath();
        let usedPlatform = platforms[i];
        context.moveTo(usedPlatform.x - (usedPlatform.width / 2), usedPlatform.y - (usedPlatform.height / 2));
        context.lineTo(usedPlatform.x + (usedPlatform.width / 2), usedPlatform.y - (usedPlatform.height / 2));
        context.lineTo(usedPlatform.x + (usedPlatform.width / 2), usedPlatform.y + (usedPlatform.height / 2));
        context.lineTo(usedPlatform.x - (usedPlatform.width / 2), usedPlatform.y + (usedPlatform.height / 2));
        context.lineTo(usedPlatform.x - (usedPlatform.width / 2), usedPlatform.y - (usedPlatform.height / 2));
        context.stroke();
        context.fill();
        i++; //End condition of statem// ent
    }
    drawVictory();
}

function gameLoop(){
    context.clearRect(0, 0, canvas.width, canvas.height); //Cleaning the canvas
    drawEnvironment();
    moveCheck();
    gravity();
    stick.draw(stick.x,stick.y);
    victoryCheck();

}

function gravity(){
    stick.speed = stick.speed+(9.8/fps);
    stick.y = stick.y+stick.speed;
    collisionDetection();
}

function collisionDetection(){
    let i = 0;
    //Running a detection loop over the possible collisions
    while(i!=stick.posCol.length){
        let detecting = stuff.platforms[stick.posCol[i]];
        //Checking if the platform is within the x limits
        //Less than the higher limit && Greater than than the lower limit
        if((stick.x-stick.characterWidth)<=detecting.x+(detecting.width/2)&&(stick.x+stick.characterWidth)>=detecting.x-(detecting.width/2)){
            //Checking if the platform is within the y limits
            if(stick.y<=detecting.y+(detecting.height/2)&&stick.y>=detecting.y-(detecting.height/2)){
                //Checking the differences between the character and the extremes
                stick.posCol = detecting.neighbours;
                    let numbers = [[stick.x-(detecting.x-(detecting.width/2)),"lowX"], //Difference between lowX and stick
                    [stick.y-(detecting.y-(detecting.height/2)),"lowY"], //Difference between lowY and stick
                    [(detecting.x+(detecting.width/2))-stick.x,"highX"], //Difference between highX and stick
                    [(detecting.y+(detecting.height/2))-stick.y,"highY"]]; //highY
                    let highest = [10000000000000000,"none"];
                    let i = 0;
                    while(i!=3) {
                        console.log(numbers[i]);
                        if (highest[0] > numbers[i][0]) {
                            highest = numbers[i];
                        }
                        i++;
                    }
                    console.log(highest[1]);
                    switch(highest[1]){
                       case "lowX":
                            console.log("moveLeft");
                            stick.moveDirection = "Stopped";

                            break;
                        case "highX":
                            stick.moveDirection = "Stopped";
                            console.log("moveRight");
                            break;
                        case "lowY":
                            stick.y = detecting.y-(detecting.height/2);
                            console.log("moveDown");
                            stick.speed=0;
                            break;
                        case "highY":
                            stick.y = detecting.y+(detecting.height/2);
                            console.log("moveUp");
                            stick.speed=0;
                            break;
                    }

                    //Check to see which of these values is the lowest
            }
        }
        i++;
        if(stick.y > canvas.height){
            stick.y = canvas.height;
            stick.speed=0;
        }
    }
}

window.onkeydown = function(e) {
    //alert(String.fromCharCode(e.keyCode)+" --> "+e.keyCode);
    let keyCode = e.keyCode;
    switch (keyCode) {
        case 38: // left arrow keyCode
            if (stick.speed == 0) {
                stick.speed = -5;
            }
            break;
        case 39:
            stick.moveDirection = "Right";
            break;
        case 37:
            stick.moveDirection = "Left";
            break;
    };
}
window.onkeyup = function(e){
    let keyCode = e.keyCode;
    switch (keyCode) {
        case 39:
            stick.moveDirection = "Stopped";
            break;
        case 37:
            stick.moveDirection = "Stopped";
            break;
    };
}

function moveCheck(){
    switch(stick.moveDirection){
        case "Left":
            stick.x = stick.x-2;
            break;
        case "Right":
            stick.x = stick.x+2;
        case "Stopped":
            break;
    }
}

function drawVictory(){
    context.strokeStyle="#fff381";
    context.moveTo(790,475);
    context.lineTo(810,475);
    context.lineTo(810,450);
    context.lineTo(790,450);
    context.lineTo(790,475);
    context.stroke();
}

function victoryCheck(){
    if(stick.x>790&&stick.x<810){
        if(stick.y>775&&stick.y<810){
            alert("Win");
        }
    }
}