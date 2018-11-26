//Setup canvas
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
//Event listeners
window.addEventListener('resize',
function(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
})

let key = 'none';
document.addEventListener('keydown', () =>{
  if (event.keyCode==38){
    key = 'up';
  }else if(event.keyCode==40){
    key = 'down';
  }
});

document.addEventListener('keyup', ()=>{
  key = undefined;
})
//variables
let lines = [];
let stepstoend;
let stepstobounce;
let velocity = 1;
let ball;
let paddlelength = innerHeight/6;
let paddlewidth=innerWidth/150;
let paddlev = paddlelength/8;
let paddleArray = [];
let radius = (innerWidth*innerHeight)/85000;
let isuser;
let score;
function Paddle(x,isuser){
  this.isuser = isuser;
  this.x=x;
  this.y=innerHeight/2 - paddlelength;

  this.update = function(){
    if (this.isuser=='true'){
      if (key == 'up' && this.y  >= 0){
      this.y -= paddlev;
      }
      if (key=='down' && this.y + paddlelength <= innerHeight){
      this.y += paddlev;
      }
    }
//cpu
    if(this.isuser=='false'){
      this.y=ball.y + ball.dy -.5*paddlelength;
    }

    this.draw();
  }
  this.draw = function(){
    c.beginPath();
    c.fillRect(this.x,this.y,paddlewidth,paddlelength);
  }
}


function Ball(dx,dy){
  this.dx = dx;
  this.dy = dy;
  this.x = innerWidth/2;
  this.y = innerHeight/2;
  this.update = function(){
    //bounce off the top and bottom
    if(this.y + this.dy + radius < innerHeight && this.y + this.dy - radius>0){
      this.y+=this.dy;
    }else{
      this.dy = -this.dy;
    }
    //move horizontally left
    if(ball.dx<0){
      if (ball.x - radius + ball.dx > 0+paddlewidth+1 && ball.x + radius + ball.dx < innerWidth-paddlewidth-1){
        this.x += this.dx;
//colision of user paddle
      }else if(ball.y + ball.dy >= paddleArray[0].y && ball.y + ball.dy <= paddleArray[0].y+paddlelength){
        this.dx = -this.dx;
        score += 1;
      }else{
        this.x += this.dx;
        this.draw();
        init();
      }
    }
    //horizontally right
    if(ball.dx>0){
      if (ball.x - radius + ball.dx > 0+paddlewidth+1 && ball.x + radius + ball.dx < innerWidth-paddlewidth-1){
        this.x += this.dx;

      }else if(ball.y + ball.dy  > paddleArray[1].y && ball.y + ball.dy < paddleArray[1].y+paddlelength){
        this.dx = -this.dx;
        this.dy = newdy();
      }else{
        init();
      }
    }
    
    //stpestoend
    function lineTox(){
      return stepstobounce()*ball.dx + ball.x; 
    }
    function lineToy(){
      return stepstobounce()*ball.dy + ball.y;
    }
    function stepstoend(){
      return ball.x/this.dx;
    }
   function stepstobounce(){
    if (ball.dy < 0){
      return ball.y;
    }else if (ball.dy >0){
       return innerHeight-ball.y;
    }
   }
    function drawline(){ 
      c.beginPath();
      c.moveTo(ball.x,ball.y);
      c.lineTo(lineTox(),lineToy());
      c.strokeStyle = 'Red';
      c.stroke();
    }
    drawline();
    this.draw();
  }
  this.draw = function(){
    c.beginPath();
    c.arc(this.x,this.y,radius, 0 , Math.PI*2);
    c.fill();
  }
}
function randnum(high){
  return (Math.floor(Math.random()*high))+1;
}
//Establish Rectangles
function init(){
  score=0;
  isuser=undefined;
  velocity = innerWidth/180;
  ballArray=[];
  paddlelength = innerHeight/7;
  paddlewidth=innerWidth/150;
  paddlev = paddlelength/7.5;
  paddleArray = [];
  radius = (innerWidth*innerHeight)/200000;
  ball = new Ball(velocity, newdy() );
  paddleArray.push(new Paddle(1,'true'));
  paddleArray.push(new Paddle(innerWidth-paddlewidth-1,'false'));

}
function newdy(){
  return randnum(innerHeight/150 + 5);
}

//Animation Loop
function animate(){
  requestAnimationFrame(animate);
  c.beginPath();
  c.clearRect(0,0,innerWidth,innerHeight);
  ball.update();
  for(let i=0; i<paddleArray.length; i++){
    paddleArray[i].update();
  }
  c.font = "200px Arial";
  c.strokeText(score, -100 + innerWidth/2, innerHeight/2);
}
init();
animate();
