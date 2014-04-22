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

if (isset($_REQUEST["matchId"])) {

//    //array for JSON response 
//    $response = array();
   $matchId = $_REQUEST['matchId'];
//    
//    // Get the current game id
//    $sql ="SELECT * FROM `Matchups` WHERE id ='$matchId'";
//    $result = mysql_query($sql);
//    $currGameId = NULL;
//    if (mysql_num_rows($result) > 0) {
//        $row = mysql_fetch_array($result);
//        $currGameId = $row["currGameId"];
//    }
//    
    $currGameId = $matchId;
    
    // Get the sectiond ids
    $sql ="SELECT * FROM `Games_new` WHERE id ='$currGameId'";
    $result = mysql_query($sql);
    $sectionsId = array();
    if (mysql_num_rows($result) > 0) {
        $row = mysql_fetch_array($result);
        $sectionsId[0]= $row["section1"];
        $sectionsId[1]= $row["section2"];
        $sectionsId[2]= $row["section3"];
        $sectionsId[3]= $row["section4"];
        $sectionsId[4]= $row["section5"];
    }
    
 // Gets the videos path, correct answer and 3 options.    
    $sections = array();
    for ($x=0; $x<=4; $x++) {
    $sql ="SELECT * FROM `GameSections` WHERE id ='$sectionsId[$x]'";
    $result = mysql_query($sql);
       
      if (mysql_num_rows($result) > 0) {
        $row = mysql_fetch_array($result);
        $videoId = $row["videoId"];
        $videos = array();
        $videos["secrionId"] = $sectionsId[$x];
        $videos["currGameId"] = $currGameId;
        $videos["scoreP1"] = $row["scoreP1"];
        $videos["answerP1"] = $row["answerP1"];
        
        $sql ="SELECT * FROM `Movies` WHERE id ='$videoId'";
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
        $response["data"] = $currGameId; 
        
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