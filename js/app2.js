define(['underscore', 'jquery', 'pjs', 'utl', 'utlx', 'pjsx'], function(_, $, $p, utl, utlx, $px){
	'use strict';

	var loopable = false;
	$('#loopSwitch').on('click', function(e){
		loopable = !loopable;
		(loopable) ? $p.loop() : $p.noLoop();
	});

	var CANVAS_WIDTH = 500;
	var CANVAS_HEIGTH = 500;

	var BACKGROUND_COLOR = 64;

  var MODE = { MODE_ADDABLE: 0, MODE_DRAGGABLE: 1 };
	var mode = MODE.ADDABLE;
	$('#modeSwitch').on('click', function(e){
		mode = ++mode % _.size(MODE);
		console.log('mode='+mode);
	});

	var objs = [];

	var omegaCreator = {
		MODE: {ANCHORS: 0, POINTS: 1}

		, init: function(){
			this.mode = this.MODE.ANCHORS;
			return this;
		}

		, as: []
		, addAnchor: function(x, y){
			console.log('x, y='+x+', '+y);
			this.as.push(utlx.fac.newGrabbable(x, y));
			if(this.as.length == 2){
				objs.push($px.fac.newOmega(this.as[0], this.as[1], {debug: true}));
				this.mode = this.MODE.POINTS;
				this.indexInObjs = objs.length - 1;
				this.as = [];
			}
			return this;
		}
		, indexInObjs: 0
		, addPoint: function(x, y){
			objs[this.indexInObjs].addPoint(x, y);
		}

		, add: function(x, y){

			switch(this.mode){
				case this.MODE.ANCHORS:
					this.addAnchor(x, y);
					break;
				case this.MODE.POINTS:
					this.addPoint(x, y);
					break;
				default:
					console.log('what a fucker');
					break;
			}
		}
	}.init();

	$('#canvas').on('dblclick', function(e){

		omegaCreator.add($p.mouseX, $p.mouseY);
	});

	var app = function(){

		$p.setup = function(){
			$p.size(CANVAS_WIDTH, CANVAS_HEIGTH);
			$p.frameRate(10);
		};

		var drawBackground = function(){
			$p.background(BACKGROUND_COLOR);

			$p.stroke(BACKGROUND_COLOR - 8);
			for(var i = 10; i < CANVAS_WIDTH; i += 10) $p.line(i, 0, i, CANVAS_HEIGTH);
			for(var i = 10; i < CANVAS_HEIGTH; i += 10) $p.line(0, i, CANVAS_HEIGTH, i);
		};

		$p.draw = function(){
			drawBackground();
			for(var i = 0; i < objs.length; i++) objs[i].update($p.mouseX, $p.mouseY).render();
		};

		$p.mousePressed = function(){
		};

		$p.mouseReleased = function(){
		};

		$p.setup();
	};

	return app;
});