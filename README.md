2048 in JavaScript
========================

## Introduction
Hi! This is a simple script that can be easy implemented in any place of your site.
Main core of game is written in JavaScript but to integrate with DOM (G2048.View) uses jQuery FW.

And if you want to change something in view do it in class G2048.View().

## Running
### Files
To run the game you need two files, which is core of the game `./scripts/2048.js` and
jQuery `./scripts/jquery-2.1.3.min.js`.

### HTML
All you need in HTML is main block when the game grid will show. Default it is the box
with class `.g2048` but feel free if you want to change it!

````html
<main class="g2048"></main>
````

Besides this, you can put some control buttons, for example:
````html
<nav class="control">
    <button class="top">to up</button>
    <br>
    <button class="left">to left</button>
    <button class="right">to right</button>
    <br>
    <button class="bottom">to bottom</button>
</nav>
````

... and box where actual points will appear ...
````html
<section class="gameDetails">
    <div class="points">0</div>
</section>
````

**In file `./index.php` you will see every of this boxes**

### JavaScript
Minimal version with defaults options is just:
````js
$(document).ready(function(){
    var game = new G2048();
    game.init();
});
````

But if you want to implement buttons and keyboard control then this piece of code will be helpful:
````js
$(document).ready(function(){
    var game = new G2048();
    game.init();

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
````

Rest of the configurations you can see below, and this is actual `./scripts/main.js` file.
````js
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
````

### Contact
With any trouble you can always write to me directly kutrzeba.michal@gmail.com