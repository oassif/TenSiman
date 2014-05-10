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

// TODO: change all $_GET to $_POST
// Save the given LiveGame id
$facebookId = $_REQUEST['userId'];

//include db connect class
require_once __DIR__ . '/db_connect.php';

//connecting to db
$db = new DB_CONNECT();

// Checking that value exists
if (isset($_REQUEST["facebookFriends"]) && isset($_REQUEST["userId"])) {

    $facebookFriends = $_REQUEST["facebookFriends"];
    $userId = $_REQUEST["userId"];

    $response["matches"] = array();
    $response["toInvite"] = array();

//    echo($facebookFriends);
    //   $facebookFriends = array(1378982912, 137898291);
    // Gets all the players that are in the game

    foreach ($facebookFriends as $friend) {
        $result = mysql_query("SELECT u.id as rivalId,
                                   concat(FirstName, ' ', LastName) AS rivalName,
                                   imgURL AS rivalImg
                                   FROM `Users` u
                                   WHERE facebookId=$friend");

        if (mysql_num_rows($result) > 0) {
            $row = mysql_fetch_array($result);
            $rivalId = $row["rivalId"];

            // Check if the current player allreday played with him.
            $result1 = mysql_query("SELECT * FROM `Matchups` WHERE player1=$rivalId
                                   AND player2=$userId");

            $result2 = mysql_query("SELECT * FROM `Matchups` WHERE player2=$rivalId
                                   AND player1=$userId");

            if (mysql_num_rows($result1) == 0 && mysql_num_rows($result2) == 0) {
                $match = array();
                $match["rivalName"] = $row["rivalName"];
                $match["rivalImg"] = $row["rivalImg"];
                $match["rivalId"] = $row["rivalId"];

                // push single users into final response array
                array_push($response["matches"], $match);
            }


            // Friends doesnt has the application
        } else {
                array_push($response["toInvite"], $friend);
        }
    }
}

if ($result) {
    $response["success"] = 1;
    $response["message"] = "Sucess"; //TODO: can delete message from here and the error
    echo json_encode($response);
} else {
//error
    $response["success"] = 0;
    $response["message"] = "Error!!!!!!";

// echo no users JSON
    echo json_encode($response);
}
?>