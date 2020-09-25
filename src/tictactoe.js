//WEBPACK imports


// VARIABLES
//init vars on load
var user = "X";
var comp = "O";
var origBoard = [];
var score = {
  wins: 0,
  losses: 0
};

$('input[type=radio]').click(function() {
  if (this.value == "X") {
    user = "X";
    comp = "O";
    startGame();
  } else {
    user = "O";
    comp = "X";
    startGame();
  }
});

//array of all winning combinations
const winArray = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// cells constant variable that selects all elements that have the .cell class
const cells = document.querySelectorAll(".cell");

//calls startGame function
function showRadio() {
  $('input[type=radio]').show(100)
}

function hideRadio() {
  $('input[type=radio]').hide(100)
}

//function to begin game process
function startGame() {
  hideRadio();
  $("button").hide(100);
  $(".endgame").hide(100);
  origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  //go through every cell and do things
  for (var i = 0; i < cells.length; i++) {
    //do 3 things to cells
    //set inner text to nothing
    cells[i].innerText = "";
    //remove backgroundcolor because when player wins the row will be highlighted
    cells[i].style.removeProperty("background-color");

    cells[i].style.removeProperty("color");
    //add eventlistener to click event and add turnClick function
    cells[i].addEventListener("click", turnClick, false);
  }
}
//logs id of each square that is clicked.
const replay = document.getElementById("replay");
replay.addEventListener("click", () => {
  startGame();
})

function showButton() {
  $("button").show(200);
}

function turnClick(square) {
  //check if piece in board is a number
  if (typeof origBoard[square.target.id] == "number") {
    //if piece is number set turn to piece and human user. if didn't win, then  run turn of best Spot for computer player after 250ms
    turn(square.target.id, user);
    if (!checkWin(origBoard, user)) {
      if (!checkTie()) {
        setTimeout(function() {
          turn(bestSpot(), comp);
        }, 250);
      }
    }
  }
}

//turn function sets square ID on origboard array to player. Checks if won using checkWin Function
function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) {
    gameOver(gameWon);
  }
}

//function that checks if a player has 3 rows of icons in winArray
function checkWin(board, player) {

  //variable array of plays of each player
  let plays = board.reduce((acc, elem, index) => (elem === player ? acc.concat(
    index) : acc), []);

  let gameWon = null;
  //for each index and sub array of winArray key value pairs
  for (let [index, win] of winArray.entries()) {
    //has the player played on every spot that counts as a win array in winAwway
    //checks if every elem of win subArray has indexOf of greater than -1(exists as an element)
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {
        index: index,
        player: player
      };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  showRadio();
  //go through every index of winArray subArray to change background color to blue if user or red if comp
  for (let index of winArray[gameWon.index]) {
    if (gameWon.player == user) {
      document.getElementById(index).style.backgroundColor = "blue";
      document.getElementById(index).style.color = "orange";
      var winStatement = "You win!";
    } else {
      document.getElementById(index).style.backgroundColor = "red";
      document.getElementById(index).style.color = "yellowgreen";
      winStatement = "You lose.";
    }
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(winStatement);
  showButton();
}

function emptySquares() {
  return origBoard.filter(function(s) {
    let e = typeof s;
    if (e == "number") {
      return true;
    } else {
      return false;
    }
  });
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function bestSpot() {
  //return result passing in orig Board and AI player, and get the index of the object htat is returned from minimax function.

  return minimax(origBoard, comp).index;
}

function checkTie() {
  //add function to check if gamewon first=
  if (emptySquares().length === 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    showButton();
    return true;
  }
  return false;
}

function randomSpot(){

}


//MINIMAX algorithm CODE  FROM FREE CODE CAMP version.
function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  //==========
  // Check each spot to see if there is a winning spot.
  // COMP player winning returns +100, Losing
  //===========
  if (checkWin(newBoard, user)) {
    return {
      score: -10
    };
  } else if (checkWin(newBoard, comp)) {
    return {
      score: 100
    };
  } else if (availSpots.length === 0) {
    return {
      score: 0
    };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    if (player == comp) {
      var result = minimax(newBoard, user);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, comp);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  var bestMove;
  if (player == comp) {
    var bestScore = -10000;
    for (var j = 0; j < moves.length; j++) {
      if (moves[j].score > bestScore) {
        bestScore = moves[j].score;
        bestMove = j;
      }
    }
  } else {
    bestScore = 10000;
    for (var k = 0; k < moves.length; k++) {
      if (moves[k].score < bestScore) {
        bestScore = moves[k].score;
        bestMove = k;
      }
    }
  }
  return moves[bestMove];

}
