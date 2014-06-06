<?php

    function calculateNextLevelPoints($currentLevel) {
        return calculatePointsTargetForLevel($currentLevel + 1);
    }
 
    function calculatePointsTargetForLevel($currentLevel) {
        if ($currentLevel == 1)
        {
            return 0;
        }

        return (calculatePointsTargetForLevel($currentLevel - 1) + floor((100 * pow(1.25, $currentLevel - 1))));
    }
 
    function getVersionInProd() {
        return "1.2.2";
    }
?>
