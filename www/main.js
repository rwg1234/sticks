var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#ffffff',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);


function preload() {
    this.load.image("basic_png_twig", "assets/stick.png");
    this.load.image("basic_png_box", "assets/box.png");
}

function randRange(min, max) {
    return (max-min)*Math.random() + min;
}

function makeBox(t) {
    var dist = game.config.width / 10;
    var x = game.config.width / 3 + (Math.random() - 0.5)*dist;
    var y = game.config.height / 3 + (Math.random() - 0.5)*dist;
    var image = t.add.image(x, y, 'basic_png_box').setInteractive();
    t.input.setDraggable(image);
    boxes.push(image);
}

function makeSticks(n, t) {
    var new_sticks = [];
    for (var i = 0; i<n; i++) {
        var x = game.config.width / 3//randRange(0, game.config.width);
        var y = game.config.height / 3 //randRange(0, game.config.height);
        x += (sticks.length + new_sticks.length) * 100;

        var image = t.add.image(x, y, 'basic_png_twig').setInteractive();
        //image.setScale(1/5, 1/5);
        image.setAngle(0);//randRange(-15, 15));

        t.input.setDraggable(image);

        new_sticks.push(image);

    }
    return new_sticks;
}

var gameObj;
var sticks = [];
var boxes = [];
var selected_sticks_indices = new Set();
var selected_boxes_indices = new Set();
var StickCounter = 1;
var BaseCounter = 3;
var Lock_unlock = "Lock";

function createSticks() {
    for (var i=0; i<StickCounter; i++){
        sticks.push(makeSticks(1, gameObj)[0]);
    }
}

function clearSticks() {
    for (var i = 0; i < sticks.length; i++) {
        var s = sticks[i];
        s.destroy();
    }
    sticks = [];
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
            if (sticks.includes(gameObject)) {
                // clicked object is a stick
                let i = sticks.indexOf(gameObject);
                if (selected_sticks_indices.has(i)) {
                    // stick is already selected
                    selected_sticks_indices.delete(i); // remove from "selected" set
                    sticks[i].clearTint(); // remove visual effect
                } else {
                    // not currently selected
                    selected_sticks_indices.add(i); // add to "selected" set
                    sticks[i].setTintFill(0x00FFFF); // add visual effect
                }
            } else if (boxes.includes(gameObject)) {
                // clicked object is a box
                let i = boxes.indexOf(gameObject);
                if (selected_boxes_indices.has(i)) {
                    // box is already selected
                    selected_boxes_indices.delete(i); // remove from "selected" set
                    boxes[i].clearTint(); // remove visual effect
                } else {
                    // not currently selected
                    selected_boxes_indices.add(i); // add to "selected" set
                    boxes[i].setTintFill(0x00FFFF); // add visual effect
                }
            }
        }
        is_dragging = false;
    });

}

function deleteSelected() {
    var new_sticks = [];
    for (var i = 0; i < sticks.length; i++) {
        if (selected_sticks_indices.has(i)) {
            // stick is selected, so it gets deleted
            sticks[i].destroy();
            selected_sticks_indices.delete(i); // deselect its index
        } else {
            // stick is not selected, so it gets kept
            new_sticks.push(sticks[i]);
        }
    }
    sticks = new_sticks; // keep the new array of sticks

    // now do the same for the boxes
    var new_boxes = [];
    for (var i = 0; i < boxes.length; i++) {
        if (selected_boxes_indices.has(i)) {
            // box is selected, so it gets deleted
            boxes[i].destroy();
            selected_boxes_indices.delete(i); // deselect its index
        } else {
            // box is not selected, so it gets kept
            new_boxes.push(boxes[i]);
        }
    }
    boxes = new_boxes; // keep the new array of boxes
}

function updateLabels() {
    document.getElementById("StickCounter").innerHTML = convert(StickCounter);
    document.getElementById("BaseCounter").innerHTML = convert(BaseCounter);
   // document.getElementById("StickCounter").innerHTML = StickCounter;
   // document.getElementById("BaseCounter").innerHTML = BaseCounter;
    document.getElementById("lock_unlock").innerHTML = Lock_unlock;
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
    if (Lock_unlock == "Lock") {
        BaseCounter += n;
        if(BaseCounter <1 ) {
            BaseCounter = 1;
        }
        if(BaseCounter > 12) {
            BaseCounter = 12;
        }
    }
    updateLabels();
}

function lock() {
    if (Lock_unlock == "Lock") {
        Lock_unlock = "Unlock";
    } else {
        Lock_unlock = "Lock";
    }
    updateLabels();
}

function groupSelected() {
    if (selected_sticks_indices.size == BaseCounter && selected_boxes_indices.size == 0) {
        deleteSelected();
        makeBox(gameObj);
    } else {
        alert("Wrong number of sticks");
    }
}

function ungroupSelected() {
    let number_of_new_sticks = selected_boxes_indices.size * BaseCounter;
    let backup_selected_sticks = selected_sticks_indices;
    selected_sticks_indices = new Set();
    deleteSelected();
    selected_sticks_indices = backup_selected_sticks;
    for(var i = 0; i < number_of_new_sticks; i++) {
        sticks.push(makeSticks(1, gameObj)[0]);
    }
}