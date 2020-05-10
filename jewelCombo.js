/* check if there is a matching combination */

function checkBreaker(obj) {
   if (obj.y[0] >= 14 || (positions.filter
      (proximity => (proximity.y[0] == (obj.y[0] + 1)) && (proximity.x[0] == obj.x[0]))).length != 0) {

      if ((positions.filter(gameOver => (gameOver.y[0] == obj.y[0]) && (gameOver.x[0] == obj.x[0]) && (obj.y[0] <= 3))).length > 1) {
         clearInterval(iteration);
         gameOver();
         return;
      }

      if ((positions.filter(myObj => myObj.colour == obj.colour)).length >= 3) {
         checkSpaces(obj);
      }
      intervalChange();
   }
}

/* work with said matching combinations */

function checkSpaces(obj) {
   let myCases = [];
   let afterCases = [];
   let blocksToBeRealigned = [];
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
                     myCases = myCases.concat(identify(0, -1, 0, 2, obj));
                     break;

                  /* cases one column right */
                  case obj.x[0] + 1:
                     myCases = myCases.concat(identify(-1, -1, 2, 2, obj));
                     break;

                  /* cases one column left */
                  case obj.x[0] - 1:
                     myCases = myCases.concat(identify(1, -1, -2, 2, obj));
                     break;
               }
               break;

            /* cases one row above */

            case obj.y[0] - 1:
               switch (closeObj[piece].x[0]) {

                  /* cases in the same column */
                  case obj.x[0]:
                     myCases = myCases.concat(identify(0, 1, 0, -2, obj));
                     break;

                  /* cases one column right */
                  case obj.x[0] + 1:
                     myCases = myCases.concat(identify(-1, 1, 2, -2, obj));
                     break;

                  /* cases one column left */
                  case obj.x[0] - 1:
                     myCases = myCases.concat(identify(1, 1, -2, -2, obj));
                     break;
               }
               break;

            /* cases on the same row */

            case obj.y[0]:
               switch (closeObj[piece].x[0]) {

                  /* cases one column right */
                  case obj.x[0] + 1:
                     myCases = myCases.concat(identify(-1, 0, 2, 0, obj));
                     break;

                  /* cases one column left */
                  case obj.x[0] - 1:
                     myCases = myCases.concat(identify(1, 0, -2, 0, obj));
                     break;

               }
               break;
         }
         if (myCases.length > 0) {
            if (obj.colour == "#999999") {
               points += 5;
            } else {
               points += 1;
            }
            cleanobj = true;
            clean(closeObj[piece].id);
            $("#score").text("Score: " + points.toString());
            myCases.push(closeObj[piece]);
            blocksToBeRealigned = blocksToBeRealigned.concat(myCases);
            myCases = [];
         }
      }
   }
   if (cleanobj) {
      clean(obj.id);
      blocksToBeRealigned.push(obj);
      afterCases = afterCases.concat(realignBlocks(blocksToBeRealigned, obj));
      recheckSpaces(afterCases);
   }
}

function identify(num1, num2, num3, num4, obj) {
   let cases = [];
   let potentialcase;

   loop: for (scale = 1; scale < positions.length - 2; scale++) {
      potentialcase = positions.filter(box => (box.x[0] == obj.x[0] + num1) && (box.y[0] == obj.y[0] + num2) && (box.colour == obj.colour));
      if ((potentialcase).length > 0) {
         cases.push(potentialcase[0]);
      } else {
         break loop;
      }

      num1 = increment(num1, scale);
      num2 = increment(num2, scale);
   }

   loop2: for (scalerev = 1; scalerev < (positions.length - 2); scalerev--) {
      potentialcase = positions.filter(box => (box.x[0] == obj.x[0] + num3) && (box.y[0] == obj.y[0] + num4) && (box.colour == obj.colour));
      if ((potentialcase).length > 0) {
         cases.push(potentialcase[0]);
      } else {
         break loop2;
      }

      num3 = increment(num3, scalerev);
      num4 = increment(num4, scalerev);
   }

   check_remove_clean(cases);

   return cases;
}

function increment(one, two) {
   if (one < 0) {
      one -= two;
   } else if (one > 0) {
      one += two;
   }
   return one;
}

function clean(Id) {
   board.removeChild(document.getElementById(Id));
   
   positions = positions.filter(obj => obj.id != Id);
}

function check_remove_clean(arr) {
   if (arr.length == 0) {
      return false;
   }

   for (let ele = 0; ele < arr.length; ele++) {
      clean(arr[ele].id);
   }
   return true;
}

function realignBlocks(identifiedBlocks, obj) {
   let recheck = [];
   for (let moveDown = 0; moveDown < identifiedBlocks.length; moveDown++) {
      for (let blockAbove = 0; blockAbove < positions.length; 
         blockAbove++) {
         if (positions[blockAbove].y[0] <= identifiedBlocks[moveDown].y[0] && positions[blockAbove].x[0] == identifiedBlocks[moveDown].x[0] 
         && positions[blockAbove].id != obj.id) {
            moveOneDown(blockAbove);
            recheck.push(positions[blockAbove]);
         }
      }
   }
   return recheck;
}

function recheckSpaces(arr) {
   for (let checkNewBreaks = 0; checkNewBreaks < arr.length; 
      checkNewBreaks++) {
      checkSpaces(arr[checkNewBreaks]);
   }
}