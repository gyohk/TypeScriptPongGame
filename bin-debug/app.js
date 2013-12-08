/// <reference path="./lib/jquery/jquery.d.ts" />
/// <reference path="./lib/createjs/createjs.d.ts" />
/// <reference path="./lib/easeljs/easeljs.d.ts" />
/// <reference path="./lib/tweenjs/tweenjs.d.ts" />
/// <reference path="./lib/soundjs/soundjs.d.ts" />
/// <reference path="./lib/preloadjs/preloadjs.d.ts" />
/// <reference path="./ponggame/Main.ts" />
var main;

$(document).ready(function () {
    var el = document.getElementById('PongStage');
    main = new ponggame.Main(el);
    fixScale();
});
$(window).resize(function () {
    fixScale();
});

function fixScale() {
    var w = $("#wrapper").innerWidth();
    var h = $("#wrapper").innerHeight();
    $("#PongStage").attr({ width: w });
    $("#PongStage").attr({ height: h });

    var stagew = w / 480;
    var stageh = h / 320;

    if (w / 320 > h / 480) {
        main.setStageScale(stagew);
    } else {
        main.setStageScale(stageh);
    }
}
