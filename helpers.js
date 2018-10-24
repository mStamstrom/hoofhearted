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
    calculateSpeed: function(path, currentDirection, currentStamina){
        var direction = currentDirection;
        var cost = 0;
        var counter = 2;
        while(direction == currentDirection && !(counter > 5)){
            var previousTile = path[path.length-counter+1];
            var tempTile = path[path.length-counter];
            if(tempTile != undefined){
                direction = this.getDirection(previousTile, tempTile)
            }
            else{
                direction = "stoploop";
            }
            counter++;
        }
        var steps = counter - 2; 
        if(steps <= 1){
            return "slow"
        }
        if(steps > 1){
            cost += this.costOfTile(path[path.length-1], currentDirection);
            for(counter; counter > 2; counter--){
                var pathElem = path[path.length-counter]
                if(pathElem != undefined){
                    cost += this.costOfTile(pathElem.tile, currentDirection);
                }
            }
            if(cost <= speed.slow){
                return "slow";
            }
            if(cost < speed.medium){
                if(currentStamina-30 > 50){
                    return "medium";
                }
                else{
                    return "slow";
                }
            }
            else{
                if(currentStamina-50 > 35){
                    return "fast";
                }
                if(currentStamina-30 > 50){
                    return "medium";
                }
                else{
                    return "slow";
                }
            }
            
        }
    },
    costOfTile: function(tile, curentDirection){
        var cost = 0;
        if(tile == undefined)
            return 210;

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
        
        if(tile.weather == "rain")
            cost += 7; // Detta är egentligen stamina så kanske borde vara högre.

        if(tile.elevation != undefined){
            //do something
        }
        if(tile.waterstream != undefined){
            //do something
        }
        return cost;
    }
}