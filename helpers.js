const speed = {
    fast: 210,
    medium: 150,
    slow: 100,
}
module.exports= {
    isWalkable: function(tile){
        return tile.type != "forest" && tile.type != "rockywater";
    },
    getDirection: function(start,stop){
        xdir =  stop.x - start.x;
        ydir =  stop.y - start.y;
        if(xdir < 0){
            return 'w';
        }
        if(xdir > 0){
            return 'e';
        }
        if(ydir < 0){
            return 'n';
        }
        if(ydir > 0){
            return 's';
        }
    },
    calculateSpeed: function(map, path, currentDirection, currentStamina){
        var direction = currentDirection;
        var cost = 0;
        var nrsteps = 0;
        var lastTile;
        var steps = [];
        while(direction == currentDirection){
            var previousTile = path[path.length-(nrsteps+1)];
            var tempTile = path[path.length-(nrsteps+2)];
            if(tempTile != undefined){
                lastTile = tempTile;
                direction = this.getDirection(previousTile, tempTile)
                if(direction == currentDirection){
                    cost += this.costOfTile(tempTile.tile, true);
                    steps.push(tempTile.tile)
                }
            }
            else{
                direction = "stoploop";
            }
            nrsteps++;
        } 
        var canGoOneMore = true;
        if(lastTile != undefined){
            var nextTileSameDir = map[this.getYChange(lastTile.y, currentDirection)][this.getXChange(lastTile.y, currentDirection)];
            if(nextTileSameDir != undefined && nextTileSameDir.type == "forest" || nextTileSameDir == "rockywater"){
                canGoOneMore = false;
            }
        }
        var devCost = + this.costOfDeviation(steps, "slow", currentDirection)
        if(cost + devCost <= speed.slow || (currentStamina - 30) <= 45){
            if(cost + devCost + 20 <= speed.slow){
                return "step";
            }
            return "slow";
        }
        devCost = + this.costOfDeviation(steps, "medium", currentDirection)
        if(cost + devCost <= speed.medium || (currentStamina - 50) <= 45 ){
            if(!canGoOneMore && cost + devCost + 20 <= speed.medium){
                return "slow";
            }
            return "medium";
        }
        else{
            devCost = + this.costOfDeviation(steps, "medium", currentDirection)
            if(!canGoOneMore && cost + devCost + 20 <= speed.fast){
                return "medium"
            }
            return "fast";
        }
        
    },
    getYChange: function(y, direction){
        if(direction == "n"){
            return y+1;
        }
        if(direction == "s"){
            return y-1;
        }
        return y;
    },
    getXChange: function(x, direction){
        if(direction == "e"){
            return x+1;
        }
        if(direction == "w"){
            return x-1
        }
        return x;
    },
    costOfTile: function(tile, ignoreRain = false){
        var cost = 0;
        if(tile == undefined)
            return 1000;

        if(tile.type == "road")
            cost += 31;
        else if(tile.type == "trail")
            cost += 40;
        else if(tile.type == "grass")
            cost += 50;
        else if(tile.type == "water")
            cost += 45;
        else if(tile.type == "forest")
            cost += 1000;
        else if(tile.type == "rockywater")
            cost += 1000;
        
        if(!ignoreRain && tile.weather == "rain")
            cost += 7; // Detta är egentligen stamina så kanske borde vara högre.

       
        return cost;
    },
    costOfDeviation: function(tileArr, speed, direction){
        var cost = 0;
        if(speed = "fast"){
            speed = 50;
        }
        if(speed = "medium"){
            speed = 30;
        }
        if(speed = "slow"){
            speed = 10;
        }
        tileArr.forEach(tile => {
            if(tile.elevation != undefined){
                if (tile.elevation.direction === direction) {
                    // same direction
                    cost -= speed/tile.elevation.amount;
                } else if (
                    (tile.elevation.direction === 'n' && direction === 's') ||
                    (tile.elevation.direction === 'e' && direction === 'w') ||
                    (tile.elevation.direction === 'w' && direction === 'e')) {
                    // Opposite direction
                    cost += speed/tile.elevation.amount;
                } else {
                    // deviation direction
                    const speedPerTile = speed/cost;
                }
            }

            if(tile.waterstream != undefined){
                if (tile.waterstream.direction === direction) {
                    // same direction
                    cost -= speed/tile.waterstream.speed;
                } else if (
                    (tile.waterstream.direction === 'n' && direction === 's') ||
                    (tile.waterstream.direction === 'e' && direction === 'w') ||
                    (tile.waterstream.direction === 'w' && direction === 'e')) {
                    // Opposite direction
                    cost += speed/tile.waterstream.speed;
                } else {
                    // deviation
                }
            }
        });
        return cost;
    },
    weightsForDeviation: function(tile){
        if(tile.elevation != undefined || tile.waterstream != undefined)
            return 5;
        return 0;
    }
}
