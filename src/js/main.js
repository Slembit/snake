var canvas = document.getElementById("maze");
var context = canvas.getContext("2d");
var animationFrameRate = window.requestAnimationFrame;
var bestScore = [];

var Game = {
	obsticle: randomObsticle(),
	fps: 16,
	explosionSize: 3,
	score: 0,
	end: false,
	message: "0",
	size: 10,
	writeMessage: function(){

		context.globalAlpha=0.2;
		context.font = "70px Arial";
		context.fillText(this.message, canvas.width / 2, canvas.height / 2);
		context.globalAlpha=1;

	},
	maze: function(){

		context.rect(0, 0, canvas.width, canvas.height);
		context.stroke();
		Game.drawObsticles();
		
	},
	drawObsticles: function(){

		for ( var i = 0; i < this.obsticle.length; i++) {
			context.rect(this.obsticle[i][0], this.obsticle[i][1], this.size,this.size);
		}
		context.stroke();
		
	},
	reset: function(){

		context.clearRect(0 , 0, canvas.width, canvas.height);
		context.beginPath();

	},
	start: function(e){

		context.globalAlpha=0.2;
		context.font = "25px Arial";
		context.fillText("Press Space to release Bombs", 0, canvas.height / 2);
		context.fillText("To start Game press F5", 0, canvas.height / 2 + 40);
		context.globalAlpha=1;


	},
	updateFps: function(){

		if (this.score != 0) {
			if (this.score % 5 === 0) {
				this.fps += (this.score / 5);
			}
		}

	}


}; //Game object end


var Snake = {
	body: [],
	size: 10,
	moveDirection: 39,
	x_axis: 0,
	y_axis: 0,
	inverseDirection: {39: 37, 40: 38, 37: 39, 38: 40},
	move: function(){

		switch(this.moveDirection) {//event.keyCode
		    case 37:
		        this.x_axis -= this.size //left 
		        break;
		    case 40:
		        this.y_axis += this.size;//up
		        break;
		    case 39:
		        this.x_axis += this.size;//right
		        break;
		    case 38:
		        this.y_axis -= this.size;//down
		        break;
		}

		this.isCollision();
		this.body.push([this.x_axis,this.y_axis]);

	},
	drawSnake: function(){

		for ( var i = 0; i < this.body.length; i++) {
		  context.rect(this.body[i][0], this.body[i][1], this.size,this.size/*x_axis, y_axis, Snake.size, Snake.size*/);
		}
		context.stroke();
		this.body.shift();

	},

	releaseBomb: function(){

		var xR_axis, xL_axis, yU_axis, yD_axis, size = (this.size * Game.explosionSize);

		xR_axis = this.x_axis + this.size;
		xL_axis = this.x_axis - this.size;
		yU_axis = this.y_axis + this.size;
		yD_axis = this.y_axis - this.size;

		if (explossion(Game.obsticle, xR_axis, yU_axis) || explossion(Game.obsticle, xL_axis, yD_axis) ) {
			Snake.drawBomb(size);
		}

	},
	drawBomb: function(size){

		context.rect((this.x_axis - this.size), (this.y_axis - this.size), size, size);		
		context.stroke();
		
	},
	foundFood: function(){

		if (this.x_axis == Food.x_axis && this.y_axis == Food.y_axis) {
			Food.placeGoodFood();
			this.body.push([this.x_axis,this.y_axis]);
			Game.score++;
			Game.message = Game.score;
			Game.updateFps();
		}

	},
	isCollision: function(){

		if (this.x_axis > canvas.width - this.size || this.x_axis < 0 || this.y_axis > canvas.height - this.size || this.y_axis < 0 )  {
			bestScore.push(Game.score);
			Game.end = true;
		}
		if(calColl(Game.obsticle, this.x_axis, this.y_axis) || calColl(this.body, this.x_axis, this.y_axis) ){
			bestScore.push(Game.score);
			Game.end = true;
		}	
		
	}// is collision

}; // Snake object end 

var Food = {
	size: 10,
	x_axis: 20,
	y_axis: 30,
	placeGoodFood: function(){

		this.x_axis = Math.oneTies(1, (canvas.height / 10) );
		this.y_axis = Math.oneTies(1, (canvas.width / 10) );

		if(calColl(Game.obsticle, this.x_axis, this.y_axis)){
			this.placeGoodFood();
		}

	},
	drawFood: function(){

		context.fillStyle = "brown";
		context.rect(this.x_axis,this.y_axis,this.size,this.size);
		context.fill();
		
	}

}; // Food object end


//functions

Math.oneTies = function(min, max) {
  return (this.floor(this.random() * (max - min)) + min) * 10;
}

function calColl(array, x_axis, y_axis){
	for (var i = 0; i < array.length; i++) {
		if (array[i][0] == x_axis && array[i][1] == y_axis) {
			return true;
		}
	}
}

function explossion(array, x_axis, y_axis){
	for (var i = 0; i < array.length; i++) {
		if (array[i][0] == x_axis && array[i][1] == y_axis) {
			array.splice(i, Game.explosionSize);
			return true;
		}
	}
}

window.addEventListener('keydown', function(e){

	if (e.keyCode == 32) {
		Snake.releaseBomb();
	}

	if (e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 40) {
		
		if (e.keyCode != Snake.inverseDirection[Snake.moveDirection]){
			Snake.moveDirection = e.keyCode;
		}
	}
});			

function loop() {
	if (Game.end === false) {
		Game.reset();
		Snake.move();
		Snake.foundFood();
		Food.drawFood();
		Snake.drawSnake();	
		Game.maze();
		Game.drawObsticles();
		Game.writeMessage();

		//repeat
		setTimeout(function() {
			animationFrameRate(loop);
		}, 1000 / Game.fps);
	}else{
		Game.start();

	}
};

function randomObsticle(){

	var chosen;

	var fed = [
	[40,150],[50,150],[60,150],[70,150],[80,150],[90,150],[100,150],[110,150],[120,150],
	[40,240],[50,240],[60,240],[70,240],[80,240],[90,240],[100,240],[110,240],
	[30,150],[30,160],[30,170],[30,180],[30,190],[30,200],[30,210],[30,220],[30,230],[30,240],
	[30,250],[30,260],[30,270],[30,280],[30,290],[30,300],[30,310],[30,320],[30,330],
	[160,150],[170,150],[180,150],[190,150],[200,150],[210,150],[220,150],[230,150],[240,150],
	[150,150],[150,160],[150,170],[150,180],[150,190],[150,200],[150,210],[150,220],[150,230],
	[150,250],[150,260],[150,270],[150,280],[150,290],[150,300],[150,310],[150,320],[150,330],
	[230,240],[220,240],[210,240],[200,240],[190,240],[180,240],[170,240],[160,240],[150,240],
	[240,330],[230,330],[220,330],[210,330],[200,330],[190,330],[180,330],[170,330],[160,330],
	[300,150],[300,160],[300,170],[300,180],[300,190],[300,200],[300,210],[300,220],[300,230],[300,240],
	[300,250],[300,260],[300,270],[300,280],[300,290],[300,300],[300,310],[300,320],[300,330],
	[400,160],[400,170],[400,180],[400,190],[400,200],[400,210],[400,220],[400,230],[400,240],
	[400,250],[400,260],[400,270],[400,280],[400,290],[400,300],[400,310],[400,320],
	[390,160],[380,160],[370,160],[360,160],[350,150],[340,150],[330,150],[320,150],[310,150],
	[390,320],[380,320],[370,320],[360,320],[350,330],[340,330],[330,330],[320,330],[310,330]
	];
	var line = [[390,320],[380,320],[370,320],[360,320],[350,330],[340,330],[330,330],[320,330],[310,330],
	[160,150],[170,150],[180,150],[190,150],[200,150],[210,150],[220,150],[230,150],[240,150],
	[400,160],[400,170],[400,180],[400,190],[400,200],[400,210],[400,220],[400,230],[400,240]];

	chosen = Math.random()

	if (chosen < 0.5) {
		return fed;
	}else{
		return line;	
	}
	
}





requestAnimationFrame(loop);