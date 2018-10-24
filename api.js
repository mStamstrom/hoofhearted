var http = require('http');

const HOST = 'theconsidition.se';
const BASE_PATH = '/considition/ironman';

var _apikey;
var _silent = false;

function log(message) {
	if (!_silent) {
		console.log('API: ' + message);
	}
}

function handleResponseError(e) {
	console.log(e);
	system.exit(1);
}

function handleResponse(response) {
	if (response.statusCode >= 400 && response.statusCode < 600) {
		log(response.statusCode + ': ' + response.statusMessage);
		return false;
	}
	return true;
}

function handleResponseData(data) {
	if (data.success === false) {
		var message = 'An API error occured: ' + data.message;
		log(message);
		return false;
	}
	return true;
}

function get(path, callback) {
	var options = {
		host: HOST,
		path: BASE_PATH + '/' + path,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': _apikey
		}
	};
	var request = http.request(options, function(response) {
		var content = '';
		response.on('data', function(chunk) {
			content += chunk;
		});
		response.on('end', function() {
			var data = JSON.parse(content);
			if (!handleResponseData(data)) {
				callback(null);
			}
			if (!handleResponse(response)) {
				callback(null);
			}
			callback(data);
		});
	});
	request.end();
}

function post(path, data, callback) {
	var options = {
		host: HOST,
		path: BASE_PATH + '/' + path,
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json; charset=utf-8',
			'x-api-key': _apikey
		}
	}
	var request = http.request(options, function(response) {
		var content = '';
		response.on('data', function(chunk) {
			content += chunk;
		});
		response.on('end', function() {
			var data = JSON.parse(content);
			if (!handleResponseData(data)) {
				callback(null);
			}
			else if (!handleResponse(response)) {
				callback(null);
			}
			else {
				callback(data);
			}
		});
	});
	request.write(JSON.stringify(data));
	request.end();
}

function deleteRequest(path, data, callback) {
	var options = {
		host: HOST,
		path: BASE_PATH + '/' + path,
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json; charset=utf-8',
			'x-api-key': _apikey
		}
	}
	var request = http.request(options, function(response) {
		var content = '';
		response.on('data', function(chunk) {
			content += chunk;
		});
		response.on('end', function() {
			var data = JSON.parse(content);
			if (!handleResponseData(data)) {
				callback(null);
			}
			else if (!handleResponse(response)) {
				callback(null);
			}
			else {
				callback(data);
			}
		});
	});
	request.write(JSON.stringify(data));
	request.end();
}

module.exports = {
	silence: function() {
		_silent = true;
	},
	
	unsilence: function() {
		_silent = false;
	},

	setApiKey: function(apiKey) {
		_apikey = apiKey;
	},
	
	initGame: function(maxPlayers, map, numberOfStreams, numberOfElevations, numberOfPowerups, callback) {
		post('games', {
			maxPlayers: maxPlayers,
			map: map,
			numberOfStreams: numberOfStreams,
			numberOfElevations: numberOfElevations,
			numberOfPowerups: numberOfPowerups
		}, function(result) {
			if (result === null) {
				process.exit(1);
			}
			log('Created new game: ' + result.gameId);
			callback(result.gameId);
		});
	},
	
	getGame: function(gameId, callback) {
		get('games/' + gameId + '/' + _apikey, function(result) {
			if (result === null) {
				process.exit(1);
			}
			log('Getting game: ' + gameId);
			callback(result.gameState);
		});
	},
	
	joinGame: function(gameId, callback) {
		post('games/' + gameId + '/join', {}, function(result) {
			if (result === null) {
				process.exit(1);
			}
			log('Joined game: ' + gameId);
			callback(result.gameState);
		});
	},
	
	readyUp: function(gameId, callback) {
		log('Readying up!');
		post('games/' + gameId + '/ready', {}, function(result) {
			if (result === null) {
				process.exit(1);
			}
			callback(result.gameState);
		});
	},
	
	tryReadyUp: function(gameId, callback) {
		log('Readying up!');		
		var tryFunc = function() {
			log('Trying to ready up!');
			post('games/' + gameId + '/ready', {}, function(result) {
				if (result === null) {
					setTimeout(tryFunc, 3000);
				}
				else {
					callback(result.gameState);
				}
			});
		};
		
		tryFunc();
	},
	
	makeMove: function(gameId, direction, speed, callback) {
		log('Attempting to makeMove with speed: ' + speed + ' and direction: ' + direction);
		post('games/' + gameId + '/action/move', {
			speed: speed,
			direction: direction
		}, function(result) {
			if (result === null) {
				process.exit(1);
			}
			callback(result.gameState);
		});
	},
	
	step: function(gameId, direction, callback) {
	    log('Attempting to step in direction: ' + direction);
		post('games/' + gameId + '/action/step', {
			direction: direction
		}, function(result) {
			if (result === null) {
				process.exit(1);
			}
			callback(result.gameState);
		});
	},
	
	rest: function(gameId, callback) {
		log('Attempting to rest!');
		post('games/' + gameId + '/action/rest', {}, function(result) {
			if (result === null) {
				process.exit(1);
			}
			callback(result.gameState);
		});
	},
	
	usePowerup: function(gameId, powerupName, callback) {
		log('Attempting to use powerup: ' + powerupName);
		post('games/' + gameId + '/action/usepowerup', {
			name: powerupName
		}, function(result) {
			if (result === null) {
				process.exit(1);
			}
			callback(result.gameState);
		});
	},
	
	dropPowerup: function(gameId, powerupName, callback) {
		log('Attempting to drop powerup: ' + powerupName);
		post('games/' + gameId + '/action/droppowerup', {
			name: powerupName
		}, function(result) {
			if (result === null) {
				process.exit(1);
			}
			callback(result.gameState);
		});
	},

	endPreviousGamesIfAny: function(callback) {
		log('Attempting to end previous games if any.');
		deleteRequest('games', {}, function(result) {
			callback();
		});
	}
};