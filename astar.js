/* tile

*/
/* node 
        g
        h
        f
        x
        y
        tile
 */

var open, Closed, endNode, MapArr;
const helpers = require('./helpers');
module.exports = {

    calc: function(startTile, startX, startY, goalNode, map){
        open = [];
        Closed = [];
        MapArr = map;
        endNode = goalNode;
        var startnode = {tile: startTile, x: startX, y: startY};
        startnode.f = this.f(startnode);
        startnode.h = this.h(startnode, endNode);
        startnode.g = this.g(startnode);
        endNode.h = 0;
        endNode.g = 0;
        open.push(startnode);
        while(open.length > 0){
            this.sortOpen();
            var currentNode =  open.shift();
            if(currentNode.tile.type == "win"){
                //we are done
                return this.getStepArray(currentNode);
            }
            else{
                if(!this.exists(Closed,currentNode)){
                    Closed.push(currentNode);
                    this.addChildrenToClosed(currentNode);
                }
            }
        }
        console.log(endNode)
    },
    exists(arr, element){
        return arr.filter(function(elem){ return elem.x == element.x && elem.y == element.y}).length > 0;
    },
    addChildrenToClosed: function(parentNode){
        var neighbors = [this.createObj(parentNode.x-1, parentNode.y), this.createObj(parentNode.x+1, parentNode.y), this.createObj(parentNode.x, parentNode.y+1), this.createObj(parentNode.x, parentNode.y-1)];
        neighbors = neighbors.filter(function(elem){ return elem != null})
        neighbors.forEach(element => {
            if(!this.exists(Closed,element)){
                element.parent = parentNode;
                element.h = parentNode.h + this.h(parentNode, element);
                element.g = this.g(element);
                element.f = element.h + element.g;
                open.push(element)
                this.sortOpen();
            }
        });
    },
    getStepArray: function(startNode){
        var current = startNode;
        var steps = [current];
        while(current.parent != undefined){
            steps.push(current.parent);
            current = current.parent;
            if(current.tile.type == "start"){break;}
        }
        return steps;
    },
    sortOpen: function(){
        open.sort(function(a, b){
            return a.f - b.f;
        })
    },
    createObj: function(x, y){
        if(MapArr[y] == undefined)
            return null;
        if(MapArr[y][x] == undefined)
            return null;
        if(!helpers.isWalkable(MapArr[y][x]))
            return null;
        return {tile: MapArr[y][x], x: x, y: y};
    },
    f: function(node){
        return this.h(node, endNode) + this.g(node);

    },
    h: function(node, end){
        var xDic = Math.abs(node.x - end.x);
        var yDic = Math.abs(node.y - end.y);
        var dic = Math.sqrt(Math.pow(xDic, 2) + Math.pow(yDic, 2));
        return dic;
    },
    g: function(node){
        return helpers.costOfTile(node.tile, "e")
    }
}