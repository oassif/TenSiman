<?php

//This section is for bypassing the cross-domain security error
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

// array for JSON response
$response = array();

// include db connect class
require_once __DIR__ . '/db_connect.php';

// connecting to db
$db = new DB_CONNECT();

//SQL query
$result = mysql_query("SELECT * FROM `Users`") or die(mysql_error());

// check for empty result
if (mysql_num_rows($result) > 0) {
    
    $response["lines"] = array();

    // looping through all results
    while ($row = mysql_fetch_array($result)) {
        // temp chat array
        $chat = array();
        $chat["Email"] = $row["Email"];
        $chat["FirstName"] = $row["FirstName"];
        $chat["LastName"] = $row["LastName"];

        // push single users into final response array
        array_push($response["lines"], $chat);
    }
    // success
    $response["success"] = 1;

    // echoing JSON response
    echo json_encode($response);
    
} else {
    // no users found
    $response["success"] = 0;
    $response["message"] = "No lines found";

    // echo no users JSON
    echo json_encode($response);
}
?>