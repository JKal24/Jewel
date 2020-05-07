function fadePieces(arr) {
   for (let fadebox = 0; fadebox < arr.length; fadebox++) {
      $("#" + arr[fadebox].id).fadeOut();
   }

   for (let removebox = 0; removebox < arr.length; removebox++) {
      board.removeChild(document.getElementById(arr[removebox].id));
   }

   intervalChange();
}