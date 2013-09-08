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

//the events we listen for are clicking down, pressing a key, and releasing a key
Canvas.addEventListener('mousedown', GameManager.ClickHandler,false);
Canvas.addEventListener('keydown', GameManager.keyDownHandler, false);
Canvas.assEventListener('keyup', GameManager.keyUpHandler, false);

var SceneManager = function(can,con){
	this.canvas = can;
	this.context = con;
	var that = this;
	//loadloop is for adding a set interval. this will run a function 
	//over and over. When init is called, you will get a load screen
	//loop that shows how much of the assets are loaded.
	this.loadLoop;
	this.loadImage= new Image();
	this.loadImage.src = "";
	
	//gameloop is for adding a setinterval. The game loop willrun
	//the functions from whatever scene is running.
	this.gameLoop;
	//this array holds references to the scene objects you have
	this.scenes = new Array();
	
	//by default the current scene is negative one, which is no scene
	this.currentScene = -1;
	
	//this adds the scene to the array
	this.addScene = function(scene){
		this.scenes[numScenes++] = scene;
	}
	
	this.findSceneByName = function(NAME){
		if(this.scenes.length == 0){this.currentScene = -1; return;}
		for( var i = 0; i<this.scenes.length; i++){
			if(this.scenes[i].name == NAME){this.currentScene = i;return;}
		}
		else this.currentScene = 0;
	}
	
	//this array is for image objects representing thecore game
	this.coreImages = new Array();
	this.imagesReady = new Array();//as the images load, this array will gain bools
	//this array is forthe audio objects representing the core game
	this.coreSounds = new Array();
	this.soundsReady = new Array();//bools representing if they are ready
		
	this.coreObjects = new Array();
	
	//clickHandler is never called explicitly by the programmer
	//you should not be polling to know if a click happened,
	//you should however do all click handling here. pass it off to the 
	//scene. evt is an alias for the even object passed by javascript
	this.clickHandler = function(evt){
		this.scenes[this.currentScene].clickHandler(evt);
	}
	
	// you also do not call key handler yourself. but instead
	//structure your code so that when a key is pressed, you do 
	//the work immediate
	this.keyDownHandler = function(evt){
		this.scenes[this.curentScene].keyDownHandler(evt);
	}
	
	//just as with the other even handlers, don't poll, just 
	//do the even handling upon receiving an even
	this.keyUpHandler = function(evt){
		this.scenes[this.currentScene].keyUpHandler(evt);
	}
	
	this.playGame = function(){
		
	}
	
	//once you call init, you get a loading screen
	this.Init = function(){
		
	}
	
	//this handles the loading screen
	this.loading = function(){
		if( this.picsReady() && this.auidosReady() ){
			clearInterval(this.loadLoop);
			this.playGame();
		}
		else{
			this.canvas.drawImage
		}
	}
	
	
	


}
var GameManager = new SceneManager(Canvas,context);