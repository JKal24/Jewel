function gameOver() {
   $(board).hide();
   $("#endContainer").show();
   $("#roundScore").text('Your score was: ' + points.toString());
   if (points > highestPoints) {
      highestPoints = points;
   }
   $("#bestScore").text('Highest score: ' + highestPoints.toString());
   $(board).html('');

   $("body").off("keydown");

   points = 0;
   positions = [];
   id = 0;
}