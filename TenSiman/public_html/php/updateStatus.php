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

if (isset($_REQUEST["gameId"]) && isset($_REQUEST["player"]) && isset($_REQUEST["turn"])) {

    //array for JSON response 
    $response = array();
    $gameId = $_REQUEST['gameId'];
    $player = $_REQUEST["player"];
    $turn = $_REQUEST["turn"];
    $status = 0;
    
    if ($turn == 1 && $player == 1) {
        $status = 2;
    } else if ($turn == 1 && $player == 2) {
         $status = 1;
    } 
    

    $sql = "UPDATE `Games_new` SET `status`='$status' WHERE id ='$gameId'";
    $result = mysql_query($sql);

//// check if row inserted or not
    if ($result) {
        $response["success"] = $status;
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