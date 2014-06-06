<?php

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
}

//include db connect class
require_once __DIR__ . '/db_connect.php';

//connecting to db
$db = new DB_CONNECT();
if (isset($_REQUEST["gameId"]) && isset($_REQUEST["player"]) && isset($_REQUEST["turn"]) && isset($_REQUEST["score"]) && isset($_REQUEST["playerId"])) {

// NOTE: "player" referenced by the value of '1' or '2' to P1 or P2
//array for JSON response
    $response = array();
    $currentGameId = $_REQUEST["gameId"];
    $player = $_REQUEST["player"];
    $turn = $_REQUEST["turn"];
    $score = $_REQUEST["score"];
    $playerId = $_REQUEST["playerId"];

    if ($score > 50)
    {
        // Score can't be higher than 50, someone probably tried to send an edited php request
        $sql = "INSERT INTO `Errors_Log` (`Source`, `Message`) VALUES ('endTurn.php', 'There was an attempt to increase player $playerId score by $score points');";
        mysql_query($sql);
        
        $response["success"] = 0;
        $response["message"] = "Wrong amount of points";
        
        echo json_encode($response);
        return;
    }
    elseif ($score < 0) {
        // Score can't be higher negative 0, someone probably tried to send an edited php request
        $sql = "INSERT INTO `Errors_Log` (`Source`, `Message`) VALUES ('endTurn.php', 'There was an attempt to decrease player $playerId score by $score points');";
        mysql_query($sql);
        
        $response["success"] = 0;
        $response["message"] = "Can't decrease points of user";
        
        echo json_encode($response);
        return;
    }

    $result = mysql_query("SELECT score, level FROM `Users` WHERE id = $playerId");
    $row = mysql_fetch_array($result);
    $preScore = $row["score"];
    $level = $row["level"];
    $currentScore = $score + $preScore;

    if ($currentScore > ($level * 100 * 1.5)) {
        $level = $level + 1;
    }

    mysql_query("UPDATE `Users` SET score=$currentScore, level=$level WHERE id = $playerId");


//"SELECT SUM(scoreP1) as scoreP1, SUM(scoreP2) as scoreP2 FROM `GameSections` inner join `Games_new` on Games_new.id = GameSections.gameId");
    $result = mysql_query("SELECT SUM(scoreP1) as scoreP1, SUM(scoreP2) as scoreP2 FROM `GameSections` where gameId = $currentGameId");
    $row = mysql_fetch_array($result);
    $totalScoreP1 = $row["scoreP1"];
    $totalScoreP2 = $row["scoreP2"];
// Need to manage the gameId column in gameSections

    $status = 0; // Default status ("תן סימן");
//echo "turn = $turn and player = $player";

    if ($turn == 1 && $player == 1) {
        $status = 2;
    } else if ($turn == 1 && $player == 2) {
        $status = 1;
    } else { // $turn = 2
// Checking who won
        $playerWon = 0;
        if ($totalScoreP1 > $totalScoreP2) {
            $playerWon = 1;
        } else if ($totalScoreP1 < $totalScoreP2) {
            $playerWon = 2;
        } else {
// Tie
// No one gets a point
        }

// If it's not a tie
        if ($playerWon != 0) {
            $result = mysql_query("UPDATE `Matchups` SET scoreP$playerWon = scoreP$playerWon + 1 WHERE currGameId = $currentGameId");
        }
    }


    $sql = "UPDATE `Games_new` SET `status`='$status' WHERE id ='$currentGameId'";
//echo "UPDATE `Games_new` SET `status`='$status' WHERE id ='$currentGameId'";
    $result = mysql_query($sql);

//// check if row inserted or not
    if ($result) {
        $response["success"] = $status;
        $response["preScore"] = $preScore;
        $response["currentScore"] = $currentScore;
        echo json_encode($response);
    } else {
//error
        $response["success"] = 0;
        $response["message"] = "Error in update";

// echo no users JSON
        echo json_encode($response);
    }
} else {
    //error
    $response["success"] = 0;
    $response["message"] = "Error in matchup";

//    echo no users JSON;
    echo json_encode($response);
}
?>