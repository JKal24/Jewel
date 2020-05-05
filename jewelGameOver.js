function gameOver() {
   clearInterval(iteration);
   $(board).hide();
   $("#endContainer").show();
   $(board).remove();

   board = document.createElement('div');
   $(board).attr('id', "board");
   document.body.appendChild(board);

   positions = [];
   id = 0;
}