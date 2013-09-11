
var canvas = document.getElementById("GameScreen");
var ctx = canvas.getContext("2d");
var txtb = document.getElementById("TextBox")

//Prevents window from scrolling, DO NOT TOUCH THIS!
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 33, 34, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


//************************************************************************
// 	Image resources to load up

var tile_floor = new Image();
var tile_floor_left_wall = new Image();
var tile_floor_right_wall = new Image();
var tile_floor_top_corner = new Image();
var tile_left_wall = new Image();
var tile_right_wall = new Image();

tile_floor.src = "Tiles/Tile Types/GreyWorld_Floor.png";
tile_floor_left_wall.src = "Tiles/Tile Types/GreyWorld_Floor_LeftWall.png";
tile_floor_right_wall.src = "Tiles/Tile Types/GreyWorld_Floor_RightWall.png";
tile_floor_top_corner.src = "Tiles/Tile Types/GreyWorld_Floor_TopCorner.png";
tile_left_wall.src = "Tiles/Tile Types/GreyWorld_LeftWall.png";
tile_right_wall.src = "Tiles/Tile Types/GreyWorld_RightWall.png";

var obj_block_object = new Image();
var obj_enemy_spawn = new Image()
var obj_goal = new Image();
var obj_key = new Image();
var obj_player_spawn = new Image();
var obj_switch = new Image();

obj_block_object.src = "Tiles/Objects/Block_Object.png";
obj_enemy_spawn.src = "Tiles/Objects/EnemySpawn_Object.png";
obj_goal.src = "Tiles/Objects/Goal_Object.png";
obj_key.src = "Tiles/Objects/Key_Object.png";
obj_player_spawn.src = "Tiles/Objects/PlayerSpawn_Object.png";
obj_switch.src = "Tiles/Objects/Switch_Object.png";

var cursor_red = new Image();
cursor_red.src = "Tiles/SelectionArrow.png";

//***********************************************************
//    Important global variables to maintain
var _tileWidth = 200;
var _tileHeight = 200;

var _originMapX = 400;
var _originMapY = 400;

var _globalDrawOffsetX = 0;
var _globalDrawOffsetY = 0;

var _cameraLeftX = 150;
var _cameraRightX = 700;
var _cameraTopY = 150;
var _cameraBotY = 400;

var editMode = "tile";

//Variables to set the size of the map grid
var _gridSizeX = 5;
var _gridSizeY = 5;
var _gridSizeZ = 3;  //This one is special! DO NOT TOUCH!
var level_name = "Level1"

var _brushType = 0;

//Tables

TileTable = new Array()
TileTable[0] = {string: "Empty"};
TileTable[1] = {img: tile_floor, string: "Floor"};
TileTable[2] = {img: tile_floor_left_wall, string: "FloorLeftWall"};
TileTable[3] = {img: tile_floor_right_wall, string: "FloorRightWall"};
TileTable[4] = {img: tile_floor_top_corner, string: "FloorTopCorner"};
TileTable[5] = {img: tile_left_wall, string: "LeftWall"};
TileTable[6] = {img: tile_right_wall, string: "RightWall"};

ObjectTable = new Array()
ObjectTable[0] = {string: "Empty"};
ObjectTable[1] = {img: obj_block_object, string: "BlockObject"};
ObjectTable[2] = {img: obj_enemy_spawn, string:"SpawnObject"};
ObjectTable[3] = {img: obj_goal, string: "GoalObject"};
ObjectTable[4] = {img: obj_key, string: "KeyObject"};
ObjectTable[5] = {img: obj_player_spawn, string: "PlayerSpawnObject"};
ObjectTable[6] = {img: obj_switch, string: "SwitchObject"};

//Enum struct

var IDnum = {
	
	empty: 0,
	floor: 1,
	leftWall: 2
}

var idArray = new Array()
idArray[1] = "Floor";
idArray[2] = "Block";

//***********************************************************
//    Tile Class
function Tile(style, obj)
{
	this.type = style;
	this.object = obj;
	
	this.typeString = "";
	this.objectString = "";
	
	this.makeStringData = function()
	{
		this.typeString = TileTable[this.type].string;
		this.objectString = ObjectTable[this.object].string;
	}
	this.makeStringData()
	
	this.setType = function(t)
	{
		this.type = t;
		this.typeString = TileTable[this.type].string;
	}
	
	this.setObject = function(o)
	{
		this.object = o;
		this.objectString = ObjectTable[this.object].string;
	}
	
	this.drawTile = function(x, y)
	{	
		if(this.type != 0)
			ctx.drawImage(TileTable[this.type].img, x, y);
		
		if(this.object != 0)
			ctx.drawImage(ObjectTable[this.object].img, x, y);
	};
}

document.addEventListener('keypress', tileEdit, false);

function tileEdit(e)
{
	//49(1) - 54(6)
	key = e.keyCode;
	
	if (key == 48)
	{
		levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ] = null;
		levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ] = new Array();
	}
	
	if (key == 49)
	{
		var d = levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ].length
		levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ][d] = new Floor({x:cursor.tileX , y:cursor.tileY , z:cursor.tileZ});
	}
	
	if (key == 50)
	{
		var d = levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ].length
		levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ][d] = new Block({x:cursor.tileX , y:cursor.tileY , z:cursor.tileZ});
	}
}

//***********************************************************
//    TileMap class

function TileMap (x, y, z)
{
	this.tileArray = new Array();
	this.width = x;
	this.length = y;
	this.height = z;
	
	
	this.Initialize = function()
	{
		for (var i = 0; i < this.width; i++)
		{
			this.tileArray[i] = new Array()
			for (var j = 0; j < this.length; j++)
			{
				this.tileArray[i][j] = new Array()
				for(var k = 0; k < this.height; k++)
				{
					this.tileArray[i][j][k] = new Array();
					if (k == 0)
					{
						this.tileArray[i][j][k][0] = new Floor({x:i, y:j, j:k});
						//this.tileArray[i][j][k][0] = "Floor"
					}
					else
					{
						//this.tileArray[i][j][k][0] = new Block({x:i, y:j, j:k});
						//this.tileArray[i][j][k][0] = "Block"
					}
				}
			}
		}
		//console.log("Array Initialized");
	};
	
	this.drawMap = function(offsetX, offsetY)
	{
		
		var startX = _originMapX;
		var startY = _originMapY;
		
		var markerX = startX;
		var markerY = startY;
		
		for (var k = 0; k < this.height; k++)
		{
			for(var j = 0; j < this.length; j++)
			{
				for(var i = 0; i < this.width; i++)
				{
					
					if (this.tileArray[i][j][k] != null)
					{
						
						for (var l = 0; l < this.tileArray[i][j][k].length; l++)
						{
							switch(this.tileArray[i][j][k][l].id)
							{
							case 1:
								ctx.drawImage(tile_floor ,markerX + offsetX, markerY + offsetY);
								break;
							case 2:
								ctx.drawImage(obj_block_object ,markerX + offsetX, markerY + offsetY);
								break;1
							}
						}
					}
					
					markerX += _tileWidth/2;
					markerY += _tileHeight/4;
				}
				startX -= _tileWidth/2;
				startY += _tileHeight/4;
				markerX = startX;
				markerY = startY;
			}
			startX = _originMapX;
			startY = _originMapY - (_tileHeight/2 * (1 + k));
			markerX = startX;
			markerY = startY;
		}
	}
}

//***********************************************************
//    cursor class: also controls the 'camera'
//	  includes the functionality for brush in here'
//    the cursor is the camera and brush too, that makes sense, right?

var cursor = {
	
	posX: _originMapX,
	posY: _originMapY,
	
	tileX: 0,
	tileY: 0,
	tileZ: 0,
	
	drawCursor: function(offsetX, offsetY) {
		ctx.drawImage(cursor_red, this.posX, this.posY);
	}
}

document.addEventListener('keydown', cursorMove, false);
function cursorMove(e)
{
	//console.log(e)
	var key = e.keyCode;
	
	//So for any key, first we check if we're at the edge of the map and if there's space to move in that
	//given direction. Afterwards, we check to see if we need to move the cursor or the global offset.
	//And, of course, adjusting the values of the cursors tile position.
	
	//left on a column: increment y by one
	if (key == 37)
	{
		if((_gridSizeY - 1) > cursor.tileY)
		{
			if(cursor.posX < _cameraLeftX || cursor.posY > _cameraBotY)
			{
				_globalDrawOffsetX += _tileWidth/2;
				_globalDrawOffsetY -= _tileHeight/4;
			}
			else
			{
				cursor.posX -= _tileWidth/2;
				cursor.posY += _tileHeight/4;
			}
			cursor.tileY += 1;
		}
	}
	//right on a column: decrement y by one
	if (key == 39)
	{
		if(0 < cursor.tileY)
		{
			if(cursor.posX > _cameraRightX || cursor.posY < _cameraTopY)
			{
				_globalDrawOffsetX -= _tileWidth/2;
				_globalDrawOffsetY += _tileHeight/4;
			}
			else
			{
				cursor.posX += _tileWidth/2;
				cursor.posY -= _tileHeight/4;
			}
			cursor.tileY -= 1;
		}
	}
	//up on a row: decrement x by one
	if (key == 38)
	{
		if(0 < cursor.tileX)
		{
			if(cursor.posX < _cameraLeftX || cursor.posY < _cameraTopY)
			{
				_globalDrawOffsetX += _tileWidth/2;
				_globalDrawOffsetY += _tileHeight/4;
			}
			else
			{
				cursor.posX -= _tileWidth/2;
				cursor.posY -= _tileHeight/4;
			}
			cursor.tileX -= 1;
		}
	}
	//down on a row: increment x by one
	if (key == 40)
	{
		if((_gridSizeX - 1)  > cursor.tileX)
		{
			if(cursor.posX > _cameraRightX || cursor.posY > _cameraBotY)
			{
				_globalDrawOffsetX -= _tileWidth/2;
				_globalDrawOffsetY -= _tileHeight/4;
			}
			else
			{
				cursor.posX += _tileWidth/2;
				cursor.posY += _tileHeight/4;
			}
			cursor.tileX += 1;
		}
	}
	//go up a level: increment z by one
	if (key == 33)
	{
		if ((_gridSizeZ - 1) > cursor.tileZ)
		{
			_globalDrawOffsetY += _tileHeight/2;
			cursor.tileZ += 1;
		}
	}
	//go down a level: decrement z by one
	if (key == 34)
	{
		if (0 < cursor.tileZ)
		{
			_globalDrawOffsetY -= _tileHeight/2;
			cursor.tileZ -= 1;
		}
	}
	
	if (key == 66)
	{
		editMode = "brush";
		//console.log("Brush mode active", _brushType);
		_brushType = levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ].type;
	}
	
	//brushTile(key);
	//console.log(cursor.tileX, cursor.tileY, cursor.tileZ)
}

function brushTile(key)
{
	if (editMode == "brush" && key >= 48 && key <= 54)
	{
		_brushType = key - 48;
	}
	if (editMode == "brush")
	{
		levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ].setType(_brushType);
	}
}

//***********************************************************
//     Exporter and Importer codes

document.addEventListener("keydown", exportimportfunc, false);

function ExportAsText4dHelper(i, j, k)
{
	var stringData = levelMap.tileArray[i][j][k].length
	
	stringData += "\n"
		
	for (var l = 0; l < levelMap.tileArray[i][j][k].length; l++)
	{
		//stringData += levelMap.tileArray[i][j][k][l].id
		stringData += JSON.stringify(levelMap.tileArray[i][j][k][l])
		stringData += "\n"
	}
	return stringData
}

function ExportAsText()
{
	/*
	txtb.value = ("" + _gridSizeX + ":" + _gridSizeY + ":" + _gridSizeZ + "\n");
	for (var j = 0; j < _gridSizeY; j++)
	{
		for (var i = 0; i < _gridSizeX; i++)
		{
			for (var k = 0; k < _gridSizeZ; k++)
			{
				txtb.value += (ExportAsText4dHelper(i, j, k));
				txtb.value += "@@@\n";			
			}
		}
		txtb.value += "\n";
	}
	txtb.value += (level_name + "\nEND");*/
	
	txtb.value = JSON.stringify(levelMap)
	
	localStorage.setItem('MapData',txtb.value);
}

function ExportAsCode()
{
	txtb.value = ("var " + level_name + " = new TileMap(" + _gridSizeX + "," + _gridSizeY + "," +  _gridSizeZ + ")\n");
	txtb.value += (level_name + ".Initialize()\n");
	for (var i = 0; i < _gridSizeX; i++)
	{
		for (var j = 0; j < _gridSizeY; j++)
		{
			for (var k = 0; k < _gridSizeZ; k++)
			{
				for (var l = 0; l < levelMap.tileArray[i][j][k].length; l++)
				{
					txtb.value += (level_name + "[" + i + "][" + j + "][" + k + "][" + l + "] = new " + idArray[levelMap.tileArray[i][j][k][l].id] + "({x:" + i + " ,y:" + j + " ,z:" + k + "});\n");
					levelMap.tileArray[i][j][k]
				}
			
				//txtb.value += (level_name + "[" + i + "][" + j + "][" + k + "] = new " + idArray[levelMap.tileArray[i][j][k].id] + "({x:" + i + " ,y:" + j + " ,z:" + k + "});\n");
			}
		}
	}	
}

function ImportFromText()
{
/*
	var data = txtb.value
	
	var sizeData=data.slice(0, data.search("\n"));
	sizeX = sizeData.slice(0, sizeData.search(":"));
	sizeX = parseInt(sizeX);
	sizeData = sizeData.substr(sizeData.search(":") + 1);
	sizeY = sizeData.slice(0, sizeData.search(":"));
	sizeY = parseInt(sizeY);
	sizeData = sizeData.substr(sizeData.search(":") + 1);
	sizeZ = sizeData;
	sizeZ = parseInt(sizeZ);
	
	//console.log(sizeX, sizeY, sizeZ)
	
	_gridSizeX = sizeX;
	_gridSizeY = sizeY;
	_gridSizeZ = sizeZ;
	
	levelMap = new TileMap(_gridSizeX, _gridSizeY, _gridSizeZ)
	levelMap.Initialize()
	
	data = data.substr(data.search("\n") + 1);

	for (var j = 0; j < sizeY; j++)
	{
		for (var i = 0; i < sizeX; i++)
		{	
			for (var k = 0; k < sizeZ; k++)
			{
				var dataSet = data.slice(0, data.search("@@@\n"));

				data = data.substr(data.search("@@@\n")+4);
				
				var arSize = dataSet.slice(0, dataSet.search("\n"));
				
				dataSet = dataSet.substr(dataSet.search("\n") + 1)
				for (var l = 0; l < arSize; l++)
				{
					var obData = dataSet.slice(0, dataSet.search("\n"))
					levelMap.tileArray[i][j][k][l] = JSON.parse(obData) 
					dataSet = dataSet.substr(dataSet.search("\n") + 1)
				}
				
			}
		}
	}
	
	data = data.substr(data.search("\n") + 1);

	//Shit's gone here
	
	level_name = data.slice(0, data.search("\n"));
	level_name = level_name.trim()*/


	
	var data = JSON.parse(txtb.value)
	levelMap = new TileMap(data.width, data.length, data.height)
	levelMap.Initialize()
	levelMap.tileArray = data.tileArray
	_gridSizeX = levelMap.width;
	_gridSizeY = levelMap.length;
	_gridSizeZ = levelMap.height;
	console.log(levelMap)
}

function FetchFromLocalStorage()
{
	txtb.value = localStorage.getItem('MapData');
	ImportFromText()
}

function exportimportfunc(e)
{
	var key = e.keyCode
	//console.log(key)
	if (key == 69) ExportAsText();
	if (key == 74) ExportAsCode();
	if (key == 73) ImportFromText();
	if (key == 76) FetchFromLocalStorage();

}




//***********************************************************
//        The side info window

function DisplayInfo()
{
	ctx.fillStyle = "#F0F0F0";
	ctx.fillRect(canvas.width - 200, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "#000000";
	ctx.font="25px Arial";
	
	//Show the coordinates of the cursor
	ctx.fillText("X: ", 1000, 40);
	ctx.fillText(cursor.tileX, 1100, 40);
	ctx.fillText("Y: ", 1000, 70);
	ctx.fillText(cursor.tileY, 1100, 70);
	ctx.fillText("Z: ", 1000, 100);
	ctx.fillText(cursor.tileZ, 1100, 100);
	//show the type of tile
	ctx.fillText("Tile type:", 1000, 230);
	ctx.fillText(levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ].type, 1120, 230);
	ctx.fillText(levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ].typeString, 1010, 260);
	
	ctx.fillText("Tile object:", 1000, 300);
	ctx.fillText(levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ].object, 1140, 300);
	ctx.fillText(levelMap.tileArray[cursor.tileX][cursor.tileY][cursor.tileZ].objectString, 1010, 330);
	
	//show the edit mode
	ctx.fillText("Edit Mode:", 1000, 400);
	ctx.fillText(editMode, 1020, 430);
	
	ctx.fillText(level_name, 1050, 550);
	
	

}

//***********************************************************
//               Initializing data and the game loop

setInterval(Game, 1000/60);

var levelMap = new TileMap(_gridSizeX, _gridSizeY, _gridSizeZ)
	levelMap.Initialize()

function Initialize()
{
	_gridSizeX = prompt("Rows?", 5);
	_gridSizeY = prompt("Columns?", 5);
	_gridSizeZ = prompt("Levels?", 3);
	level_name = prompt("Level Name?\nAll one word or the code exporter will not work!", "Level1");
	levelMap = new TileMap(_gridSizeX, _gridSizeY, _gridSizeZ)
	levelMap.Initialize()
}
Initialize()
function Game()
{
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	
	levelMap.drawMap(_globalDrawOffsetX, _globalDrawOffsetY);
	cursor.drawCursor(_globalDrawOffsetX, _globalDrawOffsetX);
	//DisplayInfo();

}