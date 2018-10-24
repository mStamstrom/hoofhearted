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
        var steps = 0;
        var lastTile;
        while(direction == currentDirection && steps < 3){
            var previousTile = path[path.length-(steps+1)];
            var tempTile = path[path.length-(steps+2)];
            if(tempTile != undefined){
                lastTile = tempTile;
                direction = this.getDirection(previousTile, tempTile)
                if(direction == currentDirection){
                    cost += this.costOfTile(tempTile.tile, currentDirection);
                }
            }
            else{
                direction = "stoploop";
            }
            steps++;
        } 
        var costforonemore = 1000;
        if(lastTile != undefined){
            var nextTileSameDir = map[this.getYChange(lastTile.y, currentDirection)][this.getXChange(lastTile.y, currentDirection)];
            costforonemore = cost + this.costOfTile(nextTileSameDir, currentDirection, 1, false );
        }
        if(steps <= 1){
            return "slow"
        }
        if(steps == 2){
            if(currentStamina-30 > 50 && cost <= speed.medium){
                return "medium";
            }
            else{
                return "slow";
            }
        }
        if(steps == 3){
            if(currentStamina-50 > 40 && (cost <= speed.fast || costforonemore <= speed.fast)){
                return "fast";
            }
            if(currentStamina-30 > 50 && cost <= speed.medium){
                return "medium";
            }
            else{
                return "slow";
            }
        }
        
        // if(steps > 1){
        //     if(cost + this.costOfTile(nextTileSameDir, currentDirection, 1, false ) <= speed.fast){
        //         if(currentStamina-50 > 35){
        //             return "fast";
        //         }
        //         if(currentStamina-30 > 50){
        //             return "medium";
        //         }
        //         else{
        //             return "slow";
        //         }
        //     }
        //     if(cost + this.costOfTile(nextTileSameDir, currentDirection, 1, false ) <= speed.medium){
        //         if(currentStamina-30 > 50){
        //             return "medium";
        //         }
        //         else{
        //             return "slow";
        //         }
        //     }
        //     else{
        //         return "slow";
        //     }
            
            
        // }
    },
    isTileAfforded: function(tile, currentDirection, movementpointsLeft){
        var cost = this.costOfTile(tile,currentDirection, 1, true );
        return cost < movementpointsLeft;
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
    costOfTile: function(tile, currentDirection, speed = 1, ignoreRain = false){
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

        if(tile.elevation != undefined){
            if (tile.elevation.direction === currentDirection) {
                // same direction
                cost - tile.elevation.amount;
            } else if (
                (tile.elevation.direction === 'n' && currentDirection === 's') ||
                (tile.elevation.direction === 'e' && currentDirection === 'w') ||
                (tile.elevation.direction === 'w' && currentDirection === 'e')) {
                // Opposite direction
                cost + tile.elevation.amount;
            } else {
                // deviation direction
                const speedPerTile = speed/cost;
            }
        }

        if(tile.waterstream != undefined){
            if (tile.waterstream.direction === currentDirection) {
                // same direction
                cost - tile.waterstream.speed;
            } else if (
                (tile.waterstream.direction === 'n' && currentDirection === 's') ||
                (tile.waterstream.direction === 'e' && currentDirection === 'w') ||
                (tile.waterstream.direction === 'w' && currentDirection === 'e')) {
                // Opposite direction
                cost + tile.waterstream.speed;
            } else {
                // deviation
            }
        }
        return cost;
    }
}
