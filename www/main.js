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
    this.load.image("basic_png_twig", "assets/stick.png")
}

function randRange(min, max) {
    return (max-min)*Math.random() + min;
}

function makeSticks(n, t) {
    var new_sticks = [];
    for (var i = 0; i<n; i++) {
        var x = game.config.width / 3//randRange(0, game.config.width);
        var y = game.config.height / 3 //randRange(0, game.config.height);
        x += sticks.length * 100;

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
var selected_sticks_indices = new Set();
var StickCounter = 1;
var BaseCounter = 1;
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
}

function loading() {
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
    loading();
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
    loading();
}

function lock() {
    if (Lock_unlock == "Lock") {
        Lock_unlock = "Unlock";
    } else {
        Lock_unlock = "Lock";
    }
    loading();
}