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

function makeTwigs(n, t) {
    var images = [];
    for (var i = 0; i<n; i++) {
        var x = game.config.width / 3//randRange(0, game.config.width);
        var y = game.config.height / 3 //randRange(0, game.config.height);
        x += sticks.length * 100;

        var image = t.add.image(x, y, 'basic_png_twig').setInteractive();
        //image.setScale(1/5, 1/5);
        image.setAngle(0);//randRange(-15, 15));

        t.input.setDraggable(image);

        images.push(image);
    }
    return images;
}

var gameObj;
var sticks = [];

function createStick() {
    sticks = sticks.concat(makeTwigs(1, gameObj));
}

function clearSticks() {
    for (var i = 0; i < sticks.length; i++) {
        var s = sticks[i];
        s.destroy();
    }
    sticks = [];
}

function create() {
    gameObj = this;
    //var images = makeTwigs(20, this);

    this.input.on('dragstart', function (pointer, gameObject) {

        this.children.bringToTop(gameObject);

    }, this);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });

}
