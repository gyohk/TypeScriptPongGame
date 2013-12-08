module ponggame{
    export class Main {
        // Pong Game
        // Developed by Daniel Albu
        stage: createjs.Stage;
        queue: createjs.LoadQueue;
        assets: Object = {};
        stageScale: number = 1;

        // Views
        stageContainer: createjs.Container;
        titleView: createjs.Container;
        stageBg: createjs.Shape;

        //[Score]
        playerScore: createjs.Text; //The main player score
        cpuScore: createjs.Text; //The CPU score
        cpuSpeed: number = 6; //The speed of the CPU paddle, the faster it is the harder the game is

        // Variables
        xSpeed: number = 8;
        ySpeed: number = 8;

        //preloader
        preloader: createjs.LoadQueue;
        manifest: Object[];
        totalLoaded = 0;

        constructor(canvas: HTMLElement) {
            this.stage = new createjs.Stage(canvas);
            this.stage.mouseEnabled = true;

            // 表示用のコンテナを作成
            this.stageContainer = new createjs.Container();
            this.stageBg = new createjs.Shape();
            var g = this.stageBg.graphics;
            g.beginFill("#660000"); // 黒で塗りつぶす
            g.drawRect(0, 0, 480, 320); // (開始座標点X, 開始座標点Y, 終了座標点X, 終了座標点Y)
            g.endFill(); // 塗りつぶしをやめる
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

        handleTick = (event: createjs.Event): void => {
            this.stage.update();
        }

        handleProgress = (event: createjs.Event): void => {
            //use event.loaded to get the percentage of the loading
        }

        handleComplete = (event: createjs.Event): void => {

        }

        handleFileLoad = (event: createjs.Event): void => {
            switch (event.item.type) {
                case createjs.LoadQueue.IMAGE:
                    //image loaded
                    var img: HTMLImageElement = new Image();
                    img.src = event.item.src;
                    img.addEventListener("load", (e: Event) => { this.handleLoadComplete(); });
                    var item_id: string = String(event.item.id);
                    this.assets[item_id] = new createjs.Bitmap(img);
                    break;
                case createjs.LoadQueue.SOUND:
                    //sound loaded
                    this.handleLoadComplete();
                    break;
                default:
                    console.log("default");
                    break;
            }
        }

        handleLoadComplete = (): void => {
            this.totalLoaded++;
            if (this.manifest.length == this.totalLoaded) {
                this.queue.removeEventListener("progress", this.handleProgress);
                this.queue.removeEventListener("complete", this.handleComplete);
                this.queue.removeEventListener("fileload", this.handleFileLoad);
                this.addTitleView();
            }
        }

        // Add Title View Function
        addTitleView = (): void => {
            this.assets["startB"].x = 240 - 31.5;
            this.assets["startB"].y = 160;
            this.assets["startB"].name = 'startB';
            this.assets["creditsB"].x = 241 - 42;
            this.assets["creditsB"].y = 200;

            this.titleView.addChild(this.assets["main"], this.assets["startB"], this.assets["creditsB"]);
            this.stageContainer.addChild(this.assets["bg"], this.titleView);

            // Button Listeners
            this.assets["startB"].addEventListener("click", (e: createjs.Event) => { this.tweenTitleView(); });
            this.assets["creditsB"].addEventListener("click", this.showCredits);
        }

        showCredits = (e: createjs.Event): void => {
            // Show Credits
            this.assets["creditsB"].removeEventListener("click", this.showCredits);
            this.assets["credits"].x = 480;
            this.stageContainer.addChild(this.assets["credits"]);

            createjs.Tween.get(this.assets["credits"]).to({ x: 0 }, 300);
            this.assets["credits"].addEventListener("click", this.hideCredits);
        }

        // Hide Credits
        hideCredits = (e: createjs.Event): void => {
            this.assets["credits"].removeEventListener("click", this.hideCredits);
            createjs.Tween.get(this.assets["credits"]).to({ x: 480 }, 300).call(() => {
                this.stageContainer.removeChild(this.assets["credits"]);
                this.assets["creditsB"].addEventListener("click", this.showCredits);
            });
        }

        // Tween Title View
        tweenTitleView = (): void => {
            // Start Game
            createjs.Tween.get(this.titleView).to({ y: -320 }, 300).call(() => { this.addGameView(); });
        }

        // Add Game View
        addGameView = (): void => {
            console.log("add game view");

            // Destroy Menu & Credits screen
            this.stageContainer.removeChild(this.titleView);
            this.titleView = null;
            this.assets["credits"] = null;

            // Add Game View
            this.assets["player"].x = 2;
            this.assets["player"].y = 160 - 37.5;
            this.assets["cpu"].x = 480 - 25;
            this.assets["cpu"].y = 160 - 37.5;
            this.assets["ball"].x = 240 - 15;
            this.assets["ball"].y = 160 - 15;

            // Score
            this.playerScore = new createjs.Text('0', 'bold 20px Arial', '#A3FF24');
            this.playerScore.x = 211;
            this.playerScore.y = 20;

            this.cpuScore = new createjs.Text('0', 'bold 20px Arial', '#A3FF24');
            this.cpuScore.x = 262;
            this.cpuScore.y = 20;

            this.stageContainer.addChild(this.playerScore, this.cpuScore, this.assets["player"], this.assets["cpu"], this.assets["ball"]);

            // Start Listener 
            this.assets["bg"].addEventListener("pressup", this.startGame);
        }

        // Start Game Function
        startGame = (e: createjs.Event): void => {
            this.assets["bg"].removeEventListener("pressup", this.startGame);
            this.stage.addEventListener("stagemousemove", this.movePaddle);
            createjs.Ticker.addEventListener("tick", this.update);
        }

        // Player Movement
        movePaddle = (event: createjs.MouseEvent): void => {
            // Mouse Movement
            var newy = (event.stageY - this.stageContainer.y) / this.stageScale - 40;
            if (newy > 245) {
                newy = 245;
            } else if (newy < 0) {
                newy = 0;
            }
            this.assets["player"].y = newy;
        }

        /* Reset */
        reset = () => {
            this.assets["ball"].x = 240 - 15;
            this.assets["ball"].y = 160 - 15;
            this.assets["player"].y = 160 - 37.5;
            this.assets["cpu"].y = 160 - 37.5;

            this.stage.removeEventListener("stagemousemove", this.movePaddle);
            createjs.Ticker.removeEventListener("tick", this.update);
            this.assets["bg"].addEventListener("pressup", this.startGame);
        }

        // Update Function
        update = (e: Event): void => {
            // Ball Movement 
            this.assets["ball"].x = this.assets["ball"].x + this.xSpeed;
            this.assets["ball"].y = this.assets["ball"].y + this.ySpeed;

            // Cpu Movement
            if ((this.assets["cpu"].y + 32) < (this.assets["ball"].y - 14)) {
                this.assets["cpu"].y = this.assets["cpu"].y + this.cpuSpeed;
            }
            else if ((this.assets["cpu"].y + 32) > (this.assets["ball"].y + 14)) {
                this.assets["cpu"].y = this.assets["cpu"].y - this.cpuSpeed;
            }

            // Wall Collision 
            if ((this.assets["ball"].y) < 0) { this.ySpeed = -this.ySpeed; createjs.Sound.play('wall'); };//Up
            if ((this.assets["ball"].y + (30)) > 320) { this.ySpeed = -this.ySpeed; createjs.Sound.play('wall'); };//down

            // CPU Score
            if ((this.assets["ball"].x) < 0) {
                this.xSpeed = -this.xSpeed;
                this.cpuScore.text = (parseInt(this.cpuScore.text) + 1).toString();
                this.reset();
                createjs.Sound.play('enemyScore');
            }

            // Player Score
            if ((this.assets["ball"].x + (30)) > 480) {
                this.xSpeed = -this.xSpeed;
                this.playerScore.text = (parseInt(this.playerScore.text) + 1).toString();
                this.reset();
                createjs.Sound.play('playerScore');
            }

            // Cpu collision
            if (this.assets["ball"].x + 25 > this.assets["cpu"].x &&
                this.assets["ball"].x + 25 < this.assets["cpu"].x + 15 &&
                this.assets["ball"].y >= this.assets["cpu"].y - 5 &&
                this.assets["ball"].y < this.assets["cpu"].y + 80) {
                this.assets["ball"].x = this.assets["cpu"].x - 25;
                this.xSpeed *= -1;

                createjs.Sound.play('hit');
            }

            // Player collision
            if (this.assets["ball"].x <= this.assets["player"].x + 15 &&
                this.assets["ball"].x > this.assets["player"].x &&
                this.assets["ball"].y >= this.assets["player"].y - 5 &&
                this.assets["ball"].y < this.assets["player"].y + 80) {
                this.assets["ball"].x = this.assets["player"].x + 15;
                this.xSpeed *= -1;
                createjs.Sound.play('hit');
            }

            // Stop Paddle from going out of canvas
            if (this.assets["player"].y >= 249) {
                this.assets["player"].y = 249;
            }

            // Check for Win
            if (this.playerScore.text == '3') {
                this.alerts('win');
            }

            // Check for Game Over
            if (this.cpuScore.text == '3') {
                this.alerts('lose');
            }
        }

        restartGame = (): void => {
            this.assets["bg"].removeEventListener("pressup", this.restartGame);

            this.cpuScore.text = "0";
            this.playerScore.text = "0";

            if (this.stageContainer.contains(this.assets["win"])) {
                this.stageContainer.removeChild(this.assets["win"])
        }
            if (this.stageContainer.contains(this.assets["lose"])) {
                this.stageContainer.removeChild(this.assets["lose"])
        }

            this.reset();
        }

        alerts = (state: string): void => {
            this.stage.removeEventListener("stagemousemove", this.movePaddle);
            createjs.Ticker.removeEventListener("tick", this.update);

            if (state == 'win') {
                this.assets["win"].x = 140;
                this.assets["win"].y = -90;

                this.stageContainer.addChild(this.assets["win"]);
                createjs.Tween.get(this.assets["win"]).to({ y: 115 }, 300);
            }
            else {
                this.assets["lose"].x = 140;
                this.assets["lose"].y = -90;

                this.stageContainer.addChild(this.assets["lose"]);
                createjs.Tween.get(this.assets["lose"]).to({ y: 115 }, 300);
            }

            this.assets["bg"].addEventListener("pressup", this.restartGame);

        }

        setStageScale = (scale: number): void => {
            this.stageScale = scale;
            this.stage.scaleX = this.stageScale;
            this.stage.scaleY = this.stageScale;
        }

        setStagePosition = (new_w: number, new_h: number): void => {
            this.stage.setBounds(0, 0, new_w, new_h);
            this.stageContainer.x = Math.ceil((new_w - 480) / 2);
            this.stageContainer.y = Math.ceil((new_h - 320) / 2);

            var g = this.stageBg.graphics;
            g.beginFill("#660000"); // 黒で塗りつぶす
            g.drawRect(0, 0, new_w, new_h); // (開始座標点X, 開始座標点Y, 終了座標点X, 終了座標点Y)
            g.endFill(); // 塗りつぶしをやめる
        }
    }
}