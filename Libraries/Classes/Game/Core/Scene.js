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

function Scene(Type, PlayerData, coreSoundsArray, coreImagesArray, coreObjectsArray, Parent){

	var that = this;
    //defines the type of scene, a string with either, END,CUT,LEVEL,MENU
    this.type =Type;
    
    //the Level Object, check the structures to get a rundown on this(coming soon)
    this.GameWorld = new Level();

    //the Menu Object, check the structures to get a rundown on this(coming soon)
    this.TheMenu = new Menu();

    //The cutscene obeject,check the structures for more info
    this.Cinematic = new CutScene();
    
	//core objects represent an array of all objects that come prebuilt into the game
	//this includes blocks, traps, switches, trees, etc which are assigned to a tile
	this.coreObjects = coreObjectsArray;

	//custom objects are whatever objects you create for this specific scene.
	this.customObjects = new Array();

    //coreSounds hold references to all of the core sounds everyone can have
    this.coreSounds = coreSoundsArray;

    //custom sounds hold references to all sounds unique to this particular scene.
    //custom sounds should be set in initialization by the creator of the scene
    this.customSounds = new Array();

    //coreImages hold references to all of the core images needed for the basic game
    this.coreImages = coreImagesArray;

    //custom images hold references to all images unique to this particular scene.
    //custom images should be initialized by the creator of the scene
    this.customImages = newArray();
    
	//initialize function will call the init of the correct type, and give a loading screen
	//while you wait for assets to load
	this.initilize();
	
	//set custom images lets you set the sources of each of your custom images causing the //page to start loading them, this function is called by init.
	this.setCustomImages();

	//set custom sounds lets you initialize the custom sounds array for the sounds your 
	//scene needs, called by init
	this.setCustomSounds();
	
	//draw will draw based on what the type is
	this.draw() = function(Parent){
		switch(Parent.type){
			case "END":{} break;
			case "CUT":{} break;
			case "LEVEL":{} break;
			case "MENU":{} break;
			
		}
	}

}