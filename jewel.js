let positions = [];
let id = 0;
let colours = ["#FF0000", "#FF0000", "#FA8072", "#FA8072", "#FFFF00", "#FFFF00", "#808000", "#808000", "#808000", "#800000", "#999999"]
let board = document.getElementById("board");
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
}

$(document).ready(function () {
   $("#endContainer").hide();
   $("#score").hide();
   $("#difficulty").hide();
   $("#startButton").click(function () {
      $("#startContainer").hide();
      initializeBoard();
      createPiece();
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

function createPiece() {
   /* create a new element to be inserted */
   let newPiece = document.createElement('div');
   board.appendChild(newPiece);

   /* give the element a position on the grid */
   let rand = (Math.floor(Math.random() * 8)) + 1;
   let cl = Math.floor(Math.random() * (colours.length));
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

/* check if there is a matching combination */

function checkBreaker(obj) {
   if (obj.y[0] >= 11 || (positions.filter
      (proximity => (proximity.y[0] == (obj.y[0] + 1)) && (proximity.x[0] == obj.x[0]))).length != 0) {

      if ((positions.filter(gameOver => (gameOver.y[0] == obj.y[0]) && (gameOver.x[0] == obj.x[0]) && (obj.y[0] <= 2))).length > 1) {
         gameOver();
         return;
      }

      if ((positions.filter(myObj => myObj.colour == obj.colour)).length >= 3) {
         checkSpaces(obj);
      }

      intervalChange();
      return;
   }
}

function checkSpaces(obj) {
   let myCases = [];
   let potentialcase;
   let afterCases = [];
   let cleaned = false;
   let cleanobj = false;
   let closeObj = positions.filter(Obj => ((obj.id != Obj.id) &&
      (Math.ceil((Math.abs(Obj.x[0] - obj.x[0])) <= 1) &&
         (Math.ceil(Math.abs(Obj.y[0] - obj.y[0])) <= 1))));

   /* parse through the array to see if any blocks are next to the one that just landed */

   for (let piece = 0; piece < closeObj.length; piece++) {

      /* identify the positions of those closest */
      if (closeObj[piece].colour == obj.colour) {
         switch (closeObj[piece].y[0]) {

            /* cases one row below */

            case obj.y[0] + 1:

               switch (closeObj[piece].x[0]) {

                  /* cases in the same column */

                  case obj.x[0]:

                     loop: for (scale = 2; scale < positions.length; scale++) {
                        potentialcase = positions.filter(box => (box.y[0] == obj.y[0] + scale) && (box.x[0] == obj.x[0]) && (box.colour == obj.colour));
                        if ((potentialcase).length > 0) {
                           myCases.push(potentialcase[0]);
                        } else {
                           break loop;
                        }
                     }

                     cleaned = check_remove_clean(myCases);
                     break;

                  /* cases one column right */

                  case obj.x[0] + 1:

                     loop: for (scale = 2; scale < positions.length; scale++) {
                        potentialcase = positions.filter(box => (box.y[0] == obj.y[0] + scale) && (box.x[0] == obj.x[0] + scale) && (box.colour == obj.colour));
                        if ((potentialcase).length > 0) {
                           myCases.push(potentialcase[0]);
                        } else {
                           break loop;
                        }
                     }

                     loop2: for (scalerev = -1; scalerev > (-(positions.length - 1)); scalerev--) {
                        potentialcase = positions.filter(box => (box.x[0] == obj.x[0] + scalerev) && (box.y[0] == obj.y[0] + scalerev) && (box.colour == obj.colour));
                        if ((potentialcase).length > 0) {
                           myCases.push(potentialcase[0]);
                        } else {
                           break loop2;
                        }
                     }

                     cleaned = check_remove_clean(myCases);
                     break;

                  /* cases one column left */

                  case obj.x[0] - 1:
                     loop: for (scale = 1; scale < positions.length - 1; scale++) {
                        potentialcase = positions.filter(box => (box.y[0] == obj.y[0] - scale) && (box.x[0] == obj.x[0] + scale) && (box.colour == obj.colour));
                        if ((potentialcase).length > 0) {
                           myCases.push(potentialcase[0]);
                        } else {
                           break loop;
                        }
                     }

                     loop2: for (scalerev = -2; scalerev > (-(positions.length)); scalerev--) {
                        potentialcase = positions.filter(box => (box.x[0] == obj.x[0] + scalerev) && (box.y[0] == obj.y[0] + scalerev) && (box.colour == obj.colour));
                        if ((potentialcase).length > 0) {
                           myCases.push(potentialcase[0]);
                        } else {
                           break loop2;
                        }
                     }

                     cleaned = check_remove_clean(myCases);
                     break;
               }
               break;

            /* cases on the same row */

            case obj.y[0]:
               switch (closeObj[piece].x[0]) {
                  case obj.x[0] + 1:
                     loop: for (scale = 2; scale < positions.length; scale++) {
                        potentialcase = positions.filter(box => (box.y[0] == obj.y[0]) && (box.x[0] == obj.x[0] + scale) && (box.colour == obj.colour));
                        if ((potentialcase).length > 0) {
                           myCases.push(potentialcase[0]);
                        } else {
                           break loop;
                        }
                     }

                     loop2: for (scalerev = -1; scalerev > (-(positions.length - 1)); scalerev--) {
                        potentialcase = positions.filter(box => (box.x[0] == obj.x[0] + scalerev) && (box.y[0] == obj.y[0]) 
                        && (box.colour == obj.colour));
                        if ((potentialcase).length > 0) {
                           myCases.concat(potentialcase);
                        } else {
                           break loop2;
                        }
                     }

                     cleaned = check_remove_clean(myCases);
                     break;
               }
               
               break;
         }
         if (cleaned) {
            if (obj.colour == "#999999") {
               points += 3;
            } else {
               points += 1;
            }
            cleanobj = true;
            clean(closeObj[piece].id);
            $("#score").text("Score: " + points.toString());
            myCases.push(closeObj[piece]);
            afterCases.concat(realignBlocks(myCases));
         }
      }
   }
   if (cleanobj) {
      clean(obj.id);
      afterCases.concat(realignBlocks([obj]));
      recheckSpaces(afterCases);
   }
}

function clean(Id) {
   positions = positions.filter(obj => obj.id != Id);
   board.removeChild(document.getElementById(Id));
}

function check_remove_clean(arr) {
   if (arr.length == 0) {
      return false;
   }

   for (let ele = 0; ele < arr.length; ele++) {
      clean(ele.id);
   }
   return true;
}

function realignBlocks(identifiedBlocks) {
   let recheck = [];
   for (let moveDown = 0; moveDown < identifiedBlocks.length; moveDown++) {
      for (let blockAbove = 0; blockAbove < positions.length; 
         blockAbove++) {
         if (positions[blockAbove].y[0] <= identifiedBlocks[moveDown].y[0] &&
            positions[blockAbove].x[0] == identifiedBlocks[moveDown].x[0]) {
            moveOneDown(blockAbove);
            recheck.push(positions[blockAbove]);
         }
      }
   }
   return recheck;
}

function recheckSpaces(arr) {
   for (let checkNewBreaks = 0; checkNewBreaks < recheck.length; checkNewBreaks++) {
      checkSpaces(arr[checkNewBreaks]);
   }
}

function gameOver() {
   clearInterval(iteration);
   $(board).hide();
   $("#endContainer").show();
   board.remove();

   board = document.createElement('div');
   $(board).attr('id', "board");
   document.body.appendChild(board);

   positions = [];
   id = 0;
}