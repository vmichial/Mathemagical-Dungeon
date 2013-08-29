//ctx.fillRect(0, 0, 20, 20)

var testmap = new Array();
testmap[0] = new Array(0, 3, 1, 1, 1, 1);
testmap[1] = new Array(0, 1, 0, 1, 0, 1);
testmap[2] = new Array(0, 1, 0, 1, 0, 1);
testmap[3] = new Array(0, 0, 0, 3, 0, 1, 1);
testmap[4] = new Array(1, 1, 1, 1, 0, 1);
testmap[5] = new Array(1, 0, 1, 1, 0, 1);
testmap[6] = new Array(1, 1, 1, 0, 0, 1);
testmap[7] = new Array(1, 0, 0, 1, 1, 1);
testmap[8] = new Array(1, 1, 1, 1, 1, 1);


function MapLayout (input)
{
	this.layout = input;
	
	this.Draw = function()
	{
		var markX = 0;
		var markY = 0;
		for (var i = 0; i < this.layout.length; i++)
		{
			var temp = this.layout[i];
			for (var j = 0; j < temp.length; j++)
			{
				if(temp[j] == 1)
				{
					ctx.fillStyle = "#000000";
					ctx.fillRect(markX, markY, 50, 50);
				}
				if(temp[j] == 3)
				{
					ctx.fillStyle = "#00FF00";
					ctx.beginPath();
					ctx.arc(markX + 25, markY + 25, 10, 0, 2*Math.PI);
					ctx.stroke();
					ctx.fill();
				}
				markX += 50; 
			}
			markY += 50;
			markX = 0;
		}
	};

}

var test = new MapLayout(testmap);

