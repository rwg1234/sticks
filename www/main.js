var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image("basic_png_twig", "https://cdn.pixabay.com/photo/2012/04/24/21/49/branch-41013_1280.png")
}

function randRange(min, max) {
    return (max-min)*Math.random() + min;
}

function makeTwigs(n, t) {
    var images = [];
    for (var i = 0; i<n; i++) {
        var x = randRange(0, game.config.width);
        var y = randRange(0, game.config.height);

        var image = t.add.image(x, y, 'basic_png_twig').setInteractive();
        image.setScale(1/5, 1/5);
        image.setAngle(randRange(60, 120));

        t.input.setDraggable(image);

        images.push(image);
    }
    return images;
}

function create() {
    var images = makeTwigs(20, this);

    this.input.on('dragstart', function (pointer, gameObject) {

        this.children.bringToTop(gameObject);

    }, this);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });

}
