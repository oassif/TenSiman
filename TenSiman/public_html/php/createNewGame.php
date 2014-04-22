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

if (isset($_REQUEST["matchId"]) && isset($_REQUEST["currentPlayerId"])) {

    //array for JSON response 
    $response = array();
    $matchId = $_REQUEST['matchId'];
    $playerId = $_REQUEST["currentPlayerId"];
    $player = 1;
   
    /*
    $result = mysql_query("SELECT * FROM `Matchups` WHERE id=$matchId AND player2=$playerId");

    if (mysql_num_rows($result) > 0) {
        $player = 2;
    }*/
    
    $result = mysql_query("SELECT * FROM `Matchups` WHERE id=$matchId");
    
    // TODO: what if didn't find any 
    if (mysql_num_rows($result) > 0) {
        $row = mysql_fetch_array($result);
        $player2Id = $row["player2"];
        $currentGameId = $row["currGameId"];
    }
    else
    {
        $response["success"] = 0;
        $response["message"] = "No match found!";

        echo json_encode($response);
        return;
    }
    
    $result = mysql_query("SELECT * FROM `Games_new` WHERE id=$currentGameId");
    $row = mysql_fetch_array($result);

    if ($row["status"] != "0")
    {
        $response["success"] = 0;
        $response["message"] = "Can't create new game, game in progress";

        echo json_encode($response);
        return;
    }
    
    if ($playerId == $player2Id)
    {
        $player = 2;
    }
    
    // Generate 5 random numbers
    $sql1 = "SELECT id FROM `Movies`";
    //echo $sql;
    $result = mysql_query($sql1);
    $countMovies = mysql_num_rows($result);

    $numbers = range(1, $countMovies);
    shuffle($numbers);
    array_slice($numbers, 0, 5);
   //echo json_encode($numbers);
    
    $sections = array();
    $videoIdArray = array();
    $sectionIdArray = array("1", "1", "1", "1", "1");

    for ($x = 0; $x <= 4; $x++) {
        $id = $numbers[$x];
        $sql = "SELECT * FROM `Movies` WHERE id ='$id'";
        $result = mysql_query($sql);

        if (mysql_num_rows($result) > 0) {
            $row = mysql_fetch_array($result);
            $videos = array();
            $videos["id"] = $row["id"];
            $videos["moviePath"] = $row["moviePath"];
            $videos["rightAnswer"] = $row["rightAnswer"];
            $videos["wrongOptions"] = $row["wrongOptions"];

            $sql = "INSERT INTO `GameSections` (`gameId`, `videoId`, `scoreP1`, `scoreP2`, `answerP1`, `answerP2`) VALUES ('', '$id',0, 0, '', '')";
            $resultMatchup = mysql_query($sql);
            $sectionId = mysql_insert_id();

            $videos["sectionId"] = $sectionId;

            $sectionIdArray[$x] = $sectionId;
            $videoIdArray[$x] = $row["id"];

            $sections[$x] = $videos;
        }
    }


    $response["sections"] = $sections;


    $result = mysql_query("INSERT INTO `Games_new` (`matchupId`, `status`, `section1`, `section2`, `section3`, `section4`, `section5`, `dateCreated`) VALUES ('$matchId', $player, '$sectionIdArray[0]',  '$sectionIdArray[1]',  '$sectionIdArray[2]',  '$sectionIdArray[3]',  '$sectionIdArray[4]', '2013-01-01 01:00:00')");
    $idCurGame = mysql_insert_id();
    
    // Setting the gameId for each of the sections. TODO: we might wish to remove the sectionId from the games_new table
    $sql = "UPDATE `GameSections` SET `gameId`='$idCurGame' WHERE id IN ($sectionIdArray[0], $sectionIdArray[1], $sectionIdArray[2], $sectionIdArray[3], $sectionIdArray[4])";
    $result = mysql_query($sql);

    $sql = "SELECT * FROM `Matchups` WHERE id ='$matchId'";
    $result = mysql_query($sql);
    $lastGameId = NULL;
    if (mysql_num_rows($result) > 0) {
        $row = mysql_fetch_array($result);
        $lastGameId = $row["currGameId"];
    }

    $sql = "UPDATE `Matchups` SET `currGameId`='$idCurGame', `lastGameId`='$lastGameId' WHERE id = '$matchId'";
    $result = mysql_query($sql);


//// check if row inserted or not
    if ($result) {

        $response["success"] = 1;
        $response["currentGame"] = $idCurGame;
        $response["turn"] = 1;
        $response["player"] = $player;

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