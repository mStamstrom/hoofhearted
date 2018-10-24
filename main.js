const api = require('./api');
const helpers = require('./helpers');
const astar = require('./astar');

// TODO: Enter your API key
const API_KEY = '60c4b5fa-b1bd-4ad6-a644-4e2b7fa6e91e';

// Game options
const maxPlayers = 1;
const map = 'standardmap';
const numberOfStreams = 10;
const numberOfElevations = 10;
const numberOfPowerups = 10;

var EndNode;

function play(gameState) {
	console.log('Starting turn ' + gameState.turn)
	// TODO: Implement your solution
	var Maparr = gameState.tileInfo;
	
	var startX = gameState.yourPlayer.xPos;
	var startY = gameState.yourPlayer.yPos;
	var start = Maparr[startY][startX];
	var path = astar.calc(start, startX, startY, EndNode, Maparr);
	// Example
	var directions = ['e', 'w', 'n', 's'];
	var nexttile = path[path.length-2];
	var currentStamina = gameState.yourPlayer.stamina;
	var direction = helpers.getDirection(path[path.length-1], nexttile);
	var speed = helpers.calculateSpeed(path, direction, currentStamina)
	if (gameState.turn < 200) {
		console.log("current position: x: ", gameState.yourPlayer.xPos, "y: ", gameState.yourPlayer.yPos)
		console.log("stamina ", gameState.yourPlayer.stamina);
		console.log("speed", speed);
		api.makeMove(gameState.gameId, direction, speed, play);
	}
	else{
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