/**
 * Game 2048 in JavaScript.
 *
 * @author Michał Kutrzeba <kutrzeba.michal@gmail.com>
 *
 */

var G2048 = function(g2048Class)
{
    var self = this;

    var fields       = []; //[1024,1024,1024,1024,0,0,0,0,0,0,0,0,0,0,0,0];// game over: [8,2,8,16,2,128,2,128,4,8,16,4,8,2,32,2];
    var consoleOn    = false;
    var width        = 4;
    var height       = 4;
    var fieldsAmount = 16;
    var view         = new G2048.View(g2048Class, self);
    var points       = 0; //1604;
    var gameStatus   = true; // False if game was over.
    var stopAt       = 2048;

    /**
     * Setters.
     */
    this.setHeight  = function(h) { height = h; };
    this.setWidth   = function(w) { width = w; };
    this.setConsole = function(c) { consoleOn = c; };
    this.setStopAt  = function(s) { stopAt = s; };

    /**
     * Getters.
     */
    this.getWidth  = function() { return width; };
    this.getHeight = function() { return height; };
    this.getPoints = function() { return points; };
    this.getView   = function() { return view; };

    /**
     * Returns all empty fields.
     *
     * @return array
     */
    this.getEmptyFields = function() {
        var temp  = [];
        var power = 0;
        for (i = 0; i < fieldsAmount; i++) {
            if (fields[i] == 0) {
                temp.push(i);
            }//end if

        }//end for

        return temp;

    };//end getEmptyFields


    /**
     * Put on a random place random value.
     *
     * @return void
     */
    this.newValue = function() {
        var emptyFields = self.getEmptyFields();
        if (emptyFields.length != 0) {
            var randomField = Math.floor((Math.random() * (emptyFields.length)));
            var randomVal   = (Math.round(Math.random()) + 1) * 2;
            self.updateField(emptyFields[randomField], randomVal, true);

            if (consoleOn == true) {
                console.info('Putting new random value.', emptyFields);
                console.info('Random key:', randomField, 'Random empty key:', emptyFields[randomField], 'Random value', randomVal);
            }//end if

        } else {
            checkIfGameOver();
        }//end if

    };//end newValue()


    /**
     * Check whether its game over or its not.
     *
     * @return boolean True if game over.
     */
    var checkIfGameOver = function()
    {
        var emptyFields = self.getEmptyFields();
        if (emptyFields.length == 0
            && self.move(0, true) == false
            && self.move(1, true) == false
            && self.move(2, true) == false
            && self.move(3, true) == false
        ) {
            gameStatus = false;
            return true;

        } else {
            gameStatus = true;
            return false;

        }//end if

    }//end checkIfGameOver()


    /**
     * Returns game status.
     *
     * @return boolean False if game was over.
     */
    this.getGameStatus = function()
    {
        return gameStatus;

    }//end getGameStatus()


    /**
     * Move all blocks to a specific direction.
     *
     * @param  integer       direction
     * @param  boolean       test      If it is true then blocks don't move,
                                       but check if it's possible to move.
     * @return void|boolean
     */
    this.move = function(direction, test) {
        if (typeof test == 'undefined') test = false;
        if (gameStatus == false) {
            if (consoleOn == true && test == false) {
                console.info('Game end with '+ points +' points.');
            }//end if

            return false;
        }//end if

        var firstEmptyKey  = null,
            neighbourKey   = null,
            i              = 0, // Directional iterator.
            end            = 0, // 0 if end of line.
            directionalPos = {},
            fieldsAmount   = width * height,
            moved          = false; // flage wheter something changed.
            addition       = false; //flage. One addition on field on one move.
            // correct 2204 < 4400, incorrect 2204 < 8000

        for (var key = 0; key < fieldsAmount; key++) {
            directionalPos = swapPosition(direction, key);
            i              = directionalPos.i;
            end            = directionalPos.end;
            neighbourKey   = getNeighbour(direction, i);

            if (end == 0) {
                if (fields[i] == 0) {
                    firstEmptyKey = i;
                } else {
                    firstEmptyKey = null;
                }//end if

                addition = false;
                continue;
            }//end if

            if (fields[i] == 0) {
                if (null == firstEmptyKey) {
                    firstEmptyKey = i;
                }//end if

                continue;
            }//end if

            if (null != firstEmptyKey) {
                if (fields[i] != stopAt && addition == false && fields[i] == fields[getNeighbour(direction, firstEmptyKey)]) {
                    if (!test) {
                        points  += fields[i] * 2;
                        self.updateField(getNeighbour(direction, firstEmptyKey), fields[i] * 2);
                        self.updateField(i, 0);
                    } else {
                        return true;
                    }//end if

                    key           = swapPosition(direction, firstEmptyKey).i;
                    moved         = true;
                    addition      = true;
                    firstEmptyKey = null;
                    continue;
                } else {
                    if (!test) {
                        self.updateField(firstEmptyKey, fields[i]);
                        self.updateField(i, 0);
                    } else {
                        return true;
                    }//end if

                    key           = swapPosition(direction, firstEmptyKey).i;
                    moved         = true;
                    addition      = false;
                    firstEmptyKey = null;
                    continue;
                }//end if
            } else if (fields[i] != stopAt && fields[i] == fields[neighbourKey]) {
                if (!test) {
                    points  += fields[i] * 2;
                    self.updateField(neighbourKey, fields[i] * 2);
                    self.updateField(i, 0);
                } else {
                    return true;
                }//end if

                moved         = true;
                addition      = true;
                firstEmptyKey = i;
                continue;
            }//end if

        }//end for

        if (!test) {
            if (moved == true) {
                self.newValue();
            }//end if

            view.onAfterMove();
        } else {
            return false;
        }//end if

    };//end move()


    /**
     * Change position.
     * Normally its iterate for example from 0 to 15, but if we move upwards
     * then for field key 1, we get field number 4 according to direction.
     * When we move to left we iterate normally, right - iterates from last
     * field to one field, up and down we iterate vertically, so 0, 4, 8, ...
     * for up and 15, 11, 7, 3, 14, ... for down.
     */
    var swapPosition = function(direction, key)
    {
        var i;
        switch (direction) {
            case 0:
                i   = key;
                end = i%width;
            break;
            case 1:
                i   = ((key%height) * width) + Math.floor(key/height);
                end = 1;
                if (i < width && i >= 0) {
                    end = 0;
                }//end if
            break;
            case 2:
                i   = (fieldsAmount - 1) - key;
                end = (i+1)%width;
            break;
            case 3:
                i   = Math.abs(((key%height) * width) + Math.floor(key/height) - (fieldsAmount - 1));
                end = 1;
                if (i < height*width && i >= width*(height-1)) {
                    end = 0;
                }//end if
            break;

        }//end switch()

        return {'i': i, 'end': end};

    };//end toDirectionalPosition()


    /**
     * Returns prevous field acoordind to direction.
     *
     * @param integer direction ID of direction:
     *                          0 - left
     *                          1 - top
     *                          2 - right
     *                          3 - bottom
     * @param integer key       Key of the actual field.
     */
    var getNeighbour = function(direction, key)
    {
        if (direction == 0) {
            return key - 1;
        } else if (direction == 1) {
            return key - width;
        } else if (direction == 2) {
            return key + 1;
        } else if (direction == 3) {
            return key + width;
        }//end if


    };//end getNeighbour()


    /**
     * Updating field value.
     *
     * @param integer fieldKey
     * @param integer value
     */
    this.updateField = function(fieldKey, value, newOne)
    {
        fields[fieldKey] = value;
        view.updateField(fieldKey, value, newOne);

    };//end updateField()


    /**
     *
     */
   this.init = function() {
        fieldsAmount = width * height;
        view.init();

        for (var i = 0; i < fieldsAmount; i++) {
            fields.push(0);
        }//end for

        for (var i = 0; i < fieldsAmount; i++) {
            self.updateField(i, fields[i]);
        }//end for

        /*for (var i = 0; i < fieldsAmount; i++) {
            console.log(i, swapPosition(3, i).i);
        }//end for*/

        self.newValue();
        self.newValue();

    };

}//end G2048


G2048.View = function(g2048Class, oG2048) {
    var self = this;

    if (typeof g2048Class == 'undefined') g2048Class = 'g2048';
    var $fields       = [];
    var lineClass     = 'line';
    var fieldClass    = 'field';
    var g2048Selector = '';
    var lineSelector  = '';
    var fieldSelector = '';
    var afterMove     = '';

    /**
     * Setters.
     */
    this.setRowClass   = function(r) { lineClass = r; };
    this.setFieldClass = function(f) { fieldClass = f; };

    this.setOnAfterMove = function(fn) {
        afterMove = fn;
    }//end setOnAfterMove();


    this.onAfterMove = function()
    {
        afterMove(oG2048);

    }//end doAfterMove()


    this.updateField = function(fieldKey, value, newOne)
    {
        if (typeof newOne == 'undefined') newOne = false;
        if (value == 0 || isNaN(value)) {
            htmlValue = "&nbsp;";
        } else {
            htmlValue = value;
        }//end if

        $($fields[fieldKey]).html(htmlValue);
        $($fields[fieldKey]).removeClass('p0 p2 p4 p8 p16 p32 p64 p128 p256 p512 p1024 p2048');
        $($fields[fieldKey]).addClass('p'+value);
        if (newOne == true) {
            $($fields[fieldKey]).css('opacity', 0);
            $($fields[fieldKey]).animate({'opacity': 1}, 250);
        }//end if

    }//end updateField()


    /**
     * Drawing HTML board.
     */
    var drawBoard = function()
    {
        var $g2048 = $(g2048Selector);
        for (var i = 0; i < oG2048.getHeight(); i++) {
            $g2048.append('<div class="'+lineClass+'"></div>');

        }//end for

        var $lines = $(lineSelector);
        for (var i = 0; i < oG2048.getWidth(); i++) {
            $lines.append('<div class="'+fieldClass+'"></div>');
        }//end for

        $fields = $(fieldselector);
    };//end drawBoard()


    this.init = function()
    {
        g2048Selector = '.'+g2048Class;
        lineSelector  = g2048Selector+' .'+lineClass;
        fieldselector = g2048Selector+' .'+fieldClass;
        drawBoard();

    }//end init()

}//ed View()