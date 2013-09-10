/*
	The scene manager is basically the game. 
	It calls forth each scene, and it holds 
	the vars for core functionality.
	
	for example, there are tiles, and objects, and sounds
	that are part of the core game, the manager holds these
	and any scene can access them through parent
	
	If a scene is a custom level not built with the core assets
	then that scene must supply them on their own and have a loading
	screen for when they are initialized.
	
	The scene manager interacts with all scenes the same way. Calling the scene's 
	initialize function, the the play function in accordance with the fps.
	it will continually call play until prompted to stop by the scene. it will 
	then check the scene's next variable to know the ID of the scene it 
	needs to call next. Then move to that scene and init + play. 
	
	you have to manually use addscene to populate the manager with scenes. 
	The manager will play the scene added first automatically when you 
	use the play game function from the scene manager. however after this,
	the scene manager will look to the scene itself to determine which scene is 
	called next.
*/
var Canvas = document.getElementById("myCanvas");
var context = Canvas.getContext("2d");

var canvasHeight = 768;
var canvasWidth = 1024;

Canvas.height = canvasHeight;
Canvas.width = canvasWidth;

var FPS = 60;

var SceneManager = function(can,con){	
	this.canvas = can;
	this.context = con;
	var that = this;
	//loadloop is for adding a set interval. this will run a function 
	//over and over. When init is called, you will get a load screen
	//loop that shows how much of the assets are loaded.
	var loadLoop;
	this.loadImage= new Image();
	this.loadImage.src = "loadingScreen.png";
	
	//gameloop is for adding a setinterval. The game loop willrun
	//the functions from whatever scene is running.
	var gameLoop;
	//this array holds references to the scene objects you have
	this.scenes = new Array();
	
	//by default the current scene is negative one, which is no scene
	this.currentScene = -1;
	this.lastScene = -1;
	this.numScenes = 0;
	
	//this adds the scene to the array
	this.addScene = function(scene){
		this.setParent(scene);
		this.scenes[this.numScenes++] = scene;
	}
	
	this.findSceneByName = function(NAME){
		if(this.scenes.length == 0){this.currentScene = -1; return;}
		for( var i = 0; i<this.scenes.length; i++){
			if(this.scenes[i].name == NAME){
				this.lastScene=this.currentScene; this.currentScene = i;
				this.scenes[i].init(); return;
			}
		}
		this.currentScene = 0;
	}
	
	//this function will change the current scene for watever scene came before, 
	//best used for menu scenes that exist with another scene, like pause menus
	this.prevScene = function(){
		this.currentScene = this.lastScene;
	}
	
	//this array is for image objects representing thecore game
	this.coreImages = new Array();
	this.imagesReady = new Array();//as the images load, this array will gain bools
	//this array is forthe audio objects representing the core game
	this.coreSounds = new Array();
	this.soundsReady = new Array();//bools representing if they are ready
	
	//scenes have a right to change info in the manager, so set parent gives the scene a ref
	this.setParent = function(scene){
		scene.parent = that;
	}
	
	//clickHandler is never called explicitly by the programmer
	//you should not be polling to know if a click happened,
	//you should however do all click handling here. pass it off to the 
	//scene. evt is an alias for the even object passed by javascript
	var clickHandler = function(evt){
		console.log("CLICK");
		that.scenes[that.currentScene].clickHandler(evt);
	}
	
	// you also do not call key handler yourself. but instead
	//structure your code so that when a key is pressed, you do 
	//the work immediate
	var keyDownHandler = function(evt){
		console.log("KeyDown");
		that.scenes[that.curentScene].keyDownHandler(evt);
	}
	
	//just as with the other event handlers, don't poll, just 
	//do the even handling upon receiving an even
	var keyUpHandler = function(evt){
		console.log("keyUp");
		that.scenes[that.currentScene].keyUpHandler(evt);
	}
	
	this.playScenes = function(){
		//console.log(that.scenes)
		that.scenes[that.currentScene].update();
		that.scenes[that.currentScene].draw();
	}
	
	this.playGame = function(){
		this.currentScene = 0;
		this.scenes[this.currentScene].init();
		gameLoop = setInterval(that.playScenes,1000,FPS);
	}
	
	//once you call init, you get a loading screen
	this.init = function(parent){
		this.coreImages[0] = new Array();
		this.coreImages[0][0] = new Image();
		this.coreImages[0][1] = new Image();
		this.coreImages[0][2] = new Image();
		this.coreImages[0][3] = new Image();
		this.coreImages[0][4] = new Image();
		this.coreImages[0][5] = new Image();
		this.coreImages[0][0].onload = function(){that.imagesReady[0] = true;}
		this.coreImages[0][1].onload = function(){that.imagesReady[1] = true;}
		this.coreImages[0][2].onload = function(){that.imagesReady[2] = true;}
		this.coreImages[0][3].onload = function(){that.imagesReady[3] = true;}
		this.coreImages[0][4].onload = function(){that.imagesReady[4] = true;}
		this.coreImages[0][5].onload = function(){that.imagesReady[5] = true;}
		
		this.coreImages[0][0].src = "Assets/Images/Tiles/Core/GreyWorld/GreyWorld_Floor.png";
		this.coreImages[0][1].src = "Assets/Images/Tiles/Core/GreyWorld/GreyWorld_Floor_LeftWall.png";
		this.coreImages[0][2].src = "Assets/Images/Tiles/Core/GreyWorld/GreyWorld_Floor_RightWall.png";
		this.coreImages[0][3].src = "Assets/Images/Tiles/Core/GreyWorld/GreyWorld_Floor_TopCorner.png";
		this.coreImages[0][4].src = "Assets/Images/Tiles/Core/GreyWorld/GreyWorld_LeftWall.png";
		this.coreImages[0][5].src = "Assets/Images/Tiles/Core/GreyWorld/GreyWorld_RightWall.png";
		
		this.coreSounds[0] = new Audio("Assets/Sounds/Core/Music/Burn My Dread.mp3");
		console.log(this.coreSounds[0]);
		this.soundsReady[0] = false;
		this.coreSounds[0].addEventListener('canplaythrough',function(){that.soundsReady[0] = true;},false);
		
		for(var i = 0; i<this.coreImages[0].length ; i++){
				this.imagesReady[i] = false;
		}
		
		
		loadLoop = setInterval(that.loading, 1000/FPS);
	}
	
	this.picsReady = function(bools){
		for(var i=0;i<bools.length;i++){
			if(bools[i] == false) return false;
		}
		return true;
	}
	
	this.audiosReady = function(bools){
		for(var i=0;i<bools.length;i++){
			if(bools[i] == false) return false;
		}
		return true;
	}
	
	//this handles the loading screen
	that.loading = function(){
		//console.log(that.imagesReady);
		if( that.picsReady(that.imagesReady) && that.audiosReady(that.soundsReady) ){
			clearInterval(that.loadLoop);
			that.context.clearRect(0,0,that.canvas.width, that.canvas.height);
			that.playGame();
		}
		else{
			that.context.drawImage(that.loadImage,0,0);
		}
	}
	
	


}
var GameManager = new SceneManager(Canvas,context);
var aScene = new Scene("CUT");
//the events we listen for are clicking down, pressing a key, and releasing a key
Canvas.addEventListener('mousedown', GameManager.clickHandler,false);
Canvas.addEventListener('keydown', GameManager.keyDownHandler, false);
Canvas.addEventListener('keyup', GameManager.keyUpHandler, false);

GameManager.addScene(aScene);
GameManager.init();
