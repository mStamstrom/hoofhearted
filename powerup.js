module.exports= {
    shouldUseItem: function(item, path){
        var whitelist = ["Shoes", "Umbrella", "Energyboost", "Potion", "Helmet", "StaminaSale", "Spikeshoes", "Cyklop", "BicycleHandlebar", "RestoreStamina" ];
        // var whitelist = ["shoes", "flippers", "cycletire", "umbrella", "energyboost", "potion", "hemlet", "staminasale", "spikeshoes", "cyklop", "bicyclehandlebar", "restorestamina" ];
        return whitelist.indexOf(item) != -1;
    }
}