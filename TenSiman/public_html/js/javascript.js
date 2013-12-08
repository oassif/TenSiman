/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

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
    videoSource[0] = 'movies/cut.MOV';
    videoSource[1] = 'movies/squeeze.MOV';
    videoSource[2] = 'movies/bond.MOV';
    //videoSource[3]='movies/switch.MOV';
    //videoSource[4]='movies/tight.MOV';

    answerArray[0] = ["cut", "take", "twist", "paste"];
    answerArray[1] = ["squeeze", "rock", "thanks", "yummy"];
    answerArray[2] = ["bond", "mother", "father", "home"];
    //answerArray[3] = ["switch", "flight", "happy", "sad"];
    //answerArray[4] = ["tight", "hate", "love", "looze"];

    // Generate Random number
    //startIndex = Math.floor((Math.random()*videoCount)+1); 
    
    videoCount = videoSource.length;
    
    
    for (var index = 0; index < videoCount; ++index) {
        // video source, right answer, user's answer, time, points
        gameDetails[index] = [videoSource[index], answerArray[index][0], false, 0, 0];
    }

    //videoPlay(0);
    document.getElementById("myVideo").setAttribute("src", videoSource[0]);


    document.getElementById('myVideo').addEventListener('ended', myHandler, false);

});
    function timer() { 
        if (count <= 0) { clearInterval(counter); 
        //counter ended, do something here
        return; 
    }
            count=count-1;
            document.getElementById("timer").innerHTML= count + " secs";
            
    }
     
function startGame()
{
    document.getElementById("answers").style.display = "none";
    window.location = "#game";
    setTimeout(function() {
        videoPlay(i);
    }, 2000);
}

function videoPlay(videoNum)
{
    //alert(i);
    document.getElementById("myVideo").setAttribute("src", videoSource[videoNum]);
    document.getElementById("myVideo").load();
    document.getElementById("myVideo").play();


    // Checks if need to show the translation
    if (isDemo) {
        // Showing the translation
        //document.getElementById("translation").innerHTML = "<H1>" + answerArray[videoNum][0] + "</H1>";
        document.getElementById("translatedWord").innerHTML = "<H1>" + answerArray[videoNum][0] + "</H1>";

        // Hiding the options
        document.getElementById("answers").style.display = "none";
    }

    else {
        show4possibleAnswers(videoNum);
    }
}

function show4possibleAnswers(videoNum) {
    // Not Showing the translation
    //document.getElementById("translation").innerHTML = "<H1>&nbsp</H1>";
    document.getElementById("translatedWord").innerHTML = "<H1>&nbsp</H1>";

    // Showing the answers
    // First, generates Random number for the first answer
    var firstAnswerId = Math.floor((Math.random() * 4));
    
    $("#answer1").text(answerArray[videoNum][firstAnswerId]);
    $("#answer2").text(answerArray[videoNum][(firstAnswerId + 1) % 4]);
    $("#answer3").text(answerArray[videoNum][(firstAnswerId + 2) % 4]);
    $("#answer4").text(answerArray[videoNum][(firstAnswerId + 3) % 4]);

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
        count=30; 
        counter=setInterval(timer, 1000); //1000 will run it every 1 second 
        videoPlay(order[i]);
    }, 1000);
}

// randomly decide the order of the videos.
function generateOrder(numberOfVideos) {
    var videosOrder = [1, 0, 2];

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

    document.getElementById(correctAnswerId).style.background = "green";

    

    // continte to the next question.
    ++i;
    if (i === videoCount) {
        // If all the questions were showed, end game
        endGame();
    }
    else {
        // Awaits half a second before showing the next question
        setTimeout(function() {
            document.getElementById(object.id).style.background = "";
            document.getElementById(correctAnswerId).style.background = "";
            count = 30;
            videoPlay(order[i]);
        } ,500);
    }
}

function getCorrectId() {

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