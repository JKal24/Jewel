let positions = [];
let id = 0;
let colours = ["#FF0000", "#FF0000", "#FA8072", "#FA8072", "#FFFF00", "#FFFF00", "#808000", "#808000", "#808000", "#800000", "#999999"]
let board;
let iteration;
let points = 0;

/* initialization of my board and creation of elements */
function initializeBoard() {
   $("#board").show();
   $("#board").css("display", "grid");
   $("#board").css("position", "absolute");
   $("#board").width = window.innerWidth;
   $("#board").height = window.innerHeight;
   $("#score").show();
   $("#score").text("Score: " + points.toString());
   board = document.getElementById("board");
   createPiece();
}

/* screen helpers that help explain the points system, choose difficulty and start the game */

$(document).ready(function () {
   $("#endContainer").hide();
   $("#board").hide();
   $("#difficulty").hide();

   /* information about points system on the start container*/
   $("#startButton").click(function () {
      $("#startContainer").hide();
      initializeBoard();
      iteration = setInterval(movement, 200);
   });


   $("#restartButton").click(function () {
      $("#endContainer").hide();
      initializeBoard();
      createPiece();
      iteration = setInterval(movement, 200);
   });
   $("body").on("keydown", function (e) {
      switch (e.which) {
         case 37:
            moveSides(-1);
            checkBreaker(positions[positions.length - 1]);
            break;
         case 39:
            moveSides(1);
            checkBreaker(positions[positions.length - 1]);
      }
   });
});

function initializeDifficulty(speed) {
   $("#difficulty").hide();
   initializeBoard();
   iteration = setInterval(movement, speed);
}

/* creating a jewel that is deployed on the board element with a colour and position near the top, below the scoreboard */

function createPiece() {
   /* create a new element to be inserted */
   let newPiece = document.createElement('div');
   board.appendChild(newPiece);

   /* give the element a position on the grid */
   let rand = (Math.floor(Math.random() * 8)) + 1;
   let cl = Math.floor(Math.random() * (colours.length));
   console.log(cl, colours.length);
   let position = {
      x: [rand, rand + 1],
      y: [2, 3],
      id: "part" + id.toString(),
      colour: colours[cl]
   }

   positions.push(position);
   $(newPiece).attr('id', position.id);
   $(newPiece).addClass('box');
   id++;

   /* initialize the element's properties */
   $(newPiece).css("grid-row", position.y[0].toString() + '/' + position.y[1].toString());
   $(newPiece).css("grid-column", position.x[0].toString() + '/' + position.x[1].toString());

   $(newPiece).css("background-color", (position.colour));
}

/* functions that take care of the movement of the blocks in the horizontal and vertical plane */

function movement() {
   moveOneDown(positions.length - 1);

   checkBreaker(positions[positions.length - 1]);
}

function moveOneDown(int) {
   let objy = ($("#" + positions[int].id).css("grid-row")).split(" / ");

   positions[int].y = [parseInt(objy[0]) + 1, parseInt(objy[1]) + 1];

   $("#" + positions[int].id).css("grid-row", (positions[int].y[0]) + "/"
      + positions[int].y[1]);
}

function moveSides(direc) {
   let objx = ($("#" + positions[positions.length - 1].id).css("grid-column")).split(" / ");

   if ((objx[0] < 8 || (objx[0] == 8 && direc == -1)) && (objx[0] > 1 || (objx[0] == 1 && direc == 1))
   && noCollision(positions[positions.length - 1], direc)) {
      positions[positions.length - 1].x = [parseInt(objx[0]) + direc,
      parseInt(objx[1]) + direc];

      $("#" + positions[positions.length - 1].id).css("grid-column", (positions[positions.length - 1].x[0]) + "/" +
      positions[positions.length - 1].x[1]);
   }
}

function noCollision(obj, direc) {
   let collision = positions.filter(box => (box.x[0] == obj.x[0] + direc)
   && (box.y[0] == obj.y[0]));

   return collision.length == 0;
}

/* buffer */

function intervalChange() {
   clearInterval(iteration);
   createPiece();
   iteration = setInterval(movement, 200);
}