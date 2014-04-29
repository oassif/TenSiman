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
if (isset($_REQUEST["section"]) && isset($_REQUEST["player"])) {
 
    // NOTE: "player" referenced by the value of '1' or '2' to P1 or P2
    
    //array for JSON response
    $response = array();
    $whichPlayer = $_REQUEST['player'];
    $sectionObject = $_REQUEST["section"];
    $sectionId = $sectionObject[0];
    $answer = $sectionObject[3];
    $score = $sectionObject[4];
    //$section = $_REQUEST['section'];
 /*echo 'e';
    $sectionId = $_REQUEST["sectionId"];
echo 'f';    $answer = $_REQUEST["answer"];
    echo 'd';$score = $_REQUEST["score"];
    echo 'a';$whichPlayer = $_REQUEST["whichPlayer"];
    echo 'qq';*/
    
    $result = mysql_query("UPDATE GameSections SET scoreP$whichPlayer = '$score', answerP$whichPlayer= '$answer' WHERE id=$sectionId");
    
//// check if row inserted or not
    if ($result) {
        $response["success"] = 1;
        $response["message"] = "section Updated!";
        echo json_encode($response);
    } else {
//error
        $response["success"] = 0;
        $response["message"] = "Error";

// echo no users JSON
        echo json_encode($response);
    }
} else {
    //error
    $response["success"] = 0;
    $response["message"] = "Error";

//    echo no users JSON;
    echo json_encode($response);
}
?>