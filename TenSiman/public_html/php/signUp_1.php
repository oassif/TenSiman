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

if (isset($_REQUEST["email"]) && isset($_REQUEST["userFirstName"]) && isset($_REQUEST["userLastName"]) &&
        isset($_REQUEST["userFacebookId"]) && isset($_REQUEST["imgUrl"]) && isset($_REQUEST["userGender"]) && isset($_REQUEST["userBirthday"]) && isset($_REQUEST["playerToInvite"])) {

    //array for JSON response 
    $response = array();
    $email = $_REQUEST['email'];
    $userFirstName = $_REQUEST['userFirstName'];
    $userLastName = $_REQUEST['userLastName'];
    $userFacebookId = $_REQUEST['userFacebookId'];
    $imgUrl = $_REQUEST['imgUrl'];
    $userGender = $_REQUEST['userGender'];
    $userBirthday = $_REQUEST['userBirthday'];
    $playerToInvite = $_REQUEST['playerToInvite'];

    if ($playerToInvite == "true") {
        $result1 = mysql_query("SELECT * FROM Users WHERE facebookId=$userFacebookId");
        if (mysql_num_rows($result1) == 0) {
            $sql = "INSERT INTO `Users` (`Email`, `FirstName`, `LastName`, `Level`, `Score`, `facebookId`, `imgURL`, `gender`, `birthday`, `playerToinvite`) "
                    . "VALUES ('$email', '$userFirstName', '$userLastName', '0', '0', '$userFacebookId', '$imgUrl', '$userGender', '$userBirthday', '1')";
            $resultMatchup = mysql_query($sql);
            $idUser = mysql_insert_id();
        }
    } else {
        $result1 = mysql_query("SELECT * FROM Users WHERE facebookId=$userFacebookId");
        if (mysql_num_rows($result1) > 0) {
            $row = mysql_fetch_array($result1);
            $idUser = $row["Id"];
       //    $resultMatchup = mysql_query("UPDATE `Users` SET playerToInvite = '0' WHERE facebookId=$userFacebookId");
            
           $resultMatchup = mysql_query("UPDATE `Users` SET Email='$email', FirstName='$userFirstName', LastName='$userLastName', playerToInvite='0' WHERE facebookId=$userFacebookId");

            //mysql_fetch_array($resultMatchup);
        } else {
            $sql = "INSERT INTO `Users` (`Email`, `FirstName`, `LastName`, `Level`, `Score`, `facebookId`, `imgURL`, `gender`, `birthday`, `playerToinvite`) "
                    . "VALUES ('$email', '$userFirstName', '$userLastName', '0', '0', '$userFacebookId', '$imgUrl', '$userGender', '$userBirthday', '0')";
            $resultMatchup = mysql_query($sql);
            $idUser = mysql_insert_id();
        }
    }


//// check if row inserted or not
    if ($resultMatchup) {
        $response["success"] = 1;
        $row = mysql_fetch_array($resultMatchup);
        $response["userId"] = $idUser;
        echo json_encode($response);
    } else {
//error
        $response["success"] = 0;
        $response["message"] = "Error in matchup!";

// echo no users JSON
        echo json_encode($response);
    }
} else {
//error
    $response["success"] = 0;
    $response["message"] = "Error in matchup...";

//    echo no users JSON;
    echo json_encode($response);
}
?>