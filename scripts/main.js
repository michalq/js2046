$(document).ready(function(){
    var game = new G2048('g2048');
    game.setWidth(4); // Optional, default '4', grid width.
    game.setHeight(4); // Optional, default '4', grid height.
    game.setConsole(true); // Optional, default 'false', messages in browser console.
    game.setStopAt(2048); // Optional, default 2048.
    game.getView().setRowClass('line');  // Optional, default 'line'.
    game.getView().setFieldClass('field'); // Optional, default 'field'.
    game.init();

    game.getView().setOnAfterMove(function(g) {
        if (g.getGameStatus() == false) {
            $('.gameDetails .points').html('Game end with '+g.getPoints()+' points.');
            $('.gameDetails .points').addClass('gameOver');
        } else {
            $('.gameDetails .points').html(g.getPoints());
        }//end if
    });

    // Buttons control.
    $('.top').click(function(){ game.move(1); });
    $('.left').click(function(){ game.move(0); });
    $('.right').click(function(){ game.move(2); });
    $('.bottom').click(function(){ game.move(3); });
    // Keyboard control.
    $('html').keydown(function(e){
        switch (e.which) {
            case 37: game.move(0); break;
            case 38: game.move(1); break;
            case 39: game.move(2); break;
            case 40: game.move(3); break;
        }//end switch()
    });

});