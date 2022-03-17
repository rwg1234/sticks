const ZOOM_FACTOR = 10;

var config = {
    type: Phaser.AUTO,
    width: 703*ZOOM_FACTOR,
    height: 357*ZOOM_FACTOR,
    zoom: 1/ZOOM_FACTOR,
    backgroundColor: '#ffffff',
    scene: {
        preload: preload,
        create: create
    },
    parent: "canvasContainer"
};

var game = new Phaser.Game(config);


function preload() {
    // matchstick
    this.load.image("match", "assets/sprites/match.png");

    // boxes and stacks, for every base setting
    for (var i = 1; i <= 12; i++) {
        this.load.image("box_" + i, "assets/sprites/box_" + i + ".png");
        this.load.image("stack_" + i, "assets/sprites/stack_" + i + ".png");
    }
}

function randRange(min, max) {
    return (max-min)*Math.random() + min;
}

function makeBox(t) {
    // find average position of selected sticks
    var x_total = 0;
    var y_total = 0;
    var count = 0;
    for (var i = 0; i < sprites.length; i++) {
        if (selected_indices.has(i) && sprites[i].type == "stick") {
            x_total += sprites[i].image.x;
            y_total += sprites[i].image.y;
            count += 1;
        }
    }
    let x = x_total / count;
    let y = y_total / count;

    var new_box = new Sprite("box", x, y);
    sprites.push(new_box);
}

function makeStack(t) {
    // find average position of selected boxes
    var x_total = 0;
    var y_total = 0;
    var count = 0;
    for (var i = 0; i < sprites.length; i++) {
        if (selected_indices.has(i) && sprites[i].type == "box") {
            x_total += sprites[i].image.x;
            y_total += sprites[i].image.y;
            count += 1;
        }
    }
    let x = x_total / count;
    let y = y_total / count;

    var new_stack = new Sprite("stack", x, y);
    sprites.push(new_stack);
}

function makeStickHere(x, y) {
    var new_stick = Sprite("stick", x, y);
    sprites.push(new_stick);
}

var gameObj;
var sprites = [];
var selected_indices = new Set();
var StickCounter = 1;
var BaseCounter = 3;

class Sprite {
    constructor(type, x, y) {
        this.type = type;
        if (type == "stick") {
            var image = gameObj.add.image(x, y, 'match').setInteractive();
            gameObj.input.setDraggable(image)
            this.image = image;
        } else if (type == "box") {
            var image = gameObj.add.image(x, y, 'box_' + BaseCounter).setInteractive();
            gameObj.input.setDraggable(image);
            this.image = image;
        } else if (type == "stack") {
            var image = gameObj.add.image(x, y, 'stack_' + BaseCounter).setInteractive();
            gameObj.input.setDraggable(image);
            this.image = image;
        } else {
            console.log("tried to create a Sprite of type " + type);
        }
    }
}

function createSticks() {
    for (var i=0; i<StickCounter; i++){
		if (sprites.length > 175) {
			alert("You are trying to add too many things. You can only have hundred and seventy five things at one time on the white background.\nTry something with the current things to be able to add more.");
			break;
		}
        // sticks.push(makeSticks(1, gameObj)[0]);
        var placeable = false;
        var x;
        var y;
        while (!placeable) {
            var x = randRange(100, game.config.width-200);
            var y = randRange(100, game.config.height-100);
            placeable = true;
            for (var j = 0; j < sprites.length; j++) {
                if (sprites[j].image.getBounds().contains(x, y)) {
                    placeable = false;
                }
            }
        }
        let new_stick = new Sprite("stick", x, y);
        sprites.push(new_stick);
    }
}

function clearAll() {
    for (var i = 0; i < sprites.length; i++) {
        sprites[i].image.destroy();
    }
    sprites = [];
}

var is_dragging = false; // to differentiate between clicking and dragging
function create() {
    gameObj = this;
    //var images = makeTwigs(20, this);

    this.input.on('dragstart', function (pointer, gameObject) {

        this.children.bringToTop(gameObject);

    }, this);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        
        gameObject.x = dragX;
        gameObject.y = dragY;
        is_dragging = true;

    });

    this.input.on('gameobjectup', function(pointer, gameObject) {
        if (!is_dragging) {
            // first we need the index of the clicked sprite
            var i;
            for (var j = 0; j < sprites.length; j++) {
                if (sprites[j].image == gameObject) { i = j; }
            }
            if (selected_indices.has(i)) {
                // sprite is already selected
                selected_indices.delete(i); // remove from "selected" set
                sprites[i].image.clearTint(); // remove visual effect
            } else {
                // not currently selected
                selected_indices.add(i); // add to "selected" set
                sprites[i].image.setTint(0x75FFFF);
            }
        }
        is_dragging = false;
    });

}

function deleteSelected() {
    var new_sprites = [];
    for (var i = 0; i < sprites.length; i++) {
        if (selected_indices.has(i)) {
            // sprite is selected, so it gets deleted
            sprites[i].image.destroy();
            selected_indices.delete(i); // deselect its index
        } else {
            // sprite is not selected, so it gets kept
            new_sprites.push(sprites[i]);
        }
    }
    sprites = new_sprites; // keep the new array of sprites
}

function updateLabels() {
    document.getElementById("StickCounter").textContent = convert(StickCounter);
    document.getElementById("BaseCounter").textContent = convert(BaseCounter);
}
function incrementSticks(n) {
    StickCounter += n;
    if(StickCounter  < 1) {
        StickCounter = 1;
    }
    if(StickCounter > 99) {
        StickCounter = 99;
    }
    updateLabels();
}

function incrementBase(n) {
    // first check if there are any boxes or stacks
    var locked = false;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].type == "box" || sprites[i].type == "stack") {
            locked = true;
        }
    }

    if (!locked) {
        BaseCounter += n;
        if(BaseCounter <1 ) {
            BaseCounter = 1;
        }
        if(BaseCounter > 12) {
            BaseCounter = 12;
        }
    } else {
        alert("You cannot change the group size when there are boxes or stacks on the white background. \nTry having only sticks or nothing on the white background to be allowed to change the group size.");
    }
    updateLabels();
}

function groupSelected() {
    var num_selected_sticks = 0;
    var num_selected_boxes = 0;
    var num_selected_stacks = 0;
    for (var i = 0; i < sprites.length; i++) {
        if (selected_indices.has(i)) {
            if (sprites[i].type == "stick") {
                num_selected_sticks++;
            } else if (sprites[i].type == "box") {
                num_selected_boxes++;
            } else if (sprites[i].type == "stack") {
                num_selected_stacks++;
            }
        }
    }
    if (num_selected_sticks == BaseCounter && num_selected_boxes == 0 && num_selected_stacks == 0) {
        makeBox(gameObj);
        deleteSelected();
    } else if (num_selected_sticks == 0 && num_selected_boxes == BaseCounter && num_selected_stacks == 0) {
        makeStack(gameObj);
        deleteSelected();
	} else if (num_selected_stacks != 0) {
		alert("You can only group sticks or boxes, not stacks of boxes.\nTry deselecting any selected stacks and try again.");
	} else if (num_selected_sticks == 0 && num_selected_boxes == 0 && num_selected_stacks == 0) {
		alert("Nothing selected.\nTry selecting some things by clicking on them.");
    } else {
        //alert("You have to select " + convert(BaseCounter) + " sticks, or " + convert(BaseCounter) + " boxes to group them.");
		alert("You have selected the wrong number of things to group them.\nTry selecting a different amount of the same things and grupping them.");
    }
}

function ungroupSelected() {
    // first make the new sticks and boxes
    for (var i = 0; i < sprites.length; i++) {
        if (selected_indices.has(i)) {
            if (sprites[i].type == "box") {
                // make as many sticks as BaseCounter says
                for (var j = 0; j < BaseCounter; j++) {
                    let x = sprites[i].image.x + (Math.random()-0.5)*sprites[i].image.width;
                    let y = sprites[i].image.y + (Math.random()-0.5)*sprites[i].image.height;
                    var new_stick = new Sprite("stick", x, y);
                    sprites.push(new_stick);
                }
            } else if (sprites[i].type == "stack")  {
                // make as many boxes as BaseCounter says
                for (var j = 0; j < BaseCounter; j++) {
                    let x = sprites[i].image.x + (Math.random()-0.5)*sprites[i].image.width;
                    let y = sprites[i].image.y + (Math.random()-0.5)*sprites[i].image.height;
                    var new_box = new Sprite("box", x, y);
                    sprites.push(new_box);
                }
            }
        }
    }
    
    // then delete the old boxes/stacks
    var new_sprites = [];
    for (var i = 0; i < sprites.length; i++) {
        if (selected_indices.has(i) && (sprites[i].type == "box" || sprites[i].type == "stack")) {
            // box/stack is selected, so it gets deleted
            sprites[i].image.destroy();
            selected_indices.delete(i); // deselect its index
        } else {
            // sprite is not selected, so it gets kept
            new_sprites.push(sprites[i]);
        }
    }
    sprites = new_sprites; // keep the new array of sprites
}