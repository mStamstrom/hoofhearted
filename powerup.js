module.exports= {

    shouldUseItemAll: function(item, path){
        var whitelist = ["Shoes", "Umbrella", "Energyboost", "Helmet", "StaminaSale", "Spikeshoes", "Cyklop", "BicycleHandlebar", "RestoreStamina" ];
        // var whitelist = ["shoes", "flippers", "cycletire", "umbrella", "energyboost", "potion", "hemlet", "staminasale", "spikeshoes", "cyklop", "bicyclehandlebar", "restorestamina" ];
        return whitelist.indexOf(item) != -1;
    },
    shouldUseItem: function(item, tile){
        var whitelist = ["RestoreStamina", "Umbrella", "Energyboost", "Helmet", "StaminaSale"];
        var whitelistWater = ["InvertStreams", "Cyklop"];
        var whitelistTrail = ["Spikeshoes" ];
        var whitelistRoad = ["BicycleHandlebar"];
        const generalPowerUpToUse = whitelist.find(x => x === item);
        if (generalPowerUpToUse && whitelist.indexOf(item) !== -1)
            return true;
        if(tile.type === "road" && whitelistRoad.indexOf(item) !== -1)
            return true;
        else if((tile.type === "trail" || tile.type === "grass") && whitelistTrail.indexOf(item) !== -1)
            return true;
        else if(tile.type == "water" && whitelistWater.indexOf(item) !== -1)
            return true;
        else if(tile.weather == "rain" && item === "RemoveCloud")
            return true;
        return false
    }
}