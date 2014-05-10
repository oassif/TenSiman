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

// Checking that value exists
if (isset($_REQUEST["gameId"])) {

    $gameId = $_REQUEST["gameId"];
    //$playerId = $_REQUEST["playerId"];
    $game = mysql_query("SELECT * FROM Games_new WHERE id=$gameId");

// Check first query result
    if (mysql_num_rows($game) > 0) {

        $response = array();
        $row = mysql_fetch_array($game);
        $matchupId = $row["matchupId"];
        $status = $row["status"];
        $response["status"] = $status;
        $initiator = $row["initiator"];


        // Gets the players Id
        $matchup = mysql_query("SELECT * FROM Matchups WHERE id=$matchupId");
        $row = mysql_fetch_array($matchup);
        $player1 = $row["player1"];
        $player2 = $row["player2"];


        $player1det = mysql_query("SELECT * FROM Users WHERE id=$player1");
        $player2det = mysql_query("SELECT * FROM Users WHERE id=$player2");

        // Gets the players details
        if ($initiator == 2) {
            $player2det = mysql_query("SELECT * FROM Users WHERE id=$player1");
            $player1det = mysql_query("SELECT * FROM Users WHERE id=$player2");
        }


        // Gets the sections: word and score
        $sectionsDet = mysql_query("SELECT * FROM GameSections WHERE gameId=$gameId");
        $response["sections"] = array();
        $sumScoreP1 = 0;
        $sumScoreP2 = 0;

        while ($row = mysql_fetch_array($sectionsDet)) {
            $videoId = $row["videoId"];
            $video = mysql_query("SELECT * FROM Movies WHERE id=$videoId");
            $videoRow = mysql_fetch_array($video);

            $sections = array();
            $sections["word"] = $videoRow["rightAnswer"];

            $scoreP1 = $row["scoreP1"];
            $scoreP2 = $row["scoreP2"];

            if ($initiator == 2) {
                $scoreP2 = $row["scoreP1"];
                $scoreP1 = $row["scoreP2"];
            }

            $sections["scoreP1"] = $scoreP1;
            $sections["scoreP2"] = $scoreP2;

            $sumScoreP1 += $scoreP1;
            $sumScoreP2 += $scoreP2;

            array_push($response["sections"], $sections);
        }

        $response["player1"] = array();
        $row = mysql_fetch_array($player1det);
        $players = array();
        $players["name"] = $row["FirstName"];
        $players["pic"] = $row["imgURL"];
        $players["score"] = $sumScoreP1;
        array_push($response["player1"], $players);


        $response["player2"] = array();
        $row = mysql_fetch_array($player2det);
        $players = array();
        $players["name"] = $row["FirstName"];
        $players["pic"] = $row["imgURL"];
        $players["score"] = $sumScoreP2;

        array_push($response["player2"], $players);
    }

    if ($game) {
        $response["success"] = 1;
        $response["message"] = "Sucess";
        echo json_encode($response);
    } else {
        $response["success"] = 0;
        $response["message"] = "Error!!!!!!";
        echo json_encode($response);
    }
}
?>