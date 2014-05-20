/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var k_MaxScore = 50;
var NUMBER_SECTIONS = 5;
var currentPlayerId = 0;
var timePerRound = 10;
var delayBetweenQuestions = 1250; // in milliseconds
var loading = false;
var currVideoId = 0;
var correctAnswerId;
var order;
var videoArray;
var videoCount = NUMBER_SECTIONS;
var answerArray = [6];
var startIndex;
var gameDetails = new Array();
var gameFlowData;
var isDemo = true;
var count;
var counter;
var score = 0;
var g_TempRivalScore = 0;
var buffer = 20; //scroll bar buffer
var m_isCanClick; // Used to prevent user from clicking multiple times on the answer (couldn't disabled the buttons for some reason)

var allreadyPlayed = false;
var currentGameId = -1;
var turn = 0;
var player1or2 = 0;
var matchesData = new Array();
var videoNumber = 0;
var web = 0;
var friendName = new Array();
var isLastDemo = false;

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
        if (!isDemo) {
//            document.getElementById("timer").style.display = "block";
//            if (!allreadyPlayed) {
//                count = 10;
//                counter = setInterval(timer, 1000); //1000 will run it every 1 second 
//                allreadyPlayed = true;
//            }
        }
    }, false);
    myVideo.addEventListener("ended", function() {
        if (isDemo) {
            if (isLastDemo)
            {
                document.getElementById("translatedWord").style.display = "none";
                document.getElementById("myVideo").style.display = "none";
            }
            else
            {
                if ((currentGameId % 2) == 0)
                {
                    videoPlay((currentGameId + 2) % 5);
                }
                else
                {
                    videoPlay((currentGameId - 2) % 5);
                }
                isLastDemo = true;
            }
            /*
            videoPlay(order[2]);
            */
        } else {
            show4possibleAnswers(videoNumber);
            document.getElementById("timer").innerHTML = "<br>10";
            document.getElementById("timer").style.display = "block";
            if (!allreadyPlayed) {
                count = 10;
                counter = setInterval(timer, 1000); //1000 will run it every 1 second 
                allreadyPlayed = true;
            }

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
    // Generate Random number
    videoCount = NUMBER_SECTIONS;
});
function refreshMatchups() {

    window.location = "#matchups";
    document.getElementById('preGame').style.visibility = 'hidden';
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
    document.getElementById("score2").innerHTML = userData["score"];
    var level = parseInt(userData["level"]);
    var score = parseInt(userData["score"]);
    var leftToNextLevel = (level * 100 * 1.5) - score;
    document.getElementById("nextLevel").innerHTML = level + 1;
    document.getElementById("nextLevel2").innerHTML = level + 1;

    document.getElementById("level").innerHTML = "" + "" + leftToNextLevel + " " + "לשלב " + " ";
    document.getElementById("level2").innerHTML = "" + "" + leftToNextLevel + " " + "לשלב " + " ";

    // document.getElementById("nextLevel").innerHTML = userData["level"];

    document.getElementById("MessageFullName").innerHTML = userData["fullName"];
    document.getElementById("MessageProfilePic").innerHTML = "<img class=\"profile\" src=\"" + userData["imgURL"] + "\"/>";
    /* BETTER PICTURE SIZE! 
     * document.getElementById().innerHTML = "<img class=\"profile\" src=\"https://graph.facebook.com/assif/picture?width=200&height=200\"/>";
     */

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
            markTheRightAnswer();
            continueToNextQuestion(null);
            return;
        }
        count = count - 1;
        document.getElementById("timer").innerHTML = "<br>" + count; // + " secs";
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
    document.getElementById("GameAnswers").style.display = "none";
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
    g_TempRivalScore = 0;
    document.getElementById("left_score_indicator").style.height = "0%";
    document.getElementById("right_score_indicator").style.height = "0%";
    currVideoId = 0;
//    isDemo = true;
    document.getElementById("play").style.display = "none";
    document.getElementById("translatedWord").style.display = "block";
    document.getElementById("GameAnswers").style.display = "none";
    $.ajax({
        url: 'http://stavoren.milab.idc.ac.il/public_html/php/getGameDetails.php',
        method: 'POST',
        data: {
            gameId: currentGameId
        },
        success: function(data) {
            //alert("connected!")
            var jason = JSON.parse(data);
            if (jason.success === 1) {
                //buildSummaryTable(jason, turn);
                gameFlowData = jason;
                if (gameFlowData.initiatorId == currentPlayerId) {
                    document.getElementById("Game_LeftName").innerHTML = gameFlowData.player1[0]["name"];
                    document.getElementById("Game_RightName").innerHTML = gameFlowData.player2[0]["name"];
                    document.getElementById("Game_LeftPic").setAttribute("src", gameFlowData.player1[0]["pic"]);
                    document.getElementById("Game_RightPic").setAttribute("src", gameFlowData.player2[0]["pic"]);
                    document.getElementById("Game_LeftScore").innerHTML = '0';
                    document.getElementById("Game_RightScore").innerHTML = '?';
                    // TODO: add bool value false (don't need to update the rival score
                }
                else {
                    document.getElementById("Game_LeftName").innerHTML = gameFlowData.player2[0]["name"];
                    document.getElementById("Game_RightName").innerHTML = gameFlowData.player1[0]["name"];
                    document.getElementById("Game_LeftPic").setAttribute("src", gameFlowData.player2[0]["pic"]);
                    document.getElementById("Game_RightPic").setAttribute("src", gameFlowData.player1[0]["pic"]);
                    document.getElementById("Game_LeftScore").innerHTML = '0';
                    document.getElementById("Game_RightScore").innerHTML = '0';
                    // TODO: add bool value true (need to update the rival score
                }
                //window.location = "#game";
                document.getElementById("preGame").style.visibility = "visible";
            }
        },
        error: function() {
        }
    });
    /*    resizeIframe();
     resizeWidthIframe();*/
//    setTimeout(function() {
//        videoPlay(0);
//    }, 100);
//    

    startPlay(true);
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
    document.getElementById("gameAnswer1").innerHTML = //"<font size=\"5\">" +
            answerArray[videoNum][firstAnswerId]; //+
    //"</font>";
    document.getElementById("gameAnswer2").innerHTML = //"<font size=\"5\">" +
            answerArray[videoNum][(firstAnswerId + 1) % 4]; //+
    //"</font>";
    document.getElementById("gameAnswer3").innerHTML = //"<font size=\"5\">" +
            answerArray[videoNum][(firstAnswerId + 2) % 4]; //+
    //"</font>";
    document.getElementById("gameAnswer4").innerHTML = //"<font size=\"5\">" +
            answerArray[videoNum][(firstAnswerId + 3) % 4]; //+
    //"</font>";
    m_isCanClick = true;
    if (firstAnswerId === 0) {
        correctAnswerId = "gameAnswer1";
    }
    else {
        correctAnswerId = "gameAnswer" + (5 - firstAnswerId);
    }

// Show answers
    document.getElementById("GameAnswers").style.display = "block";
}

function myHandler() {

//alert("im called");
    if (isDemo) {
        ++currVideoId;
        if (currVideoId === videoCount) {
            currVideoId = 0;
            document.getElementById("translatedWord").style.display = "none";
//            document.getElementById("repeat").style.display = "block";
//            document.getElementById("play").style.display = "block";
        }
        else {
            videoPlay(currVideoId);
        }
    }

//    }
}

// start to show videos + answers. 
function startPlay(demo) {

    isDemo = demo;
    document.getElementById("timer").style.display = "none";
    currVideoId = 0;
    if (isDemo)
    {
        currVideoId = currentGameId % 5;
    }
    // Hiding buttons
//    document.getElementById("repeat").style.display = "none";
    document.getElementById("play").style.display = "none";
// call for the first video
    order = generateOrder();
    setTimeout(function() {
        videoPlay(order[currVideoId]);
    }, 1000);
}

// randomly decide the order of the videos.
function generateOrder(numberOfVideos) {
    var videosOrder = [0, 1, 2, 3, 4];
    // Math.floor((Math.random()*videoCount)+1); 
    return videosOrder;
}

// on click of the answers
/* Last updated 02/04/2014
 *  Changed to integrate with updateUserAnswer after each section
 *
 */
function onClick_checkAnswer(object) {
    console.log(object);

    document.getElementById("timer").style.display = "none";
    if (m_isCanClick)
    {
        m_isCanClick = false;
        console.log(object.text.toString());
        console.log("currentVideoId: " + currVideoId);
        console.log("order: " + order[currVideoId]);
        gameDetails[order[currVideoId]][3] = object.text.toString();
        console.trace(object.text.toString() + " <- user  answer ttttttttt right answer ->" + answerArray[order[currVideoId]][0])

        if (object.text.toString() === answerArray[order[currVideoId]][0])//answerArray[currVideoId][0])
        {
            gameDetails[order[currVideoId]][2] = true;
            //Update score
            gameDetails[order[currVideoId]][4] = count;
        }
        else {
//document.getElementById(object.id).style.background = "red";
            document.getElementById(object.id).style.backgroundImage = "url(css/WrongAnswer.png)";
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
        if (gameFlowData.initiatorId == currentPlayerId) {
            document.getElementById("Game_LeftScore").innerHTML = score;
            document.getElementById("left_score_indicator").style.height = (score * 100 / k_MaxScore) + "%";
            // TODO: add bool value false (don't need to update the rival score
        }
        else {
            g_TempRivalScore += +gameFlowData.sections[currVideoId]["scoreP1"];
            document.getElementById("Game_LeftScore").innerHTML = score;
            document.getElementById("left_score_indicator").style.height = (score * 100 / k_MaxScore) + "%";
            document.getElementById("Game_RightScore").innerHTML = g_TempRivalScore; //'0'; // TODO: sum rival score
            document.getElementById("right_score_indicator").style.height = (g_TempRivalScore * 100 / k_MaxScore) + "%";
            // TODO: add bool value true (need to update the rival score
        }

        continueToNextQuestion(object);
    }
}



function continueToNextQuestion(object) {

    document.getElementById("timer").style.display = "none";
    /*document.getElementById(correctAnswerId).style.background = "#B5EAAA"; //"green";
     document.getElementById(correctAnswerId).style.background = "gray"; //"green";
     document.getElementById(correctAnswerId).style.background = "#B5EAAA"; //"green";
     document.getElementById(correctAnswerId).style.background = "gray"; //"green";
     document.getElementById(correctAnswerId).style.background = "#B5EAAA"; //"green";*/
    document.getElementById(correctAnswerId).style.backgroundImage = "url(css/RightAnswer.png)";
    console.log(score);
    // continte to the next question.
    ++currVideoId;
    if (currVideoId === videoCount) {
        // If all the questions were showed, end game
        setTimeout(function() {
            if (object !== null) {
//document.getElementById(object.id).style.background = "";
                document.getElementById(object.id).style.backgroundImage = "url(css/NeutralAnswer.png)";
            }
//document.getElementById(correctAnswerId).style.background = "";
            document.getElementById(correctAnswerId).style.backgroundImage = "url(css/NeutralAnswer.png)";
            clearInterval(counter);
            endGame();
        }, delayBetweenQuestions);
    }
    else {
// Awaits half a second before showing the next question
        setTimeout(function() {
            if (object !== null) {
//document.getElementById(object.id).style.background = "";
                document.getElementById(object.id).style.backgroundImage = "url(css/NeutralAnswer.png)";
            }
//document.getElementById(correctAnswerId).style.background = "";
            document.getElementById(correctAnswerId).style.backgroundImage = "url(css/NeutralAnswer.png)";
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
        document.getElementById("gameAnswer1").style.display = "none";
        document.getElementById("gameAnswer2").style.display = "none";
        document.getElementById("gameAnswer3").style.display = "none";
        document.getElementById("gameAnswer4").style.display = "none";
        document.getElementById("translatedWord").style.display = "block";
        /*score *= 10;
        document.getElementById("translatedWord").innerHTML = "<H1>" + score + "              :" + "ניקוד</H1>";*/
        showGameSummary(currentGameId, turn);
    }
}

/**
 * Reset the 4 button of possible answers and the timer.
 */
function resetButtons() {

//document.getElementById("timer").style.display = "block";
    document.getElementById("gameAnswer1").style.display = "block";
    document.getElementById("gameAnswer2").style.display = "block";
    document.getElementById("gameAnswer3").style.display = "block";
    document.getElementById("gameAnswer4").style.display = "block";
    document.getElementById("gameAnswer1").style.backgroundImage = "url(css/NeutralAnswer.png)";
    document.getElementById("gameAnswer2").style.backgroundImage = "url(css/NeutralAnswer.png)";
    document.getElementById("gameAnswer3").style.backgroundImage = "url(css/NeutralAnswer.png)";
    document.getElementById("gameAnswer4").style.backgroundImage = "url(css/NeutralAnswer.png)";
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

    if (!web) {
        FB.api('/me/friends', {fields: 'id, name, picture'}, function(response) {
            if (response.error) {

            } else {
                var data = document.getElementById('data');
                friends = response.data;
                var friendIDs = [];
                for (var k = 0; k < friends.length; k++) {
                    var friend = friends[k];
                    friendIDs[k] = friend.id;
                    friendName[k] = friend.name;
                }
            }
            $.ajax({
                url: 'http://stavoren.milab.idc.ac.il/public_html/php/getFriendsInGame.php',
                method: 'POST',
                data: {
                    userId: currentPlayerId,
                    facebookFriends: friendIDs,
                    facebookFriendsName: friendName
                },
                success: function(data) {
                    //alert("connected!")
                    var jason = JSON.parse(data);
                    if (jason.success === 1) {
                        //alert("ok!");
                        if (toInvite) {
                            matchesData = jason.toInvite;
                            buildFriendsTable(toInvite, 0);
                        } else {
                            matchesData = jason.matches;
                            buildFriendsTable(toInvite, 0);
                        }
                    }
                },
                error: function() {
                    //alert("error in login");
                }
            });
        });
    } else {
        friendName = ["s", "h", "a", "b", "c", "d", "6f", "g", "f", "fg", "gf", "dd"];
        friendIDs = [659746939, 848234613, 1157420811, 644771584, 644771586, 644771586, 644771586, 644771586, 644771587, 644771584, 12323145, 12323146];
        $.ajax({
            url: 'http://stavoren.milab.idc.ac.il/public_html/php/getFriendsInGame.php',
            method: 'POST',
            data: {
                userId: currentPlayerId,
                facebookFriends: friendIDs,
                facebookFriendsName: friendName

            },
            success: function(data) {
                //alert("connected!")
                var jason = JSON.parse(data);
                if (jason.success === 1) {
                    //alert("ok!");
                    if (toInvite) {
                        matchesData = jason.toInvite;
                        buildFriendsTable(toInvite, 0);
                    } else {
                        matchesData = jason.matches;
                        buildFriendsTable(toInvite, 0);
                    }
                }
            },
            error: function() {
                //alert("error in login");
            }
        });
    }
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
    play_button.setAttribute("onClick", buildFriendsTable(matchup, false, 0));
    invite_button.onClick = buildFriendsTable(matchup, true, 0);
    var row = document.createElement("tr");
    var button_col = document.createElement("td");
    button_col.appendChild(play_button);
    var button_col2 = document.createElement("td");
    button_col2.appendChild(invite_button);
    row.appendChild(button_col);
    row.appendChild(button_col2);
    table.appendChild(row);
}

function buildFriendsTable(toInvite, start) {

    var size = matchesData.length;
    if (start > size) {
        return;
    }

    document.getElementById("moreFriends").innerHTML = "";
    document.getElementById("moreFriends").style.display = "none";
    document.getElementById("friends_bar").style.display = "none";
    document.getElementById("loading").style.display = "block";

    if (start == 0) {
        document.getElementById("friends_table").innerHTML = "";
    }

    var table = document.getElementById("friends_table");
    var numOfMatchups = matchesData.length;
    var size = numOfMatchups;
    var amountOfShow = 20;
    if (size > start + amountOfShow) {
        size = start + amountOfShow;
    }

    var index;
    var nextRow = false;
    for (index = start; index < size; ++index) {
        var text = "";
        var buttonProperty = "";
        // Decide button
        if (toInvite) {
            text = "הזמן";
            buttonProperty = "onClick=\"publishStoryFriend(" + matchesData[index]["id"] + ")\"";
        } else {
            text = "שחק";
            buttonProperty = "onClick=\"startGameWithNewPlayer(" + matchesData[index]["rivalId"] + ")\"";
        }

        if (toInvite) {
            id = matchesData[index]["id"];
            name = matchesData[index]["name"];
            index++;
            if (index < size) {
                id2 = matchesData[index]["id"];
                name2 = matchesData[index]["name"];
                buttonProperty2 = "onClick=\"publishStoryFriend(" + id2 + ")\"";

                $("#friends_table").append("<tr>" +
                        "<td><a " + buttonProperty + "><img class=\"profile\" src=\"" + "https://graph.facebook.com/" + id + "/picture/" + "\" /></a>" +
                        "<div class=\"friendName\">" + name + "</div></td>" +
                        "<td><a " + buttonProperty2 + "><img class=\"profile\" src=\"" + "https://graph.facebook.com/" + id2 + "/picture/" + "\" /></a>" +
                        "<div class=\"friendName\">" + name2 + "</div></td></tr>");

            } else {
                $("#friends_table").append("<tr>" +
                        "<td><a " + buttonProperty + "><img class=\"profile\" src=\"" + "https://graph.facebook.com/" + id + "/picture/" + "\" /></a>" +
                        "<div class=\"friendName\">" + name + "</div></td></tr>");
            }

        } else {
            if ((index + 1) < size) {
                buttonProperty2 = "onClick=\"startGameWithNewPlayer(" + matchesData[index + 1]["rivalId"] + ")\"";
                $("#friends_table").append("<tr align=\"center\">" +
                        "<td><a " + buttonProperty + "><img class=\"profile\" src=\"" + matchesData[index]["rivalImg"] + "\" /></a>" +
                        "<br /><div class=\"friendName\">" + matchesData[index]["rivalName"] + "</div></td>" +
                        "<td><a " + buttonProperty2 + "><img class=\"profile\" src=\"" + matchesData[index + 1]["rivalImg"] + "\" /></a>" +
                        "<br /><div class=\"friendName\">" + matchesData[index + 1]["rivalName"] + "</div></td>" +
                        "</tr>");
                index++;
            } else {
                $("#friends_table").append("<tr align=\"center\">" +
                        "<td><a " + buttonProperty + "><img class=\"profile\" src=\"" + matchesData[index]["rivalImg"] + "\" /></a>" +
                        "<br /><div class=\"friendName\">" + matchesData[index]["rivalName"] + "</div></td>" +
                        "</tr>");
            }
        }
    }

    start = size;
    document.getElementById("moreFriends").style.display = "block";
    if (numOfMatchups > start) {
        buttonProperty = "\onClick=\"buildFriendsTable(" + toInvite + "," + start + ")\"";
        $("#moreFriends").append("<tr align=\"center\">" +
                "<td><button " + buttonProperty + " >עוד חברים</button></td></tr>");
    }

    document.getElementById("loading").style.display = "none";
    document.getElementById("friends_bar").style.display = "block";
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
    window.location = "#matchups";
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

//alert("test1");     // building an array of answers. The right answer is ALWAYS in index 0
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
 */ function signUp(email, firstName, LastName, facebookId, imgUrl, playToInvite) {
    var gender = "";
    var birthDay = "";
    $.ajax({
        url: 'http://stavoren.milab.idc.ac.il/public_html/php/signUp.php',
        method: 'POST',
        data: {
            email: email,
            userFirstName: firstName, userLastName: LastName,
            userFacebookId: facebookId,
            imgUrl: imgUrl,
            userGender: gender,
            userBirthday: birthDay,
            playerToInvite: playToInvite
        },
        success: function(data) {
            var jason = JSON.parse(data);
            alert("sucess in signup");
            if (jason.success === 1) {
                alert("sucess is 1");
                if (!playToInvite) {
                    currentPlayerId = jason.userId;
                    window.location = "#matchups";
                    refreshMatchups();
                } else {
                    startGameWithNewPlayer(jason.userId);
                }
            }
        },
        error: function() {
            alert("error in signup");
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
//                        alert("connected!");
                        var jason = JSON.parse(data);
                        if (jason.success === 1) {
                            currentPlayerId = jason.userId;
                            refreshMatchups();
//                            alert(currentPlayerId);
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
                                        signUp(response.email, response.first_name, response.last_name, response.id, img_link, false);
                                    });
                                }

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
    alert("test");
    if (!web) {
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
                picture: 'http://stavoren.milab.idc.ac.il/public_html/img/logo.png',
                caption: 'TEN SIMAN',
                description: 'I want to invite you to play with me and learn sign language'
            };
            FB.ui(params, function(obj) {
                console.log(obj);
            });
        }

        alert("before FB");
        FB.api('/' + friendID, {fields: 'id, first_name, last_name'}, function(response) {
            alert(response.id + " -- " + response.first_name + "--" + response.last_name + "--" + response.email + "--");
            var img_link = "http://graph.facebook.com/" + response.id + "/picture";
            signUp("email", response.first_name, response.last_name, response.id, img_link, true);
        });
    } else {
        var img_link = "http://graph.facebook.com/" + friendID + "/picture";
        signUp("response.email", "response.first_name", "response.last_name", friendID, img_link, true);
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
    currentPlayerId = 12;
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
                "<td class=\"scoreP1\">" + sections[index]["scoreP1"] + "<div class=sec> שניות</div></td>" + "</tr>");
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
    videoNumber = videoNum;
    if (isDemo) {
//      document.getElementById("title").innerHTML = "נסו לזכור את המילים הבאות";
        document.getElementById("myVideo").setAttribute("src", "http://stavoren.milab.idc.ac.il/public_html/" + videoArray[videoNum]["moviePath"]);
        document.getElementById("myVideo").style.display = "block";
        // Showing the translation
        document.getElementById("translatedWord").style.display = "block";
        document.getElementById("translatedWord").innerHTML = "<H1>" + answerArray[videoNum][0] + "</H1>";
        document.getElementById("play").style.display = "block";
//        document.getElementById("repeat").style.display = "none";
    } else {

        document.getElementById("translatedWord").style.display = "none";
        document.getElementById("gameAnswer1").style.display = "none";
        document.getElementById("gameAnswer2").style.display = "none";
        document.getElementById("gameAnswer3").style.display = "none";
        document.getElementById("gameAnswer4").style.display = "none";
        clearInterval(counter);
        count = 10;
        allreadyPlayed = false;
        document.getElementById("timer").style.display = "none";
        document.getElementById("myVideo").style.display = "block";
        document.getElementById("myVideo").setAttribute("src", "http://stavoren.milab.idc.ac.il/public_html/" + videoArray[videoNum]["moviePath"]);
//        document.getElementById("myVideo").setAttribute("onerror", doAlert());
    }
}

function playVideo() {
    document.getElementById("myVideo").play();
}


function markTheRightAnswer() {
    var counter = 0;
    var timerId = 0;
    timerId = setInterval(function() {
        ++counter;
        if (counter % 2 === 0) {
            document.getElementById(correctAnswerId).style.backgroundImage = "url(css/RightAnswer.png)";
        }
        else {
            document.getElementById(correctAnswerId).style.backgroundImage = "url(css/NeutralAnswer.png)";
        }

        if (counter == 2) {
            clearInterval(timerId);
        }
    }, 200);
}