/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var timePerRound = 10;
var delayBetweenQuestions = 750; // in milliseconds

var i = 0;
var currVideoId;
var correctAnswerId;
var order;
var videoSource = new Array();
var videoCount = 0;
var answerArray = [6];
var startIndex;

var gameDetails = new Array();

var isDemo = true;

var count;
var counter;


$(document).ready(function()
{
    videoSource[0] = 'movies/new.gif';
    videoSource[1] = 'movies/after.gif';
    videoSource[2] = 'movies/long.gif';
    videoSource[3]= 'movies/middle.gif';
    videoSource[4]= 'movies/last.gif';
    
    answerArray[0] = ["חדש", "חתך", "אמצע", "ברית מילה"];
    answerArray[1] = ["אחרי", "מחר", "אחרון", "עד"];
    answerArray[2] = ["ארוך", "חדש", "למתוח", "מותח"];
    answerArray[3] = ["אמצע", "חדש", "חתימה", "חתך"];
    answerArray[4] = ["אחרון", "לפני", "אחרי", "לחתוך"];

    // Generate Random number
    //startIndex = Math.floor((Math.random()*videoCount)+1); 

    videoCount = videoSource.length;


    for (var index = 0; index < videoCount; ++index) {
        // video source, right answer, user's answer, time, points
        gameDetails[index] = [videoSource[index], answerArray[index][0], false, 0, 0];
    }

    //videoPlay(0);
  //  document.getElementById("myVideo").setAttribute("src", videoSource[0]);
    //document.getElementById('myVideo').addEventListener('ended', myHandler, false);

});
function timer() {
    if (count <= 0) {
        continueToNextQuestion(null);
        return;
    }
    count = count - 1;
    document.getElementById("timer").innerHTML = count + " secs";
}

function startGame()
{
    document.getElementById("answers").style.display = "none";
    window.location = "#game";
    setTimeout(function() {
        videoPlay(0);
    }, 2000);
}

function videoPlay(videoNum)
{
    
    //alert(i);
    document.getElementById("myVideo").style.display = "block";
    document.getElementById("myVideo").setAttribute("src", videoSource[videoNum]);
//    document.getElementById("myVideo").load();
//    document.getElementById("myVideo").play();


    // Checks if need to show the translation
    if (isDemo) {
        // Showing the translation
        //document.getElementById("translation").innerHTML = "<H1>" + answerArray[videoNum][0] + "</H1>";
        document.getElementById("translatedWord").innerHTML = "<H1>" + answerArray[videoNum][0] + "</H1>";

        // Hiding the options
        document.getElementById("answers").style.display = "none";
        
              if (videoNum != 4) {
            videoNum++;
          setTimeout(function() {
             videoPlay(videoNum);
          }, 2200);
        } else {
            
        setTimeout(function() {
                document.getElementById("myVideo").style.display = "none";
                document.getElementById("repeat").style.display = "block";
          }, 2200);

        }
    }

    else {
        show4possibleAnswers(videoNum);
    }
    

}

function show4possibleAnswers(videoNum) {
    // Not Showing the translation
    //document.getElementById("translation").innerHTML = "<H1>&nbsp</H1>";
    document.getElementById("translatedWord").innerHTML = "<H1>&nbsp</H1>";
    document.getElementById("translatedWord").style.display = "none";

    // Showing the answers
    // First, generates Random number for the first answer
    var firstAnswerId = Math.floor((Math.random() * 4));

    /*$("#answer1").text(answerArray[videoNum][firstAnswerId]);
    $("#answer2").text(answerArray[videoNum][(firstAnswerId + 1) % 4]);
    $("#answer3").text(answerArray[videoNum][(firstAnswerId + 2) % 4]);
    $("#answer4").text(answerArray[videoNum][(firstAnswerId + 3) % 4]);*/
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

    // Start a timer to answer once the video ended
    //setTimeout(function(){endGame();}, 4000);


    if (isDemo) {
        ++i;
        if (i === videoCount) {
            i = 0;
            document.getElementById("translatedWord").style.display = "none";
            document.getElementById("repeat").style.display = "block";
            document.getElementById("play").style.display = "block";
        }
        else {
            videoPlay(i);
        }
    }

//    }
}

// start to show videos + answers. 
function startPlay() {

    isDemo = false;
    i = 0;
    // Hiding buttons
    document.getElementById("repeat").style.display = "none";
    document.getElementById("play").style.display = "none";

// call for the first video
    order = generateOrder();
    setTimeout(function() {
        count = timePerRound;
        counter = setInterval(timer, 1000); //1000 will run it every 1 second 
        videoPlay(order[i]);
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
    //   console.log("selected is: \"" + object.text  + "\"");
    //   console.log("answer is: \"" + answerArray[currVideoId][0] + "\"");

    gameDetails[order[i]][3] = count;

    if (object.text.toString() === answerArray[order[i]][0])//answerArray[currVideoId][0])
    {
        gameDetails[order[i]][2] = true;
        //Update score
        gameDetails[order[i]][4] = count;
    }
    else {
        document.getElementById(object.id).style.background = "red";
        // Update score
        gameDetails[order[i]][4] = 0;
    }

    continueToNextQuestion(object);
}



function continueToNextQuestion(object) {
    document.getElementById(correctAnswerId).style.background = "#B5EAAA";//"green";
    document.getElementById(correctAnswerId).style.background = "gray";//"green";
    document.getElementById(correctAnswerId).style.background = "#B5EAAA";//"green";
    document.getElementById(correctAnswerId).style.background = "gray";//"green";
    document.getElementById(correctAnswerId).style.background = "#B5EAAA";//"green";

    // continte to the next question.
    ++i;
    if (i === videoCount) {
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
            videoPlay(order[i]);
        }, delayBetweenQuestions);
    }
}

function endGame() {
    /*$("#score").text("Your score is: " + numToGuess);
     window.location("#gameOver");*/
    // 
    alert("Game Ended!!");
    for (var index = 0; index < videoCount; ++index) {
        console.log("User answered on " + gameDetails[index][0] + " " + gameDetails[index][2] + " answer. Time:" + gameDetails[index][3] + " score: " + gameDetails[index][4]);
    }
}