/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var NUMBER_SECTIONS = 5;
var currentPlayerId = 0;
var timePerRound = 10;
var delayBetweenQuestions = 750; // in milliseconds

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

function pageY(elem) {
    return elem.offsetParent ? (elem.offsetTop + pageY(elem.offsetParent)) : elem.offsetTop;
}

function resizeIframe() {
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
}

$(document).ready(function()
{
    
     if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined'))
                alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
            if (typeof CDV == 'undefined')
                alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
            if (typeof FB == 'undefined')
                alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

            FB.Event.subscribe('auth.login', function(response) {
                alert('auth.login event');
            });

            FB.Event.subscribe('auth.logout', function(response) {
                alert('auth.logout event');
            });

            FB.Event.subscribe('auth.sessionChange', function(response) {
                alert('auth.sessionChange event');
            });

            FB.Event.subscribe('auth.statusChange', function(response) {
                alert('auth.statusChange event');
            });
    
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
    //login();
    var htmlCode = "";
    alert("ref match up player" + currentPlayerId);
    
    // Getting the user status and current matchups
    $.ajax({
    url: 'http://stavoren.milab.idc.ac.il/public_html/php/getMatchupPageContent_New_DB.php',
    method: 'POST',
    data: { 
        userId: currentPlayerId, // TODO: change Hardcoded value for the user Oren Assif
    },
    success: function (data) {
        var jason = JSON.parse(data);
        if (jason.success == 1) {
            buildPlayerBar(jason.user);
            buildMatchesTable(jason.matches);
        }
    },
    error: function () {
      alert("error");
     }
    });
    document.getElementById("matchups_table").innerHTML = "";
    document.getElementById("friends_bar").style.display = "none";

}

function buildPlayerBar(userData) {
    var barDiv = document.getElementById("playerBar");
        barDiv.innerHTML = "<table width=\"100%\"><tr>" +
                        "<td><img src=\"" + userData["imgURL"] + "\" />&nbsp" + userData["fullName"] + "</td>" +
                        "<td>רמה " + userData["level"] + "</td>" +
                        "<td>נקודות: " + userData["score"] + "</td>" +
                        "<td></td>" +
                        "</tr></table>";
    /* LTR OLD VERSION
    barDiv.innerHTML = "<table width=\"100%\"><tr>" +
                        "<td>" + userData["score"] + "נקודות:</td>" +
                        "<td>" + userData["rank"] + "רמה:</td>" +
                        "<td>" + userData["fullName"] + "</td>" +
                        "<td><img src=\"" + userData["imgURL"] + "\" /></td>" +
                        "</tr></table>";
    */    
}

function buildMatchesTable(matchesData) {
    var table = document.getElementById("matchups_table");
    var numOfMatchups = matchesData.length;

    var index;
    //table.innerHTML = "";
    for (index = 0; index < numOfMatchups; ++index) {
        
        var text = ""; // This
        var textValue = "";
        var buttonProperty = "";
        
        // Todo: see if it's the first player or sceond player and according to it decide.
        // Decide button
        if (matchesData[index]["gameStatus"] === "0") {
            text = "תן סימן";
            buttonProperty = "onClick=\"createNewGame(" + matchesData[index]["LiveGameId"] + ")\"";
        }
        else if (matchesData[index]["gameStatus"] === "1") {
            text = "תורך!!!";
            alert("your turn:" + matchesData[index]["LiveGameId"]);
            buttonProperty = "onClick=\"playTurn(" + matchesData[index]["LiveGameId"] + ")\"";
        }
        else if (matchesData[index]["gameStatus"] === "2") {
            text = "המתן";
            buttonProperty = "disabled";
        }
        else if (matchesData[index]["gameStatus"] === "3") {
            text = "הזמנה ממומחה";
            buttonProperty = "onClick=\"playTurn(" + matchesData[index]["LiveGameID"] + ")\"";
        }
        else {
            // default status
            text = "תן סימן " + matchesData[index]["gameStatus"];
            buttonProperty = "createNewGame(" + matchesData[index]["rivalId"] + ")";
        }
        
        $("#matchups_tableNew").append("<tr align=\"center\">" +
                                            "<td><button " + buttonProperty + " >" + text + "</button></td>" +
                                            "<td>אני<br/>" + matchesData[index]["userScore"] + "</td>" +
                                            "<td>:</td><td>" +
                                            "<td>"+ matchesData[index]["rivalName"] + "<br />" + matchesData[index]["rivalScore"] + "</td>" +
                                            "<td><img src=\"" + matchesData[index]["rivalImg"] + "\" />" +
                                                 "<br />" + matchesData[index]["rivalName"] + "</td></tr>");
    }
    
}

function timer() {
    if (count <= 0) {
        continueToNextQuestion(null);
        return;
    }
    count = count - 1;
    document.getElementById("timer").innerHTML = count + " secs";
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
    success: function (data) {
        var jason = JSON.parse(data);
        if (jason.success == 1) {   
        }
    },
    error: function () {
      alert("error");
     }
    });
    
    // TODO: set the video's array and other values once we'll have them
    
    // TODO: might need to change something here:
    document.getElementById("answers").style.display = "none";
    window.location = "#game";
    resizeIframe();
    resizeWidthIframe();
    setTimeout(function() {
        videoPlay(0);
    }, 100);
}

function startGame()
{
    currVideoId = 0;
    isDemo = true;
    document.getElementById("play").style.display = "block";
    document.getElementById("translatedWord").style.display = "block";
    document.getElementById("answers").style.display = "none";
    window.location = "#game";
    resizeIframe();
    resizeWidthIframe();
    setTimeout(function() {
        videoPlay(0);
    }, 100);
}

function videoPlay(videoNum)
{
    
    // Checks if need to show the translation
    if (isDemo) {
        document.getElementById("title").innerHTML ="נסו לזכור את המילים הבאות"; 
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
        document.getElementById("title").innerHTML ="בחרו את התשובה הנכונה";
        show4possibleAnswers(videoNum);
    }
    

}

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

alert("im called");
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
function onClick_checkAnswer(object) {

    gameDetails[order[currVideoId]][3] = count;

    if (object.text.toString() === answerArray[order[currVideoId]][0])//answerArray[currVideoId][0])
    {
        gameDetails[order[currVideoId]][2] = true;
        //Update score
        gameDetails[order[currVideoId]][4] = count;
    }
    else {
        document.getElementById(object.id).style.background = "red";
        // Update score
        gameDetails[order[currVideoId]][4] = 0;
    }
    
    score += gameDetails[order[currVideoId]][4];
    continueToNextQuestion(object);
}



function continueToNextQuestion(object) {
    document.getElementById(correctAnswerId).style.background = "#B5EAAA";//"green";
    document.getElementById(correctAnswerId).style.background = "gray";//"green";
    document.getElementById(correctAnswerId).style.background = "#B5EAAA";//"green";
    document.getElementById(correctAnswerId).style.background = "gray";//"green";
    document.getElementById(correctAnswerId).style.background = "#B5EAAA";//"green";

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

function endGame() {
    /*$("#score").text("Your score is: " + numToGuess);
     window.location("#gameOver");*/
    // 

// 3.2.2014 - JSON post
//function post() {
        $.ajax({
            url: 'http://stavoren.milab.idc.ac.il/public_html/php/updateLiveGame.php',
            method: 'POST',
            data: { 
                liveGameId: 1, 
                answer1: gameDetails[0], //$("#name").val(),
                answer2: gameDetails[1] 
            },
            success: function (data) {
                var jason = JSON.parse(data);
                if (jason.success == 1) {   
                }
            },
            error: function () {
              alert("error");
             }
         });
         $("#text").val("");
//    }
alert("Update Sent");

   
   
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

        document.getElementById("translatedWord").innerHTML = "<H1>" + score + "              :"+"ניקוד</H1>";
        
   window.location = "#matchups";
   refreshMatchups();
}
/**
 * Reset the 4 button of possible answers and the timer.
 * @param {type} matchup
 * @returns {undefined}
 */
function resetButtons() {
    
   document.getElementById("timer").style.display = "block";
   document.getElementById("answer1").style.display = "block";
   document.getElementById("answer2").style.display = "block";
   document.getElementById("answer3").style.display = "block";
   document.getElementById("answer4").style.display = "block";
   
    document.getElementById("answer1").style.background = "";
    document.getElementById("answer2").style.background = "";
    document.getElementById("answer3").style.background = "";
    document.getElementById("answer4").style.background = "";


    
}

function refreshFriendsZone(userId, toInvite, temp) {
    var htmlCode = "";
    
    window.location = "#friends";
    alert("player" + currentPlayerId);

    // Getting the user status and current matchups
    $.ajax({
    url: 'http://stavoren.milab.idc.ac.il/php/getMatchupPageContent_New_DB.php',
    method: 'POST',
    data: { 
        userId: userId,
    },
    success: function (data) {
        var jason = JSON.parse(data);
        if (jason.success == 1) {
        //    buildFriendsBar(jason.matches);
            buildFriendsTable(jason.matches, toInvite);
        }
    },
    error: function () {
      alert("error");
     }
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
  // document.getElementById("matchups_tableNew").style.display = "none";
   document.getElementById("friends_table").innerHTML = "";

    var table = document.getElementById("friends_table");

    var numOfMatchups = matchesData.length;
    /*alert(numOfMatchups);
    alert(table.innerHTML);*/
    var index;
    for (index = 0; index < numOfMatchups; ++index) {
        
        var text = "";
        var buttonProperty = "";
        
        // Decide button
        if (toInvite) {
            text = "הזמן"
            
        }else {
           text = "שחק"
           buttonProperty = "onClick=\"startGameWithNewPlayer(" + matchesData[index]["rivalId"] + ")\"";

        }
        
           $("#friends_table").append("<tr align=\"center\">" +
                                            "<td><button " + buttonProperty + " >" + text + "</button></td>" +
                                            "<td><img src=\"" + matchesData[index]["rivalImg"] + "\" />" +
                                                 "<br />" + matchesData[index]["rivalName"] + "</td></tr>");
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
    
    alert("player" + currentPlayerId);
    alert("startGameWithNewPlayer");
        $.ajax({
            url: 'http://stavoren.milab.idc.ac.il/public_html/php/sendNewMatchup.php',
            method: 'POST',
            data: { 
                myUserId: currentPlayerId, 
                playerUserId: rivalId //$("#name").val(),
            },
            success: function (data) {
                var jason = JSON.parse(data);
                if (jason.success === 1) { 
                    var matchId = jason.data;
                    alert("MatchId: " + matchId);
                    createNewGame(matchId);
                }
            },
            error: function () {
              alert("error in match");
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
    alert("TESSSST");
    alert("createNewGame");
        $.ajax({
            url: 'http://stavoren.milab.idc.ac.il/public_html/php/createNewGame.php',
            method: 'POST',
            data: { 
                matchId: matchId
            },
            success: function (data) {
                var jason = JSON.parse(data);
                if (jason.success === 1) {
                    alert("succes");
                    var matchId = jason.data;
                    alert("createNewGamw with " + matchId);
                    videoArray = jason.sections;
                    createGameDetails();
                    startGame();    
                } else {
                    alert("fail");
                }
                
            },
            error: function () {
              alert("error in match");
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
    
    alert("test1");
    // building an array of answers. The right answer is ALWAYS in index 0
    for (var index = 0; index < videoCount; ++index) {
alert("test2");
        var wrongOptions = videoArray[index]["wrongOptions"].split(":");
        /*answerArray[index][0] = videoArray[index]["rightAnswer"];
        answerArray[index][1] = wrongOptions[0];
        answerArray[index][2] = wrongOptions[1];
        answerArray[index][3] = wrongOptions[2];*/
        answerArray[index] = [videoArray[index]["rightAnswer"], wrongOptions[0], wrongOptions[1], wrongOptions[2]];
        alert(answerArray[index][0]);
    }
    
    for (var index = 0; index < videoCount; ++index) {
        alert("test3");
        // video source, right answer, user's answer, time, points
        gameDetails[index] = [index, answerArray[index][0], false, 0, 0];
    }
}

function playTurn(game_id) {
        
     alert("gameid " +game_id);
     $.ajax({
            url: 'http://stavoren.milab.idc.ac.il/public_html/php/playTurn.php',
            method: 'POST',
            data: { 
                gameId: game_id,
            },
            success: function (data) {
                var jason = JSON.parse(data);
                if (jason.success === 1) {
                    alert("ok");
                    videoArray = jason.sections;
                    startGame();    
                }
            },
            error: function () {
              alert("error in match");
             }
        });
}



//    FB.api('/me', function(response) {
//        console.log('Good to see you, ' + response.name + '.');
//
//       response.name
//       response.username 
//       response.id 
//       response.email
//  
//       
//
//    });
//    

 function signUp() {
         var email = "stav@gmail.com:";
         var firstName = "stav";
         var LastName = "moskovich";
         var facebookId = "1378982912";
         var imgUrl= "https://graph.facebook.com/stav.moskovich/picture/";
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
                userBirthday: birthDay,
            },
            
            success: function (data) {
                var jason = JSON.parse(data);
                if (jason.success === 1) {
                    alert("ok");
                    currentPlayerId = jason.userId;
                    window.location = "#matchups";
                    refreshMatchups();
                }
            },
            error: function () {
              alert("error in match");
             }
        });

}

//function login(facebookId) {
//    currentPlayerId = facebookId;
//    window.location = "#matchups";
//    refreshMatchups();
//}

            /*function getSession() {
             alert("session: " + JSON.stringify(FB.getSession()));
             }
             */
            function getLoginStatus() {
                FB.getLoginStatus(function(response) {
                    if (response.status == 'connected') {
                        alert('logged in!!!');
                        var uid = response.authResponse.userID;
                        var accessToken = response.authResponse.accessToken;

                        alert("id: " + uid);
                        currentPlayerId = uid;
                        
                        FB.api('/me', {fields: 'id'}, function(response) {
                             alert(response);
                         });                       
                         
                        window.location = "#matchups";
                        refreshMatchups();
                    } else {
                        alert('not logged in');
                    }
                });

            } 
            var friendIDs = [];
            var fdata;
            function me() {
                FB.api('/me/friends', {fields: 'id, name, picture'}, function(response) {
                    if (response.error) {
                        alert(JSON.stringify(response.error));
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
                    alert('logged out');
                });
            }

            function login() {
                FB.login(
                        function(response) {
                            if (response.session) {
                                alert('logged in!!!');

                            } else {
                                alert('not logged in');
                            }
                            
                       if (response.authResponse) {
                             alert('logged in');
                             fbId = response.authResponse.userId;
                                alert("user id is "+fbId);
                    } else {
                         alert('not logged in');
                    }
                        },
                        {scope: 'basic_info, email, public_profile, user_about_me, user_birthday, user_friends'}
                );
            }


            function facebookWallPost() {
                console.log('Debug 1');
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
                    console.log(obj);
                });
            }

            function publishStoryFriend() {
                randNum = Math.floor(Math.random() * friendIDs.length);

                var friendID = friendIDs[randNum];
                if (friendID == undefined) {
                    alert('please click the me button to get a list of friends first');
                } else {
                    console.log("friend id: " + friendID);
                    console.log('Opening a dialog for friendID: ', friendID);
                    var params = {
                        method: 'feed',
                        to: friendID.toString(),
                        name: 'Facebook Dialogs',
                        link: 'https://developers.facebook.com/docs/reference/dialogs/',
                        picture: 'http://fbrell.com/f8.jpg',
                        caption: 'Reference Documentation',
                        description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
                    };
                    FB.ui(params, function(obj) {
                        console.log(obj);
                    });
                }
            }

            document.addEventListener('deviceready', function() {
                try {
                    alert('Device is ready! Make sure you set your app_id below this alert.');
                    FB.init({appId: "609521172430311", nativeInterface: CDV.FB, useCachedDialogs: false});
                    document.getElementById('data').innerHTML = "";
                    getLoginStatus();
                } catch (e) {
                    alert(e);
                }
            }, false);
