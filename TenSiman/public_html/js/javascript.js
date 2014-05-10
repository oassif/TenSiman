/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var NUMBER_SECTIONS = 5;
var currentPlayerId = 0;
var timePerRound = 10;
var delayBetweenQuestions = 1250; // in milliseconds

var currVideoId = 0;
var correctAnswerId;
var order;
var videoArray;
var videoCount = NUMBER_SECTIONS;
var answerArray = [6];
var startIndex;
var gameDetails = new Array();
var isDemo = true;
var count;
var counter;
var score = 0;
var buffer = 20; //scroll bar buffer
var m_isCanClick; // Used to prevent user from clicking multiple times on the answer (couldn't disabled the buttons for some reason)

var allreadyPlayed = false;
var currentGameId = -1;
var turn = 0;
var player1or2 = 0;
function pageY(elem) {
    return elem.offsetParent ? (elem.offsetTop + pageY(elem.offsetParent)) : elem.offsetTop;
}

/*function resizeIframe() {
 var height = document.documentElement.clientHeight * 0.65;
 height -= pageY(document.getElementById('myVideo')) + buffer;
 height = (height < 0) ? 0 : height;
 document.getElementById('myVideo').style.height = height + 'px';
 }
 function resizeWidthIframe() {
 var width = document.documentElement.clientWidth;
 width -= pageY(document.getElementById('myVideo')) + buffer;
 width = (width < 0) ? 0 : width;
 document.getElementById('myVideo').style.width = width + 'px';
 }*/

$(document).ready(function()
{


    myVideo.addEventListener("playing", function() {
        document.getElementById("timer").style.display = "block";
        if (!allreadyPlayed) {
            count = 10;
            allreadyPlayed = true;
        } 
    }, false);

    try {
        if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined'))
            //alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
            if (typeof CDV == 'undefined')
                //alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
                if (typeof FB == 'undefined')
                    //alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

                    FB.Event.subscribe('auth.login', function(response) {
                        //alert('auth.login event');
                    });
    }
    catch (err) {

    }

//    FB.init({appId: "609521172430311", nativeInterface: CDV.FB, useCachedDialogs: false});
//    document.getElementById('data').innerHTML = "";
    try {
        FB.Event.subscribe('auth.logout', function(response) {
            //alert('auth.logout event');
        });
    }
    catch (err) {

    }

    try {
        FB.Event.subscribe('auth.sessionChange', function(response) {
            //alert('auth.sessionChange event');
        });
    }
    catch (err) {

    }

    try {
        FB.Event.subscribe('auth.statusChange', function(response) {
            //alert('auth.statusChange event');
        });
    }
    catch (err) {

    }


    getLoginStatus();
    //   refreshMatchups();
//    videoSource[0] = 'movies/new.gif';
//    videoSource[1] = 'movies/after.gif';
//    videoSource[2] = 'movies/long.gif';
//    videoSource[3]= 'movies/middle.gif';
//    videoSource[4]= 'movies/last.gif';

    /*    answerArray[0] = ["חדש", "חתך", "אמצע", "חצה"];
     answerArray[1] = ["אחרי", "מחר", "אחרון", "אמצע"];
     answerArray[2] = ["ארוך", "חדש", "למתוח", "אחרי"];
     answerArray[3] = ["אמצע", "חדש", "אחרי", "חתך"];
     answerArray[4] = ["אחרון", "לפני", "אחרי", "לחתוך"];
     */
    // Generate Random number
    videoCount = NUMBER_SECTIONS;
    /*
     for (var index = 0; index < videoCount; ++index) {
     // video source, right answer, user's answer, time, points
     gameDetails[index] = [index, answerArray[index][0], false, 0, 0];
     }
     */
    //videoPlay(0);
    //  document.getElementById("myVideo").setAttribute("src", videoSource[0]);
    //document.getElementById('myVideo').addEventListener('ended', myHandler, false);

});
function refreshMatchups() {
    var htmlCode = "";
    setTimeout(function() {
        ref();
    }, 2000);
    setInterval(checkRefresh, 10000);
    $("#matchups_tableNew").html("");
    document.getElementById("friends_bar").style.display = "none";
}

function ref() {
    $.ajax({
        url: 'http://stavoren.milab.idc.ac.il/public_html/php/getMatchupPageContent_New_DB.php',
        method: 'POST',
        data: {
            userId: currentPlayerId // TODO: change Hardcoded value for the user Oren Assif
        },
        success: function(data) {
            var jason = JSON.parse(data);
            if (jason.success == 1) {
                buildPlayerBar(jason.user);
                buildMatchesTable(jason.matches);
            }
        },
        error: function() {


        }
    });
}

function buildPlayerBar(userData) {
    var barDiv = document.getElementById("playerBar");
    //barDiv.innerHTML = "<table width=\"100%\"><tr>" +
    barDiv.innerHTML = "<table width=\"100\"><tr>" +
            "<td><img src=\"" + userData["imgURL"] + "\" />&nbsp" + userData["fullName"] + "</td>" +
            "<td>רמה " + userData["level"] + "</td>" +
            "<td>נקודות: " + userData["score"] + "</td>" +
            "<td></td>" +
            "</tr></table>";


    document.getElementById("score").innerHTML = userData["score"];
    document.getElementById("level").innerHTML = "120";
    // document.getElementById("nextLevel").innerHTML = userData["level"];

}

function buildMatchesTable(matchesData) {
// Clean the table

    var table = document.getElementById("matchups_tableNew");
    table.innerHTML = "";
    $("#matchups_tableNew").html("");
    $("#matchups_tableNew").addClass("matches");
    var numOfMatchups = matchesData.length;
    var index;
    //table.innerHTML = "";
    for (index = 0; index < numOfMatchups; ++index) {

        var text = ""; // This
        var buttonClass = "";
        var textValue = "";
        var buttonProperty = "";
        var playerTurn = 2;
        // Todo: see if it's the first player or sceond player and according to it decide.
        // Decide button
        if (matchesData[index]["gameStatus"] === "0") {
            text = "תן סימן";
            buttonClass = "newGame";
            buttonProperty = "onClick=\"createNewGame(" + matchesData[index]["matchupId"] + ")\"";
        }
        else if (matchesData[index]["gameStatus"] === "1") {
            text = "תורך";
            buttonClass = "yourTurn";
            //alert("your turn:" + matchesData[index]["LiveGameId"]);
            buttonProperty = "onClick=\"playTurn(" + matchesData[index]["LiveGameId"] + ")\"";
            playerTurn = 1;
        }
        else if (matchesData[index]["gameStatus"] === "2") {
            text = "המתן";
            buttonClass = "waitForRival";
            buttonProperty = "disabled";
            playerTurn = 1;
        }
        else if (matchesData[index]["gameStatus"] === "3") {
            text = "הזמנה ממומחה";
            buttonClass = "expertChallange";
            buttonProperty = "onClick=\"playTurn(" + matchesData[index]["LiveGameID"] + ")\"";
        }
        else {
// default status
            text = "תן סימן " + matchesData[index]["gameStatus"];
            buttonProperty = "onClick=\"createNewGame(" + matchesData[index]["matchupId"] + ")\"";
        }

        $("#matchups_tableNew").append("<tr align=\"center\">" +
                "<td class=\"matchButton\"><button " + buttonProperty + " class=\"" + buttonClass + "\">" + text + "</button></td>" +
                "<td class=\"matchScore\">" + matchesData[index]["userScore"] + "</td>" +
                "<td class=\"summary\"><button onClick=\"showGameSummary(" + matchesData[index]["LiveGameId"] + "," + playerTurn + ")\" class=\"summary\">i</td><td>" +
                "<td class=\"matchScore\">" + matchesData[index]["rivalScore"] + "</td>" +
                /*"<td class=\"matchInner\">" +
                 "<table class=\"matchInnerTable\">" +
                 
                 "</table>" +
                 "</td>" +*/
                "<td class=\"matchRival\">" +
                "<div class=\"rivalPic\"><img src=\"" + matchesData[index]["rivalImg"] + "\" class=\"profile\"/>" +
                //"<div class=\"rivalRank\"><img src=\"css/Profressbarstar.png\" width=\"100%\" class=\"imgStar\"/>" + matchesData[index]["rivalLevel"] + 
                "<div class=\"rivalRank\">" + matchesData[index]["rivalLevel"] +
                "<div class=\"rivalName\">" + matchesData[index]["rivalFirstName"] + "</div>" +
                "</div>" +
                "</div>" +
                //"<br />" + matchesData[index]["rivalName"] +
                "</td></tr>");
    }
}

function timer() {
    if (window.location.toString().match("\#game$"))
    {
        if (count <= 0) {
            continueToNextQuestion(null);
            return;
        }
        count = count - 1;
        document.getElementById("timer").innerHTML = count + " secs";
    }
}

function createNewLiveGame(matchUpId)
{
    // TODO: for a new game send liveGameId = 0, else send the live game Id;
    // * might need to chek in the server that the game id related to the user and that it's his turn
    $.ajax({
        url: 'http://stavoren.milab.idc.ac.il/php/getLiveGameData.php',
        method: 'POST',
        data: {
            liveGameId: 0,
            matchUpId: matchUpId // currently hard coded, but should be decided be the 2 players playing
        },
        success: function(data) {
            var jason = JSON.parse(data);
            if (jason.success == 1) {
            }
        },
        error: function() {
            //alert("error");
        }
    });
    // TODO: set the video's array and other values once we'll have them

    // TODO: might need to change something here:
    document.getElementById("answers").style.display = "none";
    window.location = "#game";
    /*    resizeIframe();
     resizeWidthIframe();*/
    setTimeout(function() {
        videoPlay(0);
    }, 100);
}

function startGame()
{
    // Setting video element to "" so the video won't jump when clicking "start game" while demo is running
    document.getElementById("myVideo").setAttribute("src", "");
    score = 0;
    currVideoId = 0;
//    isDemo = true;
    document.getElementById("play").style.display = "none";
    document.getElementById("translatedWord").style.display = "block";
    document.getElementById("answers").style.display = "none";
    window.location = "#game";
    /*    resizeIframe();
     resizeWidthIframe();*/
//    setTimeout(function() {
//        videoPlay(0);
//    }, 100);
//    

    startPlay();
}


/**
 function videoPlay(videoNum)
 {
 
 // Checks if need to show the translation
 if (isDemo) {
 document.getElementById("title").innerHTML = "נסו לזכור את המילים הבאות";
 document.getElementById("myVideo").setAttribute("src", videoArray[videoNum]["moviePath"]);
 document.getElementById("myVideo").style.display = "block";
 // Showing the translation
 document.getElementById("translatedWord").style.display = "block";
 document.getElementById("translatedWord").innerHTML = "<H1>" + answerArray[videoNum][0] + "</H1>";
 // Hiding the options
 document.getElementById("answers").style.display = "none";
 if (videoNum < 4) {
 videoNum++;
 setTimeout(function() {
 document.getElementById("myVideo").setAttribute("src", "");
 videoPlay(videoNum);
 }, 2300);
 } else {
 
 setTimeout(function() {
 document.getElementById("translatedWord").style.display = "none";
 document.getElementById("myVideo").style.display = "none";
 document.getElementById("repeat").style.display = "block";
 }, 2200);
 }
 }
 
 else {
 document.getElementById("myVideo").setAttribute("src", "");
 document.getElementById("myVideo").style.display = "block";
 document.getElementById("myVideo").setAttribute("src", videoArray[videoNum]["moviePath"]);
 document.getElementById("title").innerHTML = "בחרו את התשובה הנכונה";
 show4possibleAnswers(videoNum);
 }
 }
 */
function show4possibleAnswers(videoNum) {
// Not Showing the translation
//document.getElementById("translation").innerHTML = "<H1>&nbsp</H1>";
    document.getElementById("translatedWord").innerHTML = "<H1>&nbsp</H1>";
    document.getElementById("translatedWord").style.display = "none";
    resetButtons();
    // Showing the answers
    // First, generates Random number for the first answer
    var firstAnswerId = Math.floor((Math.random() * 4));
    document.getElementById("answer1").innerHTML = "<font size=\"5\">" +
            answerArray[videoNum][firstAnswerId] +
            "</font>";
    document.getElementById("answer2").innerHTML = "<font size=\"5\">" +
            answerArray[videoNum][(firstAnswerId + 1) % 4] +
            "</font>";
    document.getElementById("answer3").innerHTML = "<font size=\"5\">" +
            answerArray[videoNum][(firstAnswerId + 2) % 4] +
            "</font>";
    document.getElementById("answer4").innerHTML = "<font size=\"5\">" +
            answerArray[videoNum][(firstAnswerId + 3) % 4] +
            "</font>";
    m_isCanClick = true;
    if (firstAnswerId === 0) {
        correctAnswerId = "answer1";
    }
    else {
        correctAnswerId = "answer" + (5 - firstAnswerId);
    }

// Show answers
    document.getElementById("answers").style.display = "block";
}


function myHandler() {

//alert("im called");
    if (isDemo) {
        ++currVideoId;
        if (currVideoId === videoCount) {
            currVideoId = 0;
            document.getElementById("translatedWord").style.display = "none";
            document.getElementById("repeat").style.display = "block";
            document.getElementById("play").style.display = "block";
        }
        else {
            videoPlay(currVideoId);
        }
    }

//    }
}

// start to show videos + answers. 
function startPlay() {

    document.getElementById("timer").style.display = "none";
    isDemo = false;
    currVideoId = 0;
    // Hiding buttons
    document.getElementById("repeat").style.display = "none";
    document.getElementById("play").style.display = "none";
// call for the first video
    order = generateOrder();
    setTimeout(function() {
        count = timePerRound;
        counter = setInterval(timer, 1000); //1000 will run it every 1 second 
        videoPlay(order[currVideoId]);
    }, 1000);
}

// randomly decide the order of the videos.
function generateOrder(numberOfVideos) {
    var videosOrder = [1, 0, 2, 4, 3];
    // Math.floor((Math.random()*videoCount)+1); 
    return videosOrder;
}

// on click of the answers
/* Last updated 02/04/2014
 *  Changed to integrate with updateUserAnswer after each section
 *
 */
function onClick_checkAnswer(object) {

// TODO: disable all buttons and enabling them only when creating the new buttons for the next answer
//    gameDetails[order[currVideoId]][3] = count;
// Saving user's answer
    //count = 10;
    document.getElementById("timer").style.display = "none";

    if (m_isCanClick)
    {
        m_isCanClick = false;
        gameDetails[order[currVideoId]][3] = object.text.toString();
        console.trace(object.text.toString() + " <- user  answer ttttttttt right answer ->" + answerArray[order[currVideoId]][0])

        if (object.text.toString() === answerArray[order[currVideoId]][0])//answerArray[currVideoId][0])
        {
            gameDetails[order[currVideoId]][2] = true;
            //Update score
            gameDetails[order[currVideoId]][4] = count;
        }
        else {
            document.getElementById(object.id).style.background = "red";
            console.trace("wrong");
            // Update score
            gameDetails[order[currVideoId]][4] = 0;
        }
        console.trace("UpdateUserAnswer");
        $.ajax({
            url: 'http://stavoren.milab.idc.ac.il/public_html/php/updateUserAnswer.php',
            method: 'POST',
            data: {
                section: gameDetails[order[currVideoId]],
                player: player1or2
            },
            success: function(data) {
                var jason = JSON.parse(data);
                if (jason.success == 1) {
                    console.trace("seuccess!" + gameDetails[order[currVideoId]] + " " + player1or2);
                }
            },
            error: function() {
                console.trace("error");
            }
        });
        score += gameDetails[order[currVideoId]][4];
        continueToNextQuestion(object);
    }
}



function continueToNextQuestion(object) {

    count = 10;
    document.getElementById("timer").style.display = "none";

    document.getElementById(correctAnswerId).style.background = "#B5EAAA"; //"green";
    document.getElementById(correctAnswerId).style.background = "gray"; //"green";
    document.getElementById(correctAnswerId).style.background = "#B5EAAA"; //"green";
    document.getElementById(correctAnswerId).style.background = "gray"; //"green";
    document.getElementById(correctAnswerId).style.background = "#B5EAAA"; //"green";

    console.log(score);
    // continte to the next question.
    ++currVideoId;
    if (currVideoId === videoCount) {
// If all the questions were showed, end game
        clearInterval(counter);
        endGame();
    }
    else {
// Awaits half a second before showing the next question
        setTimeout(function() {
            if (object !== null) {
                document.getElementById(object.id).style.background = "";
            }
            document.getElementById(correctAnswerId).style.background = "";
            count = timePerRound;
            videoPlay(order[currVideoId]);
        }, delayBetweenQuestions);
    }
}

/***
 * Ending the user's turn, after he played is turn in the game.
 
 * @returns {undefined} */
function endGame() {
    if (window.location.toString().match("\#game$")) {
        console.trace("Game Ended");
        $.ajax({
            //url: 'http://stavoren.milab.idc.ac.il/public_html/php/updateStatus.php',
            url: 'http://stavoren.milab.idc.ac.il/public_html/php/endTurn.php',
            method: 'POST',
            data: {
                gameId: currentGameId,
                player: player1or2, //$("#name").val(),
                turn: turn,
                score: score,
                playerId: currentPlayerId
            },
            success: function(data) {
                var jason = JSON.parse(data);
                if (jason.success == 1) {
                }
            },
            error: function() {
                //alert("error");
            }
        });
        $("#text").val("");
        for (var index = 0; index < videoCount; ++index) {
            console.log("User answered on " + gameDetails[index][0] + " " + gameDetails[index][2] + " answer. Time:" + gameDetails[index][3] + " score: " + gameDetails[index][4]);
        }

        document.getElementById("timer").style.display = "none";
        document.getElementById("myVideo").style.display = "none";
        document.getElementById("answer1").style.display = "none";
        document.getElementById("answer2").style.display = "none";
        document.getElementById("answer3").style.display = "none";
        document.getElementById("answer4").style.display = "none";
        document.getElementById("translatedWord").style.display = "block";
        score *= 10;
        document.getElementById("translatedWord").innerHTML = "<H1>" + score + "              :" + "ניקוד</H1>";

        showGameSummary(currentGameId, turn);
    }
}

/**
 * Reset the 4 button of possible answers and the timer.
 */
function resetButtons() {

    //document.getElementById("timer").style.display = "block";
    document.getElementById("answer1").style.display = "block";
    document.getElementById("answer2").style.display = "block";
    document.getElementById("answer3").style.display = "block";
    document.getElementById("answer4").style.display = "block";
    document.getElementById("answer1").style.background = "";
    document.getElementById("answer2").style.background = "";
    document.getElementById("answer3").style.background = "";
    document.getElementById("answer4").style.background = "";
}
/**
 * Build the Friends List.
 * @param {type} toInvite
 * @returns {undefined}
 */
function refreshFriendsZone(toInvite) {
    var htmlCode = "";
    window.location = "#friends";
    //alert("player" + currentPlayerId);

    FB.api('/me/friends', {fields: 'id, name, picture'}, function(response) {
        if (response.error) {

        } else {
            var data = document.getElementById('data');
            fdata = response.data;
            friends = response.data;
            var friendIDs = [];
            for (var k = 0; k < friends.length; k++) {
                var friend = friends[k];
                friendIDs[k] = friend.id;
            }
        }
        //friendIDs = [659746939, 848234613, 1157420811, 644771584, 12323145, 12323146];
        $.ajax({
            url: 'http://stavoren.milab.idc.ac.il/public_html/php/getFriendsInGame.php',
            method: 'POST',
            data: {
                userId: currentPlayerId,
                facebookFriends: friendIDs
            },
            success: function(data) {
                //alert("connected!")
                var jason = JSON.parse(data);
                if (jason.success === 1) {
                    //alert("ok!");
                    if (toInvite) {
                        buildFriendsTable(jason.toInvite, toInvite);
                    } else {
                        buildFriendsTable(jason.matches, toInvite);
                    }
                }
            },
            error: function() {
                //alert("error in login");
            }
        });
    });
    document.getElementById("friends_table").innerHTML = "";
}



function buildFriendsBar(matchup) {
    document.getElementById("matchups_table").style.display = "none";
    document.getElementById("friends_bar").innerHTML = "";
    var table = document.getElementById("friends_bar");
    var play_button = document.createElement("button");
    var invite_button = document.createElement("button");
    var textPlay = document.createTextNode(text = "שחק עם חברים");
    var textInvite = document.createTextNode(text = "הזמן חברים");
    var onclick = document.createAttribute(on)

    play_button.appendChild(textInvite);
    invite_button.appendChild(textPlay);
    play_button.setAttribute("onClick", buildFriendsTable(matchup, false));
    invite_button.onClick = buildFriendsTable(matchup, true);
    var row = document.createElement("tr");
    var button_col = document.createElement("td");
    button_col.appendChild(play_button);
    var button_col2 = document.createElement("td");
    button_col2.appendChild(invite_button);
    row.appendChild(button_col);
    row.appendChild(button_col2);
    table.appendChild(row);
}

function buildFriendsTable(matchesData, toInvite) {

    document.getElementById("friends_bar").style.display = "block";
    document.getElementById("friends_table").innerHTML = "";
    var table = document.getElementById("friends_table");
    var numOfMatchups = matchesData.length;
    var size = numOfMatchups;
    if (size > 20) {
        size = 20;
    }

    var index;
    for (index = 0; index < size; ++index) {
        var text = "";
        var buttonProperty = "";
        // Decide button
        if (toInvite) {
            text = "הזמן";
            buttonProperty = "onClick=\"publishStoryFriend(" + matchesData[index] + ")\"";
        } else {
            text = "שחק";
            buttonProperty = "onClick=\"startGameWithNewPlayer(" + matchesData[index]["rivalId"] + ")\"";
        }

        if (toInvite) {

            var userId = "/" + matchesData[index];
//            id = matchesData[index];
//            name = "stav";

            FB.api(userId, {fields: 'id, name, picture'}, function(response) {
                name = response.name;
                id = response.id;
                picture = response.picture;

                $("#friends_table").append("<tr align=\"center\">" +
                        "<td><button " + buttonProperty + " >" + text + "</button></td>" +
                        "<td><img class=\"profile\" src=\"" + "https://graph.facebook.com/" + id + "/picture/" + "\" />" +
                        "<div class=\"friendName\">" + name + "</div></td></tr>");
            });

        } else {
            $("#friends_table").append("<tr align=\"center\">" +
                    "<td><button " + buttonProperty + " >" + text + "</button></td>" +
                    "<td><img class=\"profile\" src=\"" + matchesData[index]["rivalImg"] + "\" />" +
                    "<br /><div class=\"friendName\">" + matchesData[index]["rivalName"] + "</div></td></tr>");
        }
    }
}


/**
 * Create new MatchUp between 2 users who never played before.
 * Sets the currentGameId to NULL.
 * Calls to createNewGame(matchId) - which create the current live game id.
 * This function is called after clicking on "שחק" in "צור משחק חדש".
 * @param {type} rivalId
 * @returns {undefined}
 */
function startGameWithNewPlayer(rivalId) {

    //alert("player" + currentPlayerId);
    //alert("startGameWithNewPlayer");
    $.ajax({
        url: 'http://stavoren.milab.idc.ac.il/public_html/php/sendNewMatchup.php',
        method: 'POST',
        data: {
            myUserId: currentPlayerId,
            playerUserId: rivalId //$("#name").val(),
        },
        success: function(data) {
            var jason = JSON.parse(data);
            if (jason.success === 1) {
                var matchId = jason.data;
                //alert("MatchId: " + matchId);
                createNewGame(matchId);
            }
        },
        error: function() {
            //alert("error in match");
        }
    });
}

/**
 * Create a new live Game.
 * Choose 5 videos, Create 5 sections, Create new live Game that holds the 
 * 5 sections. 
 * 
 * return the matchId and a section array containing the videos and possible answers. 
 * @param {type} matchId
 * @returns {undefined}
 */
function createNewGame(matchId) {
    //alert("TESSSST");
    // alert("createNewGame" + matchId);
    $.ajax({
        url: 'http://stavoren.milab.idc.ac.il/public_html/php/createNewGame.php',
        method: 'POST',
        data: {
            matchId: matchId,
            currentPlayerId: currentPlayerId
        },
        success: function(data) {
            var jason = JSON.parse(data);
            if (jason.success === 1) {
                //alert("succes");
                currentGameId = jason.currentGame;
                player1or2 = jason.player;
                turn = jason.turn;
                videoArray = jason.sections;
                //console.trace(videoArray[0]);
                //console.trace(turn + " <- turn ..... player ->" + player1or2)

                createGameDetails();
                startGame();
            } else {
                //alert("fail");
            }

        },
        error: function() {
            //alert("error in match");
        }
    });
}

/***
 * Added by Oren 26/4/2014
 * Modification:
 * None
 * 
 * Info:
 * Uses the data that comes from createNewGame.php to create the GameDetails array
 * @returns {undefined}
 */
function createGameDetails() {

    //alert("test1");
    // building an array of answers. The right answer is ALWAYS in index 0
    for (var index = 0; index < videoCount; ++index) {
        //alert("test2");
        var wrongOptions = videoArray[index]["wrongOptions"].split(":");
        /*answerArray[index][0] = videoArray[index]["rightAnswer"];
         answerArray[index][1] = wrongOptions[0];
         answerArray[index][2] = wrongOptions[1];
         answerArray[index][3] = wrongOptions[2];*/
        answerArray[index] = [videoArray[index]["rightAnswer"], wrongOptions[0], wrongOptions[1], wrongOptions[2]];
        //alert(answerArray[index][0]);
    }

    for (var index = 0; index < videoCount; ++index) {
        //alert("test3");
//        // video source, right answer, user's answer, time, points
//        gameDetails[index] = [index, answerArray[index][0], false, 0, 0];

        // sectiodId, right answer, answered right? , user's Answer, score
        gameDetails[index] = [videoArray[index]["sectionId"], answerArray[index][0], false, "", 0];
    }
}

function playTurn(game_id) {

    //alert("gameid " + game_id);
    $.ajax({
        url: 'http://stavoren.milab.idc.ac.il/public_html/php/playTurn.php',
        method: 'POST',
        data: {
            gameId: game_id,
            currentPlayerId: currentPlayerId
        },
        success: function(data) {
            var jason = JSON.parse(data);
            if (jason.success === 1) {
                //alert("ok");
                currentGameId = game_id;
                player1or2 = jason.player;
                turn = jason.turn;
                videoArray = jason.sections;
                //console.trace(videoArray[0]);
                //console.trace(turn + " <- turn ..... player ->" + player1or2)
                createGameDetails();
                startGame();
            }
        },
        error: function() {
            //alert("error in match");
        }
    });
}


/**
 * Insert new user to the User's table and set the current player id to be 
 * @param {type} firstName
 * @param {type} LastName
 * @param {type} facebookId
 * @param {type} imgUrl
 * @param {type} email
 * @returns {undefined}
 */
function signUp(email, firstName, LastName, facebookId, imgUrl) {
    var gender = "F";
    var birthDay = "29.9.1989";
    $.ajax({
        url: 'http://stavoren.milab.idc.ac.il/public_html/php/signUp.php',
        method: 'POST',
        data: {
            email: email,
            userFirstName: firstName,
            userLastName: LastName,
            userFacebookId: facebookId,
            imgUrl: imgUrl,
            userGender: gender,
            userBirthday: birthDay
        },
        success: function(data) {
            var jason = JSON.parse(data);
            if (jason.success === 1) {
                //alert("ok");
                currentPlayerId = jason.userId;
                window.location = "#matchups";
                refreshMatchups();
            }
        },
        error: function() {
            //alert("error in match");
        }
    });
}

function getLoginStatus() {
    console.trace("Attempting to connect via facebook login");
    try {
        FB.getLoginStatus(function(response) {
            if (response.status == 'connected') {
                fbId = response.authResponse.userId;
                $.ajax({
                    url: 'http://stavoren.milab.idc.ac.il/public_html/php/getUserId.php',
                    method: 'POST',
                    data: {
                        facebookId: fbId,
                    },
                    success: function(data) {
                        //alert("connected!")
                        var jason = JSON.parse(data);
                        if (jason.success === 1) {
                            currentPlayerId = jason.userId;
                            window.location = "#matchups";
                            refreshMatchups();
                            //alert(currentPlayerId);
                        }
                    },
                    error: function() {
                        alert("error in login");
                    }
                });
            } else {
                login();
            }
        }
        , {scope: 'basic_info, email, public_profile, user_about_me, user_birthday, user_friends'}

        );
    }
    catch (err) {
        console.trace("Couldn't use facebook login, calling loginFromWeb and loading hardcoded value");
        loginFromWeb();
    }
}

var friendIDs = [];
var fdata;
function me() {
    FB.api('/me/friends', {fields: 'id, name, picture'}, function(response) {
        if (response.error) {
            //alert(JSON.stringify(response.error));
        } else {
            var data = document.getElementById('data');
            fdata = response.data;
            console.log("fdata: " + fdata);
            response.data.forEach(function(item) {
                var d = document.createElement('div');
                d.innerHTML = "<img src=" + item.picture + "/>" + item.name;
                data.appendChild(d);
            });
        }
        var friends = response.data;
        console.log(friends.length);
        for (var k = 0; k < friends.length && k < 200; k++) {
            var friend = friends[k];
            var index = 1;
            friendIDs[k] = friend.id;
            //friendsInfo[k] = friend;
        }
        console.log("friendId's: " + friendIDs);
    });
}

function logout() {
    FB.logout(function(response) {
        //alert('logged out');
    });
}

function login() {
    FB.login(
            function(response) {
                if (response.session) {
                    //alert('logged in!!!');
                }

                if (response.authResponse) {
                    fbId = response.authResponse.userId;
                    //alert("user id is " + fbId);

                    $.ajax({
                        url: 'http://stavoren.milab.idc.ac.il/public_html/php/getUserId.php',
                        method: 'POST',
                        data: {
                            facebookId: fbId
                        },
                        success: function(data) {
                            var jason = JSON.parse(data);
                            if (jason.success === 1) {
                                currentPlayerId = jason.userId;
                                // New user should signUp first:
                                if (currentPlayerId == -1) {
                                    FB.api('/me', function(response) {
                                        //alert("Name: " + response.last_name + "email: " + response.email + "\nFirst name: " + response.first_name + "ID: " + response.id);
                                        var img_link = "http://graph.facebook.com/" + response.id + "/picture";
                                        signUp(response.email, response.first_name, response.last_name, response.id, img_link);
                                    });
                                }

                                window.location = "#matchups";
                                refreshMatchups();
                            }
                        },
                        error: function() {
                            // alert("error in login");
                        }
                    });
                } else {
                    //alert('not logged in');
                }
            },
            {scope: 'basic_info, email, public_profile, user_about_me, user_birthday, user_friends'}
    );
}


function facebookWallPost() {
    var params = {
        method: 'feed',
        name: 'Facebook Dialogs',
        link: 'https://developers.facebook.com/docs/reference/dialogs/',
        picture: 'http://fbrell.com/f8.jpg',
        caption: 'Reference Documentation',
        description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
    };
    console.log(params);
    FB.ui(params, function(obj) {
        //   console.log(obj);
    });
}

function publishStoryFriend(friendID) {
    if (friendID == undefined) {
        //alert('please click the me button to get a list of friends first');
    } else {
        console.log("friend id: " + friendID);
        console.log('Opening a dialog for friendID: ', friendID);
        var params = {
            method: 'feed',
            to: friendID.toString(),
            name: 'Ten Siman',
            link: 'https://www.facebook.com/tensiman',
            picture: 'images/logo.jpg',
            caption: 'TEN SIMAN',
            description: 'I invite you to play with me and learn sign languege'
        };
        FB.ui(params, function(obj) {
            console.log(obj);
        });
    }
}

document.addEventListener('deviceready', function() {
    try {
        //alert('Device is ready! Make sure you set your app_id below this //alert.');
        FB.init({appId: "609521172430311", nativeInterface: CDV.FB, useCachedDialogs: false});
        document.getElementById('data').innerHTML = "";
        getLoginStatus();
    } catch (e) {
        // alert(e);
    }
}, false);

function loginFromWeb() {
    currentPlayerId = 1;
    window.location = "#matchups";
    refreshMatchups();
}

/**
 * At the end of each turn - present a game summary.
 
 * @returns {undefined} */
function getSummary(gameId, turn) {
    $.ajax({
        url: 'http://stavoren.milab.idc.ac.il/public_html/php/getGameDetails.php',
        method: 'POST',
        data: {
            gameId: gameId
        },
        success: function(data) {
            //alert("connected!")
            var jason = JSON.parse(data);
            if (jason.success === 1) {
                buildSummaryTable(jason, turn);
            }
        },
        error: function() {
        }
    });
}


function buildSummaryTable(matchesData, turn) {

//    var table = document.getElementById("summary_table");
//    table.innerHTML = "";
    $("#summary_table").html("");
    $("#summary_bar_table").html("");

    var numOfWords = 5;
    var index;

    var player1array = matchesData["player1"];
    var player2array = matchesData["player2"];
    var sections = matchesData["sections"];


    var player2score = player2array[0]["score"];
    if (turn == 1) {
        player2score = "?";
    }

    $("#summary_bar_table").append("<tr align=\"center\">" +
            "<td class=\"playerPic\"><img class=\"pic \" src=\"" + player2array[0]["pic"] + "\">" +
            "<div class=\"playerName\">" + player2array[0]["name"] + "</div></td>" +
            "<td class=\"scoreP1\">" + player2score + "</td>" +
            "<td class=\"scoreP1\">" + ":" + "</td>" +
            "<td class=\"scoreP1\">" + player1array[0]["score"] + "</td>" +
            "<td class=\"playerPic\"><img class=\"pic \"  src=\"" + player1array[0]["pic"] + "\">" +
            "<div class=\"playerName\">" + player1array[0]["name"] + "</div></td>" +
            "</tr>"
            );

    for (index = 0; index < numOfWords; ++index) {

        if (turn != 1) {
            player2score = sections[index]["scoreP2"];
        }

        $("#summary_table").append("<tr align=\"center\">" +
                "<td class=\"scoreP1\">" + player2score + "<div class=sec> שניות</div></td>" +
                "<td class=\"word\">" + sections[index]["word"] + "</td>" +
                "<td class=\"scoreP1\">" + sections[index]["scoreP1"] + "<div class=sec> שניות</div></td>" +
                "</tr>");
    }
}

function showGameSummary(gameId, turn) {
    window.location = "#summary";
    getSummary(gameId, turn);
}

function checkRefresh()
{
    // Checking that we are in the matchups page, else there is not point to call the refresh php
    if (window.location.toString().match("\#matchups$"))
    {
        ref();
    }
}


function videoPlay(videoNum)
{
    allreadyPlayed = false;
    document.getElementById("timer").style.display = "none";
    document.getElementById("myVideo").style.display = "block";
    document.getElementById("myVideo").setAttribute("src", "http://stavoren.milab.idc.ac.il/public_html/" + videoArray[videoNum]["moviePath"]);
    document.getElementById("title").innerHTML = "בחרו את התשובה הנכונה";
    show4possibleAnswers(videoNum);

}

function playVideo() {
    document.getElementById("myVideo").play();
}

function onClick_moreFriends() {

}