var ponggame;
(function (ponggame) {
    var Main = (function () {
        function Main(canvas) {
            var _this = this;
            this.assets = {};
            this.stageScale = 1;
            this.cpuSpeed = 6;
            // Variables
            this.xSpeed = 8;
            this.ySpeed = 8;
            this.totalLoaded = 0;
            this.handleTick = function (event) {
                _this.stage.update();
            };
            this.handleProgress = function (event) {
                //use event.loaded to get the percentage of the loading
            };
            this.handleComplete = function (event) {
            };
            this.handleFileLoad = function (event) {
                switch (event.item.type) {
                    case createjs.LoadQueue.IMAGE:
                        //image loaded
                        var img = new Image();
                        img.src = event.item.src;
                        img.addEventListener("load", function (e) {
                            _this.handleLoadComplete();
                        });
                        var item_id = String(event.item.id);
                        _this.assets[item_id] = new createjs.Bitmap(img);
                        break;
                    case createjs.LoadQueue.SOUND:
                        //sound loaded
                        _this.handleLoadComplete();
                        break;
                    default:
                        console.log("default");
                        break;
                }
            };
            this.handleLoadComplete = function () {
                _this.totalLoaded++;
                if (_this.manifest.length == _this.totalLoaded) {
                    _this.queue.removeEventListener("progress", _this.handleProgress);
                    _this.queue.removeEventListener("complete", _this.handleComplete);
                    _this.queue.removeEventListener("fileload", _this.handleFileLoad);
                    _this.addTitleView();
                }
            };
            // Add Title View Function
            this.addTitleView = function () {
                _this.assets["startB"].x = 240 - 31.5;
                _this.assets["startB"].y = 160;
                _this.assets["startB"].name = 'startB';
                _this.assets["creditsB"].x = 241 - 42;
                _this.assets["creditsB"].y = 200;

                _this.titleView.addChild(_this.assets["main"], _this.assets["startB"], _this.assets["creditsB"]);
                _this.stageContainer.addChild(_this.assets["bg"], _this.titleView);

                // Button Listeners
                _this.assets["startB"].addEventListener("click", function (e) {
                    _this.tweenTitleView();
                });
                _this.assets["creditsB"].addEventListener("click", _this.showCredits);
            };
            this.showCredits = function (e) {
                // Show Credits
                _this.assets["creditsB"].removeEventListener("click", _this.showCredits);
                _this.assets["credits"].x = 480;
                _this.stageContainer.addChild(_this.assets["credits"]);

                createjs.Tween.get(_this.assets["credits"]).to({ x: 0 }, 300);
                _this.assets["credits"].addEventListener("click", _this.hideCredits);
            };
            // Hide Credits
            this.hideCredits = function (e) {
                _this.assets["credits"].removeEventListener("click", _this.hideCredits);
                createjs.Tween.get(_this.assets["credits"]).to({ x: 480 }, 300).call(function () {
                    _this.stageContainer.removeChild(_this.assets["credits"]);
                    _this.assets["creditsB"].addEventListener("click", _this.showCredits);
                });
            };
            // Tween Title View
            this.tweenTitleView = function () {
                // Start Game
                createjs.Tween.get(_this.titleView).to({ y: -320 }, 300).call(function () {
                    _this.addGameView();
                });
            };
            // Add Game View
            this.addGameView = function () {
                console.log("add game view");

                // Destroy Menu & Credits screen
                _this.stageContainer.removeChild(_this.titleView);
                _this.titleView = null;
                _this.assets["credits"] = null;

                // Add Game View
                _this.assets["player"].x = 2;
                _this.assets["player"].y = 160 - 37.5;
                _this.assets["cpu"].x = 480 - 25;
                _this.assets["cpu"].y = 160 - 37.5;
                _this.assets["ball"].x = 240 - 15;
                _this.assets["ball"].y = 160 - 15;

                // Score
                _this.playerScore = new createjs.Text('0', 'bold 20px Arial', '#A3FF24');
                _this.playerScore.x = 211;
                _this.playerScore.y = 20;

                _this.cpuScore = new createjs.Text('0', 'bold 20px Arial', '#A3FF24');
                _this.cpuScore.x = 262;
                _this.cpuScore.y = 20;

                _this.stageContainer.addChild(_this.playerScore, _this.cpuScore, _this.assets["player"], _this.assets["cpu"], _this.assets["ball"]);

                // Start Listener
                _this.assets["bg"].addEventListener("pressup", _this.startGame);
            };
            // Start Game Function
            this.startGame = function (e) {
                _this.assets["bg"].removeEventListener("pressup", _this.startGame);
                _this.stage.addEventListener("stagemousemove", _this.movePaddle);
                createjs.Ticker.addEventListener("tick", _this.update);
            };
            // Player Movement
            this.movePaddle = function (event) {
                // Mouse Movement
                var newy = (event.stageY - _this.stageContainer.y) / _this.stageScale - 40;
                if (newy > 245) {
                    newy = 245;
                } else if (newy < 0) {
                    newy = 0;
                }
                _this.assets["player"].y = newy;
            };
            /* Reset */
            this.reset = function () {
                _this.assets["ball"].x = 240 - 15;
                _this.assets["ball"].y = 160 - 15;
                _this.assets["player"].y = 160 - 37.5;
                _this.assets["cpu"].y = 160 - 37.5;

                _this.stage.removeEventListener("stagemousemove", _this.movePaddle);
                createjs.Ticker.removeEventListener("tick", _this.update);
                _this.assets["bg"].addEventListener("pressup", _this.startGame);
            };
            // Update Function
            this.update = function (e) {
                // Ball Movement
                _this.assets["ball"].x = _this.assets["ball"].x + _this.xSpeed;
                _this.assets["ball"].y = _this.assets["ball"].y + _this.ySpeed;

                // Cpu Movement
                if ((_this.assets["cpu"].y + 32) < (_this.assets["ball"].y - 14)) {
                    _this.assets["cpu"].y = _this.assets["cpu"].y + _this.cpuSpeed;
                } else if ((_this.assets["cpu"].y + 32) > (_this.assets["ball"].y + 14)) {
                    _this.assets["cpu"].y = _this.assets["cpu"].y - _this.cpuSpeed;
                }

                // Wall Collision
                if ((_this.assets["ball"].y) < 0) {
                    _this.ySpeed = -_this.ySpeed;
                    createjs.Sound.play('wall');
                }
                ;
                if ((_this.assets["ball"].y + (30)) > 320) {
                    _this.ySpeed = -_this.ySpeed;
                    createjs.Sound.play('wall');
                }
                ;

                // CPU Score
                if ((_this.assets["ball"].x) < 0) {
                    _this.xSpeed = -_this.xSpeed;
                    _this.cpuScore.text = (parseInt(_this.cpuScore.text) + 1).toString();
                    _this.reset();
                    createjs.Sound.play('enemyScore');
                }

                // Player Score
                if ((_this.assets["ball"].x + (30)) > 480) {
                    _this.xSpeed = -_this.xSpeed;
                    _this.playerScore.text = (parseInt(_this.playerScore.text) + 1).toString();
                    _this.reset();
                    createjs.Sound.play('playerScore');
                }

                // Cpu collision
                if (_this.assets["ball"].x + 25 > _this.assets["cpu"].x && _this.assets["ball"].x + 25 < _this.assets["cpu"].x + 15 && _this.assets["ball"].y >= _this.assets["cpu"].y - 5 && _this.assets["ball"].y < _this.assets["cpu"].y + 80) {
                    _this.assets["ball"].x = _this.assets["cpu"].x - 25;
                    _this.xSpeed *= -1;

                    createjs.Sound.play('hit');
                }

                // Player collision
                if (_this.assets["ball"].x <= _this.assets["player"].x + 15 && _this.assets["ball"].x > _this.assets["player"].x && _this.assets["ball"].y >= _this.assets["player"].y - 5 && _this.assets["ball"].y < _this.assets["player"].y + 80) {
                    _this.assets["ball"].x = _this.assets["player"].x + 15;
                    _this.xSpeed *= -1;
                    createjs.Sound.play('hit');
                }

                // Stop Paddle from going out of canvas
                if (_this.assets["player"].y >= 249) {
                    _this.assets["player"].y = 249;
                }

                // Check for Win
                if (_this.playerScore.text == '3') {
                    _this.alerts('win');
                }

                // Check for Game Over
                if (_this.cpuScore.text == '3') {
                    _this.alerts('lose');
                }
            };
            this.restartGame = function () {
                _this.assets["bg"].removeEventListener("pressup", _this.restartGame);

                _this.cpuScore.text = "0";
                _this.playerScore.text = "0";

                if (_this.stageContainer.contains(_this.assets["win"])) {
                    _this.stageContainer.removeChild(_this.assets["win"]);
                }
                if (_this.stageContainer.contains(_this.assets["lose"])) {
                    _this.stageContainer.removeChild(_this.assets["lose"]);
                }

                _this.reset();
            };
            this.alerts = function (state) {
                _this.stage.removeEventListener("stagemousemove", _this.movePaddle);
                createjs.Ticker.removeEventListener("tick", _this.update);

                if (state == 'win') {
                    _this.assets["win"].x = 140;
                    _this.assets["win"].y = -90;

                    _this.stageContainer.addChild(_this.assets["win"]);
                    createjs.Tween.get(_this.assets["win"]).to({ y: 115 }, 300);
                } else {
                    _this.assets["lose"].x = 140;
                    _this.assets["lose"].y = -90;

                    _this.stageContainer.addChild(_this.assets["lose"]);
                    createjs.Tween.get(_this.assets["lose"]).to({ y: 115 }, 300);
                }

                _this.assets["bg"].addEventListener("pressup", _this.restartGame);
            };
            this.setStageScale = function (scale) {
                _this.stageScale = scale;
                _this.stage.scaleX = _this.stageScale;
                _this.stage.scaleY = _this.stageScale;
            };
            this.setStagePosition = function (new_w, new_h) {
                _this.stage.setBounds(0, 0, new_w, new_h);
                _this.stageContainer.x = Math.ceil((new_w - 480) / 2);
                _this.stageContainer.y = Math.ceil((new_h - 320) / 2);

                var g = _this.stageBg.graphics;
                g.beginFill("#660000"); // ���œh���Ԃ�
                g.drawRect(0, 0, new_w, new_h); // (�J�n���W�_X, �J�n���W�_Y, �I�����W�_X, �I�����W�_Y)
                g.endFill(); // �h���Ԃ������߂�
            };
            this.stage = new createjs.Stage(canvas);
            this.stage.mouseEnabled = true;

            // �\���p�̃R���e�i���쐬
            this.stageContainer = new createjs.Container();
            this.stageBg = new createjs.Shape();
            var g = this.stageBg.graphics;
            g.beginFill("#660000"); // ���œh���Ԃ�
            g.drawRect(0, 0, 480, 320); // (�J�n���W�_X, �J�n���W�_Y, �I�����W�_X, �I�����W�_Y)
            g.endFill(); // �h���Ԃ������߂�
            this.stage.addChild(this.stageBg);

            this.stage.addChild(this.stageContainer);
            this.titleView = new createjs.Container();

            /* Set The Flash Plugin for browsers that don't support SoundJS */
            createjs.FlashPlugin.BASE_PATH = "src/soundjs/";
            createjs.Sound.registerPlugins([
                createjs.WebAudioPlugin,
                createjs.HTMLAudioPlugin,
                createjs.FlashPlugin
            ]);

            this.manifest = [
                { src: "assets/bg.png", id: "bg" },
                { src: "assets/main.png", id: "main" },
                { src: "assets/startB.png", id: "startB" },
                { src: "assets/creditsB.png", id: "creditsB" },
                { src: "assets/credits.png", id: "credits" },
                { src: "assets/paddle.png", id: "cpu" },
                { src: "assets/paddle.png", id: "player" },
                { src: "assets/ball.png", id: "ball" },
                { src: "assets/win.png", id: "win" },
                { src: "assets/lose.png", id: "lose" },
                { src: "assets/playerScore.mp3|playerScore.ogg", id: "playerScore" },
                { src: "assets/enemyScore.mp3|enemyScore.ogg", id: "enemyScore" },
                { src: "assets/hit.mp3|assets/hit.ogg", id: "hit" },
                { src: "assets/wall.mp3|assets/wall.ogg", id: "wall" }
            ];

            this.queue = new createjs.LoadQueue(false);
            this.queue.installPlugin(createjs.Sound);
            this.queue.addEventListener("progress", this.handleProgress);
            this.queue.addEventListener("complete", this.handleComplete);
            this.queue.addEventListener("fileload", this.handleFileLoad);
            this.queue.loadManifest(this.manifest);

            /* Ticker */
            createjs.Ticker.setFPS(30);
            createjs.Ticker.addEventListener("tick", this.handleTick);
        }
        return Main;
    })();
    ponggame.Main = Main;
})(ponggame || (ponggame = {}));
