<?php
include 'TenSimanUtils.php';
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
if (isset($_REQUEST["userId"])) {
    
    $userId = $_REQUEST["userId"];
        
     // TODO: try to get the live game (might fail so need to handle error - wrond id or invalid id)
    $result = mysql_query("SELECT * FROM Users WHERE id=$userId");
    $result2 = mysql_query("SELECT m.id as matchupId,
                                   scoreP1 AS userScore,
                                   scoreP2 AS rivalScore,
                                   status AS gameStatus,
                                   g.id AS LiveGameId,
                                   FirstName AS rivalFirstName,
                                   LastName As rivalLastName,
                                   player2 AS rivalId,
                                   imgURL AS rivalImg,
                                   (SELECT level FROM `Users` WHERE id = player2) AS rivalLevel
                                   FROM `Matchups` m, `Games_new` g, `Users` u
                                   WHERE player1=$userId
                                         AND m.player2 = u.id
                                         AND currGameId = g.id");
             //SELECT  FROM Games WHERE player1Id=$userId");
     $result3 = mysql_query("SELECT m.id as matchupId,
                                    scoreP2 AS userScore,
                                    scoreP1 AS rivalScore,
                                    status AS gameStatus,
                                    g.id AS LiveGameId,
                                    FirstName AS rivalFirstName,
                                    LastName As rivalLastName,
                                    player1 AS rivalId,
                                    imgURL AS rivalImg,
                                    (SELECT level FROM `Users` WHERE id = player1) AS rivalLevel
                                    FROM `Matchups` m,`Games_new` g, `Users` u
                                    WHERE player2=$userId
                                          AND m.player1 = u.id
                                          AND currGameId = g.id");
             //SELECT * FROM Games WHERE player2Id=$userId");
     
}
 
// Check first query result
if (mysql_num_rows($result) > 0) {
    $response["user"];
    $row = mysql_fetch_array($result);
    $user = array();

    $user["fullName"] = $row["FirstName"]." ".$row["LastName"];
    $user["level"] = $row["Level"];
    $user["NextLevelPointsTarget"] = calculateNextLevelPoints($row["Level"]);
    $user["score"] = $row["Score"];
    $user["imgURL"] = $row["imgURL"];

    $response["user"] = $user;
}

$response["matches"] = array();
// IMPORTANT note - $match["gameStatus"] will be calculated and return:
//  0 - no invitation ; 1 - user turn (regular game) ; 2 - rivals turn ; 3 - user turn (expert challange)

// Check second query result (where player1 is the user)
if (mysql_num_rows($result2) > 0) {

    // looping through all results
    while ($row = mysql_fetch_array($result2)) {
        // temp chat array
        $match = array();
        $match["userScore"] = $row["userScore"];
        $match["rivalScore"] = $row["rivalScore"];
        if ($row["gameStatus"] == 4) {
            $match["gameStatus"] = "2";
        }
        else {
            $match["gameStatus"] = $row["gameStatus"];
        }
        $match["rivalFirstName"] = $row["rivalFirstName"];
        $match["rivalLastName"] = $row["rivalLastName"];
        $match["rivalImg"] = $row["rivalImg"];
        $match["rivalId"] = $row["rivalId"];
        $match["rivalLevel"] = $row["rivalLevel"];
        $match["LiveGameId"] = $row["LiveGameId"];
        $match["matchupId"] = $row["matchupId"];

        // push single users into final response array
        array_push($response["matches"], $match);
    }
}

// Check third query result (where player2 is the user
if (mysql_num_rows($result3) > 0) {

    // looping through all results
    while ($row = mysql_fetch_array($result3)) {
        // temp chat array
        $match = array();
        $match["userScore"] = $row["userScore"];
        $match["rivalScore"] = $row["rivalScore"];
        if ($row["gameStatus"] == 2) {
            // it's the 2nd player turn - so it's the user turn
            $match["gameStatus"] = "1";
        }
        else if ($row["gameStatus"] == 4) {
            // the 2nd player got expert challange so giving the right status
            $match["gameStatus"] = "3";
        }
        else if ($row["gameStatus"] == 0) {
            // 0 remain 0
            $match["gameStatus"] = "0";
        }
        else {
            // it's the other user's turn (either regular game or expert game)
            $match["gameStatus"] = "2";
        }
        $match["rivalFirstName"] = $row["rivalFirstName"];
        $match["rivalLastName"] = $row["rivalLastName"];
        $match["rivalImg"] = $row["rivalImg"];
        $match["rivalId"] = $row["rivalId"];
        $match["rivalLevel"] = $row["rivalLevel"];
        $match["LiveGameId"] = $row["LiveGameId"];
        $match["matchupId"] = $row["matchupId"];

        // push single users into final response array
        array_push($response["matches"], $match);
    }
}


//// check if row inserted or not
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