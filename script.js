// fetch the ball and rod elements
var ball = document.getElementById("ball");
var rod1 = document.getElementById("rod1");
var rod2 = document.getElementById("rod2");

// following constants is used for storage and rod naming
const storeName = "PPName"
const storeScore = "PPSMaxScore";
const rod1Name = "Rod 1", rod2Name = "Rod 2";

// other varibles used in the game
var score, maxScore, gameOn = false, rod, gameMovement, ballSpeedY = 2, ballSpeedX = 2;


// reset the game function
function resetGame(winnerRod){
    rod1.style.left = (window.innerWidth - rod1.offsetWidth)/2 +'px';
    rod2.style.left = rod1.style.left;
    ball.style.left = (window.innerWidth - ball.offsetWidth)/ 2 +'px';

    // Loser get the ball

    // if rod2 loses
    if (winnerRod == rod1Name){
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        ballSpeedY = -2;
    }

    // if rod1 loses
    else if(winnerRod == rod2Name){
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) +'px';
        ballSpeedY = 2;
    }

    score = 0;
    gameOn = false;
}


// storing and displaying the winner data function
function storeWin(winnerRod, score){
    if(score > maxScore){
        maxScore = score;
        localStorage.setItem(storeName, winnerRod);
        localStorage.setItem(storeScore, maxScore);
    }

    clearInterval(gameMovement);
    resetGame(winnerRod);

    alert(winnerRod + " wins with a score of: " + score + ". Max score is: " + maxScore);
}


// initialize the game set-up function
function initializeGame(){
    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if (rod == null || maxScore == null){
        alert("This is the first time you are playing this game. LET'S START");
        maxScore = 0;
        rod = rod1Name;
    }
    else{
        alert(rod + " has maximum score of " + maxScore);
    }

    resetGame(rod);
}


// Game starting
initializeGame();

window.addEventListener('keypress', function(event){
    let rodSpeed = 20;
    let rodDimensions = rod1.getBoundingClientRect();

    if (event.code == "KeyD" && rodDimensions.right < window.innerWidth){
        rod1.style.left = (rodDimensions.left + rodSpeed) +'px';
        rod2.style.left = rod1.style.left;
    }

    else if (event.code == "KeyA" && rodDimensions.left > 0){
        rod1.style.left = (rodDimensions.left - rodSpeed) +'px';
        rod2.style.left = rod1.style.left;
    }

    if (event.code == "Enter"){
        if(gameOn == false){
            gameOn = true;
            let ballDimensions = ball.getBoundingClientRect();
            let ballX = ballDimensions.x, ballY = ballDimensions.y, ballDia = ballDimensions.width;
            
            let rodHeight = rod1.offsetHeight, rodWidth = rod1.offsetWidth;

            gameMovement = setInterval(function(){
                let rodX = rod1.getBoundingClientRect().x;

                ballX += ballSpeedX;
                ballY += ballSpeedY;

                ball.style.left = ballX +'px';
                ball.style.top = ballY +'px';

                if (ballX < 0 || (ballX + ballDia) > window.innerWidth){
                    ballSpeedX = -ballSpeedX;
                }

                let ballPos = ballX + ballDia/2;

                if(ballY <= rodHeight){
                    ballSpeedY = -ballSpeedY;
                    score++;

                    if (ballPos < rodX || ballPos > (rodX + rodWidth)){
                        storeWin(rod2Name, score);
                    }
                }

                else if((ballDia + ballY) >= (window.innerHeight - rodHeight)){
                    ballSpeedY *= -1;
                    score++;
                    
                    if (ballPos < rodX || ballPos > (rodX + rodWidth)){
                        storeWin(rod1Name, score);
                    }
                }
            }, 10);
        }
    }
});
