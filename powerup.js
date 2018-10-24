module.exports= {
    shouldUseItem: function(item, path){
        var whitelist = ["shoes", "flippers", "cycletire", "umbrella", "energyboost", "potion", "hemlet", "staminasale", "spikeshoes", "cyklop", "bicyclehandlebar", "restorestamina" ];
        return whitelist.indexOf(item) != -1;
    }
}