const appDiv = document.getElementById('app');

var config = {
    type: Phaser.AUTO,
    width: 900, //550       900
    height: 600, //450      600
    parent: appDiv,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var game = new Phaser.Game(config);
var GameFlag = false;


function preload() {
    this.load.image('platform', 'https://i.ibb.co/qYvxzRS/platform.png');
    this.load.image('background', 'https://i.ibb.co/TRfwKqm/background.png');
    this.load.image('box', 'https://i.ibb.co/6Fc8Tyr/box.png');
    this.load.image('enemy', 'https://i.ibb.co/k1t5P9N/spike-bomb.png');
    this.load.image('bullet', 'https://i.ibb.co/HrFNPdW/bullet.png');
    this.load.spritesheet('player', 'https://i.ibb.co/ryV5h8g/thebestchar.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('coin', 'https://i.ibb.co/FwJqcv8/coin.png', { frameWidth: 20, frameHeight: 20 });
    this.load.spritesheet('portal', 'https://i.ibb.co/XFrFBK2/portal.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    let back = this.add.tileSprite(0, 28, 900, 600, 'background'); //500/600
    back.setOrigin(0)
    back.setScrollFactor(0);
    this.cameras.main.setBounds(0, 0, 900, 600); 
    this.physics.world.setBounds(0, 0, 900, 600)

    player = this.physics.add.sprite(300, 450, 'player');
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);
    this.cameras.main.startFollow(player)

 
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
   
    this.anims.create({
        key: 'front',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'CoinSpin',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
   
    this.anims.create({
        key: 'PortalAnimation',
        frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 16 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    z = this.input.keyboard.addKey('Z');
    c = this.input.keyboard.addKey('C');
    x = this.input.keyboard.addKey('X');
    z = this.input.keyboard.addKey('Z');
    c = this.input.keyboard.addKey('C');
    space = this.input.keyboard.addKey('SPACE');
    enemies_ = 0;

    
    boxes = this.physics.add.staticGroup();
    boxes.create(0, 230, 'box');
    boxes.create(0, 530, 'box');
    boxes.create(100, 430, 'box');
    boxes.create(150, 430, 'box');
    boxes.create(240, 340, 'box');
    boxes.create(300, 190, 'box');
    boxes.create(400, 540, 'box');
    boxes.create(500, 140, 'box');
    boxes.create(600, 430, 'box');
    boxes.create(700, 490, 'box');
    boxes.create(850, 250, 'box');

    boxes.getChildren().forEach(c => c.setScale(0.5).setOrigin(0).refreshBody())

    this.physics.add.collider(player, boxes);

   
    portals = this.physics.add.group();
    portal = portals.create(870, 50, 'portal');
    portal.body.allowGravity = false;
    portal.body.immovable = true;
    portal.body.move = false;
    portal.anims.play('PortalAnimation');

    this.physics.add.overlap(player, portal, OpenPortal, null, this);

    
    function OpenPortal(player, portal) {
        if (coins.countActive(true) === 0) {
            VictoryText = this.add.text(25, 150, 'Victory\nYour time: ' + time + 's', { fontSize: '32px', fill: '#32CD32' });
            VictoryText.setScrollFactor(0, 0);
            this.physics.pause();
            player.setTint(0x32CD32);
            player.anims.play('turn');
            gameOver = true;
            GameFlag = true;
        }
    }

   
    platforms = this.physics.add.group();
    platforms.create(700, 350, 'platform');
    platforms.create(700, 160, 'platform');
    platforms.create(100, 160, 'platform');

    platforms.getChildren().forEach(function (platform) {
        platform.setCollideWorldBounds(true);
        platform.body.allowGravity = false;
        platform.body.immovable = true;
        platform.body.move = true;
        platform.setDisplaySize(100, 10);
        platform.setVelocityX(-150);
    }, this);

    this.physics.add.collider(platforms, boxes);
    this.physics.add.collider(player, platforms);

    player.body.immovable = false;

   
    coins = this.physics.add.staticGroup();
    coins.create(25, 500, 'coin');
    coins.create(25, 50, 'coin');
    coins.create(260, 315, 'coin');
    coins.create(520, 110, 'coin');
    coins.create(870, 570, 'coin');
    coins.create(500, 300, 'coin');
    coins.create(730, 460, 'coin');

    coins.getChildren().forEach(function (coin) {
        coin.anims.play('CoinSpin');
    }, this);
    this.physics.add.overlap(player, coins, collectCoin, null, this);

  
    enemies = this.physics.add.group();
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(enemies, boxes);
    this.physics.add.collider(player, enemies, emenyAttack, null, this);

    function emenyAttack(player, enemy) {
        GOText = this.add.text(25, 150, 'You only survived ' + time + 's.', { fontSize: '36px', fill: '#ff0000' });
        GOText.setScrollFactor(0, 0);

        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
        GameFlag = true;
    }

   
    bullets = this.physics.add.group();
    this.physics.add.collider(bullets, platforms);
    this.physics.add.collider(enemies, bullets, bulletAttack, null, this);
    this.physics.add.collider(bullets, boxes);
    this.physics.add.collider(bullets, platforms);

    function bulletAttack(enemy, bullet) {
        enemy.disableBody(true, true);
        enemies_++;
        EnemiesText.setText('Enemies Killed: ' + enemies_);
    }


   
    var score = 0;
    InstructionText = this.add.text(50, 500, 'Z, X, C to shoot and arrow keys to move', { fontSize: '16px', fill: '#AACCBB' });
    CoinText = this.add.text(25, 50, 'Coins: 0/7', { fontSize: '16px', fill: '#ffffff' });
    CoinText.setScrollFactor(0, 0);
    EnemiesText = this.add.text(25, 75, 'Enemies Kiled: 0', { fontSize: '16px', fill: '#ffffff' })
    EnemiesText.setScrollFactor(0, 0);


    
    function collectCoin(player, coin) {
        coin.disableBody(true, true);

        score += 1;
        CoinText.setText('Coins: ' + score + '/7');

        for (let i = 0; i < score; i++) {
            var enemy = enemies.create(0, 0, 'enemy');
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocity(100, 20);
            enemy.setScale(0.5, 0.5);
        }
    }

   
    stoper = this.time.addEvent({ delay: 1000, callback: PrintTime, callbackScope: this, loop: true });
    let time = 0;
    function PrintTime(stoper) {
        time++;
        if (time % 5 == 0) {
            var enemy = enemies.create(0, 0, 'enemy');
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocity(100, 20);
            enemy.setScale(0.5, 0.5);
        }
    }
}

function update() {
    
    if (cursors.left.isDown) {
        player.setVelocityX(-150);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(150);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('front');
    }

    if (cursors.up.isDown && (player.body.touching.down || player.body.onFloor())) {
        player.setVelocityY(-330);
    }


    
    if (this.input.keyboard.checkDown(z, 150) && x.isUp && c.isUp) {
        var bullet = bullets.create(player.x, player.y - 20, 'bullet');
        bullet.setScale(.3);
        bullet.setBounce(1);
        bullet.setCollideWorldBounds(false);
        bullet.setVelocity(-600, 0);

    }

    if (this.input.keyboard.checkDown(c, 150) && x.isUp && z.isUp) {
        var bullet = bullets.create(player.x, player.y - 20, 'bullet');
        bullet.setScale(.3);
        bullet.setBounce(1);
        bullet.setCollideWorldBounds(false);
        bullet.setVelocity(600, 0);

    }

    if (this.input.keyboard.checkDown(x, 150) && z.isUp && c.isUp) {
        var bullet = bullets.create(player.x - 10, player.y, 'bullet');
        bullet.setScale(.3);
        bullet.setBounce(1);
        bullet.setCollideWorldBounds(false);
        bullet.setVelocity(0, -1000);
    }

    bullets.getChildren().forEach(function (bullet) {
        if (bullet.body.touching.up ||
            bullet.body.touching.down ||
            bullet.body.touching.left || 
            bullet.body.touching.right || 
            bullet.x >= 900 || 
            bullet.x <= 0 || 
            bullet.y >= 600 || 
            bullet.y <= 0) {
                bullet.destroy();
        }
    })

    platforms.getChildren().forEach(function (platform) {
        
        if (platform.body.touching.up && player.body.touching.down) {
            player.body.x += platform.body.x - platform.body.prev.x;
        }

        
        if (platform.body.touching.left || platform.body.x == 0) {
            platform.setVelocityX(150);
        }
        if (platform.body.touching.right || platform.body.x == 800) {
            platform.setVelocityX(-150);
        }
    }, this);

    
    if (this.input.keyboard.checkDown(space, 50) && GameFlag) {
        GameFlag=false;
        this.scene.restart();
    }
}