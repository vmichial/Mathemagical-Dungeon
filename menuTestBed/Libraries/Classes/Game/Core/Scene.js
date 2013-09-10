//game objects hold an image that needs rendering, and logic for being interacted with
//it needs to know its tile number if you want it to affect other tiles relative to itself,
//common things a tile can so are change object info of other objects, change tile info, or change PlayerAvatar info.

function GameObject(TileNumX,TileNumY,type,imSrc){
//object types are ENEMYSPAWN,PLAYERSPAWN,EXIT,BLOCK,DOOR
//GATE,SWITCH. the type isn’t for the object to know what to do, but for the
//player avatar to know what to do in response.
ObjectType = type;
imageSrc = imSrc;
isActive = true;

objectImage = new Image();

//The start function is called by init
Start();
}

function Tile(){
    
}

function Level(TileString){

TileArray = new Array();
}

function Scene(Type){
	//this is set by the scene manager, and will hold a reference to said manager
	this.parent;

	var that = this;
    //defines the type of scene, a string with either, END,CUT,LEVEL,MENU
    this.type =Type;
    
    //the Level Object, check the structures to get a rundown on this(coming soon)
    this.GameWorld;

    //the Menu Object, check the structures to get a rundown on this(coming soon)
    this.TheMenu;

    //The cutscene obeject,check the structures for more info
    this.Cinematic ;

    //coreSounds hold references to all of the core sounds everyone can have
    this.coreSounds;

    //custom sounds hold references to all sounds unique to this particular scene.
    //custom sounds should be set in initialization by the creator of the scene
    this.customSounds = new Array();

    //coreImages hold references to all of the core images needed for the basic game
    this.coreImages;

    //custom images hold references to all images unique to this particular scene.
    //custom images should be initialized by the creator of the scene
    this.customImages = new Array();
    
	//initialize function will call the init of the correct type, and give a loading screen
	//while you wait for assets to load
	this.init = function(){
		this.coreSounds = parent.coreSounds;
		this.coreImages = parent.coreImages;
	
	}
	this.initialize = function(){
	
	}
	
	
	//draw will draw based on what the type is
	this.draw = function(){
		switch(that.type){
			case "END":{} break;
			case "CUT":{} break;
			case "LEVEL":{} break;
			case "MENU":{} break;
			
		}
	}

	this.update = function(){
		switch(that.type){
			case "END":{} break;
			case "CUT":{} break;
			case "LEVEL":{} break;
			case "MENU":{} break;
			
		}
	}
}