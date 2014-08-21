define(['jquery', 'pjs', 'utl', 'utlx', 'pjsx'], function($, $p, utl, utlx, $px){
	'use strict';

	var CANVAS_WIDTH = 500;
	var CANVAS_HEIGTH = 500;

	var BACKGROUND_COLOR = 64;

	var LAYER_OMEGA_ANCHORS = 0
	var LAYER_OMEGA_POINTS = 1;
	var LAYER_OMEGA_POINTS_POINTS = 2;
	var layer = LAYER_OMEGA_ANCHORS;
	$('#switcher').on('click', function(e){ ++layer; });

	var loopable = false;
	$('#btn').click(function(){
		loopable = !loopable;
		(loopable) ? $p.loop() : $p.noLoop();
	});

	var app = function(){

		var omega, clay;

		$p.setup = function(){
			$p.size(CANVAS_WIDTH, CANVAS_HEIGTH);
			$p.frameRate(10);

			var end1 = utlx.fac.newGrabbable(100, 100);
			var end2 = utlx.fac.newGrabbable(400, 400);
			omega = $px.fac.newOmega(end1, end2, {debug: true});
			//omega = $px.fac.newOmega(end1, end2, {debug: true, bezier: true});
			for(var i = 1; i <= 3; i++){
				var x = 100 * i, y = 100 * i + 100;
				if(i == 2) y += i * i * 10;
				omega.addPoint(x, y);
			}

			var points = [];
			clay = $px.fac.newClay(350, 100, {debug: true});
			clay.addPoint(320, 60);
			clay.addPoint(390, 70);
			clay.addPoint(370, 130);
			clay.addPoint(300, 100);
		};

		var drawBackground = function(){
			$p.background(BACKGROUND_COLOR);

			$p.stroke(BACKGROUND_COLOR - 8);
			for(var i = 10; i < CANVAS_WIDTH; i += 10) $p.line(i, 0, i, CANVAS_HEIGTH);
			for(var i = 10; i < CANVAS_HEIGTH; i += 10) $p.line(0, i, CANVAS_HEIGTH, i);
		};

		$p.draw = function(){
			drawBackground();

			switch(layer % 3){
				case LAYER_OMEGA_ANCHORS:
					var opts = {anchorWink: true};
					break;
				case LAYER_OMEGA_POINTS:
					var opts = {centerWink: true};
					break;
				case LAYER_OMEGA_POINTS_POINTS:
					var opts = {pointsWink: true};
					break;
			}
			omega.update($p.mouseX, $p.mouseY).render(opts);
			for(var i = 0; i < omega.points.length; i++) omega.points[i].update($p.mouseX, $p.mouseY).render(opts);

			clay.update($p.mouseX, $p.mouseY).render(opts);
		};

		$p.mousePressed = function(){
			switch(layer % 3){
				case LAYER_OMEGA_ANCHORS:
					omega.grabAnchors($p.mouseX, $p.mouseY);
					break;
				case LAYER_OMEGA_POINTS:
					for(var i = 0; i < omega.points.length; i++) omega.points[i].grab($p.mouseX, $p.mouseY);
					break;
				case LAYER_OMEGA_POINTS_POINTS:
					for(var i = 0; i < omega.points.length; i++) omega.points[i].grabPoints($p.mouseX, $p.mouseY);
					break;
			}
			clay.grab($p.mouseX, $p.mouseY);
			clay.grabPoints($p.mouseX, $p.mouseY);
		};

		$p.mouseReleased = function(){
			omega.release();
			clay.release();
		};

		$p.setup();
	};

	return app;
});