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
$name = $_POST['value'];
//
//$url = 'http://en.wikipedia.org/wiki/Steve_Jobs';
//document . url . get_content;
//include db connect class
require_once __DIR__ . '/db_connect.php';

//connecting to db
$db = new DB_CONNECT();

if (isset($_REQUEST["gameId"]) && isset($_REQUEST["currentPlayerId"])) {

    $currGameId = $_REQUEST['gameId'];
    $playerId = $_REQUEST["currentPlayerId"];
    $player = 1;

    $result = mysql_query("SELECT * FROM `Matchups` WHERE currGameId=$currGameId AND player2=$playerId");
    if (mysql_num_rows($result) > 0) {
        $player = 2;
    }
    
    // Calculating if the rival is P1 or P2
    $rivalPlayer = ($player % 2) + 1; 


    // Get the sectiond ids
    $sql = "SELECT * FROM `Games_new` WHERE id ='$currGameId'";
    $result = mysql_query($sql);
    $sectionsId = array();
    if (mysql_num_rows($result) > 0) {
        $row = mysql_fetch_array($result);
        $sectionsId[0] = $row["section1"];
        $sectionsId[1] = $row["section2"];
        $sectionsId[2] = $row["section3"];
        $sectionsId[3] = $row["section4"];
        $sectionsId[4] = $row["section5"];
    }

    // Gets the videos path, correct answer and 3 options.    
    $sections = array();
    for ($x = 0; $x <= 4; $x++) {
        $sql = "SELECT * FROM `GameSections` WHERE id ='$sectionsId[$x]'";
        $result = mysql_query($sql);

        if (mysql_num_rows($result) > 0) {
            $row = mysql_fetch_array($result);
            $videoId = $row["videoId"];
            $videos = array();
            $videos["sectionId"] = $sectionsId[$x];
            $videos["currGameId"] = $currGameId;
            $videos["scoreRival"] = $row["scoreP$rivalPlayer"];
            $videos["answerRival"] = $row["answerP$rivalPlayer"];

            $sql = "SELECT * FROM `Movies` WHERE id ='$videoId'";
            $result = mysql_query($sql);

            if (mysql_num_rows($result) > 0) {
                $row = mysql_fetch_array($result);
                $videos["id"] = $row["id"];
                $videos["moviePath"] = $row["moviePath"];
                $videos["rightAnswer"] = $row["rightAnswer"];
                $videos["wrongOptions"] = $row["wrongOptions"];
            }
            $sections[$x] = $videos;
        }
    }

    $response["sections"] = $sections;


//// check if row inserted or not
    if ($result) {
        $response["success"] = 1;
        $response["currentGame"] = $currGameId;
        $response["turn"] = 2;
        $response["player"] = $player;

        echo json_encode($response);
    } else {
//error
        $response["success"] = 0;
        $response["message"] = "Error in matchup";

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