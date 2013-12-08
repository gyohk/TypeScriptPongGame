/// <reference path="./lib/jquery/jquery.d.ts" />
/// <reference path="./lib/createjs/createjs.d.ts" />
/// <reference path="./lib/easeljs/easeljs.d.ts" />
/// <reference path="./lib/tweenjs/tweenjs.d.ts" />
/// <reference path="./lib/soundjs/soundjs.d.ts" />
/// <reference path="./lib/preloadjs/preloadjs.d.ts" />
/// <reference path="./ponggame/Main.ts" />

var main: ponggame.Main;

$(document).ready(function () {
    var el: HTMLElement = document.getElementById('PongStage');
    main = new ponggame.Main(el);
    fixPosition();
});
$(window).resize(function(){
    fixPosition();
});

function fixPosition(){
    var w: number = $("#container").innerWidth();
    var h: number = $("#container").innerHeight();

    main.setStagePosition(w, h);
    $("#PongStage").attr({ width: w });
    $("#PongStage").attr({ height: h });

}
