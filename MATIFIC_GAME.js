
//CANVAS 
var canvas = document.getElementById("canvas");
canvas_width=canvas.width;
canvas_height=canvas.height;
//CONTEXT
var context = canvas.getContext("2d");

var lives=3;
var score=0;
var GAME_OVER=false;

//Draw object 
function Draw_Object(obj){
	image = new Image();
	image.src = obj.path;
	context.drawImage(image,obj.x, obj.y);
}
//Direction moving 
var Keys = {
        left: false,
        right: false
    };

//Keys press and release
window.addEventListener('keydown', function (e) {
      if(e.key == "ArrowLeft"){
      	Keys.left=true;
      }
      else if(e.key == "ArrowRight"){
      	Keys.right=true;
      }
    },false);

    window.addEventListener('keyup', function (e) {
      if(e.key == "ArrowLeft"){
      	Keys.left=false;
      }
      else if(e.key == "ArrowRight"){
      	Keys.right=false;
      }
    },false);

//BOAT
var boat = {
	path:'resources/boat.png',
	x: canvas_width - 243,
	y: canvas_height - 152,
	width: 243,
	height: 152,
	velocity: 8
};

//PLANE
var plane = {
	path:'resources/plane.png',
	x: canvas_width,
	y: 0,
	velocity: 4
};

//SEA
var sea = {
	path:'resources/sea.png',
	x: 0,
	y: canvas_height*(3/4),
};
//BACKGROUND
var background = {
	path:'resources/background.png',
	x:0,
	y: 0,
};

//PARACHUTISTS
var parachutists = {
	path:'resources/parachutist.png',
	xQueue:[],
	yQueue:[],
	width: 77,
	height: 112,
	velocity :3
};

//Moving boat accoring to the direction
function boat_sail(){
	if(Keys.left==true) boat.x-=boat.velocity;
	else if(Keys.right==true) boat.x+=boat.velocity;
}

//Moving plane accoring to the direction
function plan_flight(){
	if(plane.x>=0) plane.x-=plane.velocity;	
	else plane.x= canvas_width;
}

//Insert the paracutists Queue every 3000ms
function new_parachutist(){
		parachutists.xQueue.push(plane.x);
		parachutists.yQueue.push(plane.y);
}

//Draw paracutists and drop them from the plane
function parachutists_draw_and_move(){
	for(var i=0;i<parachutists.xQueue.length;i++){
		var obj = {
			path:parachutists.path,
	        x: parachutists.xQueue[i],
	        y: parachutists.yQueue[i]
	    };
		Draw_Object(obj);
		parachutists.yQueue[i]+=parachutists.velocity;
	}
}

//GAME OVER menu
function game_over_menu(){
	document.body.style.backgroundColor = "lightpink";
	context.textAlign = "center";
	context.font = "50px Georgia";
	context.fillStyle = "black";
	context.fillText("Score = "+score, canvas_width/2, canvas_height/2);
	if(score>=0 && score<=30){
		context.fillText(":(", canvas_width/2, canvas_height*(3/4));
	}
	else{
		context.fillText(":)", canvas_width/2, canvas_height*(3/4));		
	}
	context.font = "70px Verdana";
	// Create gradient
	var gradient = context.createLinearGradient(0, 0, canvas_width, 0);
	gradient.addColorStop("0"," magenta");
	gradient.addColorStop("0.25", "blue");
	gradient.addColorStop("0.5", "red");
	// Fill with gradient
	context.fillStyle = gradient;
	context.fillText("GAME OVER!!",canvas_width/2, canvas_height/4);
}
//Score and Alive menu
function menu(){
	context.font = "20px Georgia";
	context.fillStyle = "black";
	context.fillText("Score: "+score,10, 20);
	context.fillText("Lives: "+lives,10, 40);

}
//Game
function GAME(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	if(!GAME_OVER){
	Draw_Object(background);
	Draw_Object(sea);
	Draw_Object(boat);
	Draw_Object(plane);
	menu();
	plan_flight();
	boat_sail();
	parachutists_draw_and_move();
	if(boat.x < parachutists.xQueue[0] + parachutists.width && boat.x + boat.width > parachutists.xQueue[0] &&
		boat.y < parachutists.yQueue[0] + parachutists.height){
		score += 10
	 	parachutists.xQueue.shift();
	 	parachutists.yQueue.shift();	}
	else if(canvas_height<parachutists.yQueue[0] + parachutists.height ){
		lives-=1;
		parachutists.xQueue.shift();
	 	parachutists.yQueue.shift();
		if(lives == 0){
			GAME_OVER = true;
		}
	 }
	}
	else{
		game_over_menu();
	}
	requestAnimationFrame(GAME);
}
//setInterval(new_parachutist, Math.random()*4000);
setInterval(new_parachutist, 3000);
//Sound
var audio = new Audio('resources/sound.mp3');
audio.play();

GAME();


