// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"game.js":[function(require,module,exports) {
var appDiv = document.getElementById('app');
var config = {
  type: Phaser.AUTO,
  width: 900,
  //550       900->Aby było widać wszystko
  height: 600,
  //450      600->Aby bylo widać wszystko
  parent: appDiv,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 500
      },
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
  this.load.spritesheet('player', 'https://i.ibb.co/ryV5h8g/thebestchar.png', {
    frameWidth: 32,
    frameHeight: 48
  });
  this.load.spritesheet('coin', 'https://i.ibb.co/FwJqcv8/coin.png', {
    frameWidth: 20,
    frameHeight: 20
  });
  this.load.spritesheet('portal', 'https://i.ibb.co/XFrFBK2/portal.png', {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  var back = this.add.tileSprite(0, 28, 900, 600, 'background'); //500/600

  back.setOrigin(0);
  back.setScrollFactor(0);
  this.cameras.main.setBounds(0, 0, 900, 600); //ZAKRES KAMERY

  this.physics.world.setBounds(0, 0, 900, 600);
  player = this.physics.add.sprite(300, 450, 'player');
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);
  this.cameras.main.startFollow(player); //CHODZENIE W LEWO

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  }); //STANIE W MIEJSCU

  this.anims.create({
    key: 'front',
    frames: [{
      key: 'player',
      frame: 4
    }],
    frameRate: 20
  }); //CHODZENIE W PRAWO

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  }); //KRĘCENIE SIĘ MONETY

  this.anims.create({
    key: 'CoinSpin',
    frames: this.anims.generateFrameNumbers('coin', {
      start: 0,
      end: 5
    }),
    frameRate: 10,
    repeat: -1
  }); //ANIMACJA PORTALU

  this.anims.create({
    key: 'PortalAnimation',
    frames: this.anims.generateFrameNumbers('portal', {
      start: 0,
      end: 16
    }),
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
  enemies_ = 0; //SKRZYNKI

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
  boxes.getChildren().forEach(function (c) {
    return c.setScale(0.5).setOrigin(0).refreshBody();
  });
  this.physics.add.collider(player, boxes); //PORTAL

  portals = this.physics.add.group();
  portal = portals.create(870, 50, 'portal');
  portal.body.allowGravity = false;
  portal.body.immovable = true;
  portal.body.move = false;
  portal.anims.play('PortalAnimation');
  this.physics.add.overlap(player, portal, OpenPortal, null, this); //GDY GRACZ ZDERZY SIĘ Z PORTALEM

  function OpenPortal(player, portal) {
    if (coins.countActive(true) === 0) {
      VictoryText = this.add.text(25, 150, 'Victory\nYour time: ' + time + 's', {
        fontSize: '32px',
        fill: '#32CD32'
      });
      VictoryText.setScrollFactor(0, 0);
      this.physics.pause();
      player.setTint(0x32CD32);
      player.anims.play('turn');
      gameOver = true;
      GameFlag = true;
    }
  } //PLATFORMY


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
  player.body.immovable = false; //MONETY

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
  this.physics.add.overlap(player, coins, collectCoin, null, this); //ENEMIES

  enemies = this.physics.add.group();
  this.physics.add.collider(enemies, platforms);
  this.physics.add.collider(enemies, boxes);
  this.physics.add.collider(player, enemies, emenyAttack, null, this);

  function emenyAttack(player, enemy) {
    GOText = this.add.text(25, 150, 'You only survived ' + time + 's.', {
      fontSize: '36px',
      fill: '#ff0000'
    });
    GOText.setScrollFactor(0, 0);
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    GameFlag = true;
  } //BULLETS


  bullets = this.physics.add.group();
  this.physics.add.collider(bullets, platforms);
  this.physics.add.collider(enemies, bullets, bulletAttack, null, this);
  this.physics.add.collider(bullets, boxes);
  this.physics.add.collider(bullets, platforms);

  function bulletAttack(enemy, bullet) {
    enemy.disableBody(true, true);
    enemies_++;
    EnemiesText.setText('Enemies Killed: ' + enemies_);
  } //WYNIK 


  var score = 0;
  InstructionText = this.add.text(50, 500, 'Z, X, C to shoot and arrow keys to move', {
    fontSize: '16px',
    fill: '#AACCBB'
  });
  CoinText = this.add.text(25, 50, 'Coins: 0/7', {
    fontSize: '16px',
    fill: '#ffffff'
  });
  CoinText.setScrollFactor(0, 0);
  EnemiesText = this.add.text(25, 75, 'Enemies Kiled: 0', {
    fontSize: '16px',
    fill: '#ffffff'
  });
  EnemiesText.setScrollFactor(0, 0); //GDY GRACZ ZDERZY SIĘ Z MONETĄ

  function collectCoin(player, coin) {
    coin.disableBody(true, true);
    score += 1;
    CoinText.setText('Coins: ' + score + '/7');

    for (var i = 0; i < score; i++) {
      var enemy = enemies.create(0, 0, 'enemy');
      enemy.setBounce(1);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocity(100, 20);
      enemy.setScale(0.5, 0.5);
    }
  } //STOPER


  stoper = this.time.addEvent({
    delay: 1000,
    callback: PrintTime,
    callbackScope: this,
    loop: true
  });
  var time = 0;

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
  //STEROWANIE GRACZA
  if (cursors.left.isDown) {
    player.setVelocityX(-150);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(150);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('front');
  }

  if (cursors.up.isDown && (player.body.touching.down || player.body.onFloor())) {
    player.setVelocityY(-330);
  } //STRZELANIE


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
  } //KASOWANIE POCISKÓW


  bullets.getChildren().forEach(function (bullet) {
    if (bullet.body.touching.up || bullet.body.touching.down || bullet.body.touching.left || bullet.body.touching.right || bullet.x >= 900 || bullet.x <= 0 || bullet.y >= 600 || bullet.y <= 0) {
      bullet.destroy();
    }
  }); //CZARY MARY DLA KAŻDEJ PLATFORMY

  platforms.getChildren().forEach(function (platform) {
    //AKTUALIZACJA POZYCJI GRACZA GDY JEST NA PLATFORMIE
    if (platform.body.touching.up && player.body.touching.down) {
      player.body.x += platform.body.x - platform.body.prev.x;
    } //ZMIANA KIERUNKU RUCHU PO NATRAFIENIU NA PRZESZKODĘ


    if (platform.body.touching.left || platform.body.x == 0) {
      platform.setVelocityX(150);
    }

    if (platform.body.touching.right || platform.body.x == 800) {
      platform.setVelocityX(-150);
    }
  }, this); //RESTART GRY

  if (this.input.keyboard.checkDown(space, 50) && GameFlag) {
    GameFlag = false;
    this.scene.restart();
  }
}
},{}],"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56357" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","game.js"], null)
//# sourceMappingURL=/game.7bbe06d5.js.map