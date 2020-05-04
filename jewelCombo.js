/* check if there is a matching combination */

function checkBreaker(obj) {
   if (obj.y[0] >= 11 || (positions.filter
      (proximity => (proximity.y[0] == (obj.y[0] + 1)) && (proximity.x[0] == obj.x[0]))).length != 0) {

      if ((positions.filter(gameOver => (gameOver.y[0] == obj.y[0]) && (gameOver.x[0] == obj.x[0]) && (obj.y[0] <= 3))).length > 1) {
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

/* work with said matching combinations */

function checkSpaces(obj) {
   let myCases = [];
   let potentialcase;
   let afterCases = [];
   let blocksToBeRealigned = [];
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
                     loop: for (scale = 2; scale < positions.length - 1; scale++) {
                        potentialcase = positions.filter(box => (box.y[0] == obj.y[0] + scale) && (box.x[0] == obj.x[0] - scale) && (box.colour == obj.colour));
                        if ((potentialcase).length > 0) {
                           myCases.push(potentialcase[0]);
                        } else {
                           break loop;
                        }
                     }

                     loop2: for (scalerev = -1; scalerev > (-(positions.length)); scalerev--) {
                        potentialcase = positions.filter(box => (box.x[0] == obj.x[0] - scalerev) && (box.y[0] == obj.y[0] + scalerev) && (box.colour == obj.colour));
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
                           myCases.push(potentialcase[0]);
                        } else {
                           break loop2;
                        }
                     }

                     cleaned = check_remove_clean(myCases);
                     break;
                  
                  case obj.x[0] - 1:
                     loop: for (scale = 2; scale < positions.length; scale++) {
                        potentialcase = positions.filter(box => (box.y[0] == obj.y[0]) && (box.x[0] == obj.x[0] - scale) && (box.colour == obj.colour));
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
                           myCases.push(potentialcase[0]);
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
            blocksToBeRealigned = blocksToBeRealigned.concat(myCases);
            myCases = [];
         }
         cleaned = false;
      }
   }
   if (cleanobj) {
      clean(obj.id);
      blocksToBeRealigned.push(obj);
      afterCases = afterCases.concat(realignBlocks(blocksToBeRealigned, obj));
      recheckSpaces(afterCases);
   }
}