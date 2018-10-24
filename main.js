const api = require('./api');
const helpers = require('./helpers');
const astar = require('./astar');
const powerup = require('./powerup');

// TODO: Enter your API key
const API_KEY = '60c4b5fa-b1bd-4ad6-a644-4e2b7fa6e91e';

// Game options
const maxPlayers = 1;
const map = 'standardmap';
const numberOfStreams = 10;
const numberOfElevations = 10;
const numberOfPowerups = 1000;

var EndNode;

function play(gameState) {
	var Maparr = gameState.tileInfo;
	if(gameState.gameStatus == "finished"){
		var curX = gameState.yourPlayer.xPos;
		var curY = gameState.yourPlayer.yPos;
		
		console.log("x ", curX, " y ", curY)
		var curpos = Maparr[curY][curX];

		console.log("Game is finished please keep on winnig: ", curpos);
		setTimeout(function(){ console.log("waited for 3 sec, now going again") }, 3000);
		api.endPreviousGamesIfAny(initGame);
		return;
	}
	console.log('Starting turn ' + gameState.turn + ' status ' + gameState.gameStatus)
	// TODO: Implement your solution
	
	
	var startX = gameState.yourPlayer.xPos;
	var startY = gameState.yourPlayer.yPos;
	var start = Maparr[startY][startX];
	var path = astar.calc(start, startX, startY, EndNode, Maparr);

	var currentTile = path[path.length-1];
	var currentStamina = gameState.yourPlayer.stamina;
	if (currentTile.type != "win") {
		const {powerupInventory} = gameState.yourPlayer;
		const powerUpToUse = powerupInventory.find(x => powerup.shouldUseItem(x));
		if (powerUpToUse) {
			api.usePowerup(gameState.gameId, powerUpToUse, play);
		} else if (powerupInventory.length === 3) {
			const powerUpToDrop = powerupInventory.find(x => !powerup.shouldUseItem(x));
			if (powerUpToDrop)
				api.dropPowerup(gameState.gameId, powerUpToDrop, play);
		} else {
			var nexttile = path[path.length-2];
			var direction = helpers.getDirection(currentTile, nexttile);
			var speed = helpers.calculateSpeed(path, direction, currentStamina)
			console.log("current position: x: ", gameState.yourPlayer.xPos, "y: ", gameState.yourPlayer.yPos)
			console.log("stamina ", gameState.yourPlayer.stamina);
			console.log("speed", speed);
			if(currentStamina < 20){
				api.rest(gameState.gameId, play)
			}
			api.makeMove(gameState.gameId, direction, speed, play);
		}
	}	else {
		console.log("1 round down, many to go.")
		api.endPreviousGamesIfAny(initGame);
	}
}

function main() {
	
	//initGame();
	//Can only have 2 active games at once. This will end any previous ones.
	api.endPreviousGamesIfAny(initGame);
}

function initGame() {
	console.log("initing game");
	api.initGame(maxPlayers, map, numberOfStreams, numberOfElevations, numberOfPowerups, joinGame);
}

function joinGame(gameId) {
	console.log("joining game", gameId);
	api.joinGame(gameId, readyUp);
}

function readyUp(gameState) {
	console.log("readying up");
	for(x = 0; x<gameState.tileInfo.length; x++){
		var tempList = gameState.tileInfo[x];
		for(y = 0; y<tempList.length; y++){
			if(tempList[y].type == "win"){
				EndNode = { tile: tempList[y], x: x, y: y};
				console.log(EndNode)
			}
		}
	}
	api.tryReadyUp(gameState.gameId, play);
}

api.setApiKey(API_KEY);
main();