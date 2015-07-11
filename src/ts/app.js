/// <reference path="tsd/bundle.d.ts" />
/// <reference path="tsd/chrome.serial.d.ts" />
/// <reference path="base.ts" />
/// <reference path="environment.ts" />
/// <reference path="road.ts" />
/// <reference path="character.ts" />
/// <reference path="score.ts" />
var RunningElderly;
(function (RunningElderly) {
    var scene;
    var camera;
    var renderer;
    var raycaster;
    var Game = (function () {
        function Game(domElem) {
            var _this = this;
            RunningElderly.loadResources();
            scene = new RunningElderly.REScene();
            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
            renderer = new THREE.WebGLRenderer({
                precision: "highp",
                antialias: true,
                alpha: true
            });
            raycaster = new THREE.Raycaster();
            renderer.setClearColor(0xffffff, 0);
            camera.position.y = 15;
            camera.position.z = 30;
            camera.lookAt(scene.position);
            renderer.setSize(1024, 768);
            this.bindTo(domElem);
            this.speed = 0.1;
            this.motion = "m";
            this.repeatCount = 1;
            this.stop = false;
            this.keyboard = new KeyboardState();
            this.serial = new RunningElderly.SerialState(function (str) {
                if (str.charAt(0) === "w") {
                    _this.speed = 0.1 + Math.min(3, parseInt(str.slice(2, str.length)) / 80);
                }
                else if (str.charAt(0) === "s") {
                    _this.motion = str.slice(2, str.length);
                }
            });
            this.environmentManager = new RunningElderly.EnvironmentManager(scene);
            this.roadManager = new RunningElderly.RoadManager(scene);
            this.characterManager = new RunningElderly.CharacterManager(scene, this.keyboard);
        }
        Game.prototype.bindTo = function (domElem) {
            domElem.appendChild(renderer.domElement);
        };
        Game.prototype.start = function () {
            this.counter = new ScoreCounter((document.getElementsByClassName("my-counter")[0]));
            this.render();
        };
        Game.prototype.restart = function () {
            this.stop = true;
            this.counter.reset();
            this.clear(scene);
            renderer.clear();
            this.speed = 0.1;
            this.motion = "m";
            this.repeatCount = 1;
            this.stop = false;
            RunningElderly.mode = "market";
            this.environmentManager = new RunningElderly.EnvironmentManager(scene);
            this.roadManager = new RunningElderly.RoadManager(scene);
            this.characterManager = new RunningElderly.CharacterManager(scene, this.keyboard);
            this.stop = false;
        };
        Game.prototype.clear = function (element) {
            var children = element.children;
            for (var i = children.length - 1; i >= 0; --i) {
                var child = children[i];
                this.clear(child);
                child.parent.remove(child);
            }
            ;
        };
        Game.prototype.render = function () {
            var _this = this;
            var id;
            if (!this.stop) {
                id = requestAnimationFrame(function () { return _this.render(); });
            }
            else {
                cancelAnimationFrame(id);
            }
            this.keyboard.update();
            this.environmentManager.animate();
            this.roadManager.animate(this.keyboard, this.speed);
            this.characterManager.keyboardAnimate(this.keyboard);
            this.characterManager.serialAnimate(this.motion);
            this.characterManager.removeCollidedObjs(this.roadManager.getAllObstacles(), this.counter);
            renderer.render(scene, camera);
        };
        return Game;
    })();
    RunningElderly.Game = Game;
})(RunningElderly || (RunningElderly = {}));
window.onload = function () {
    var game = new RunningElderly.Game(document.body);
    var btnRestart = document.getElementsByClassName("btn-restart")[0];
    btnRestart.onclick = function () {
        game.restart();
    };
    var videoElem = document.getElementById("intro-video");
    videoElem.addEventListener("ended", function (event) {
        game.start();
    }, false);
    var btnSkip = document.getElementsByClassName("btn-skip")[0];
    btnSkip.onclick = function (event) {
        document.body.removeChild(videoElem);
        btnSkip.parentNode.removeChild(btnSkip);
        game.start();
    };
};
