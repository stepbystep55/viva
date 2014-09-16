define(['jquery', 'hammer', 'pjs', 'utl', 'utlx', 'pjsx'], function($, Hammer, $p, utl, utlx, $px){
	'use strict';

	var CANVAS_WIDTH = 500;
	var CANVAS_HEIGTH = 500;

	var BACKGROUND_COLOR = 64;

	var loopable = false;
	$('#loopSwitch').on('click', function(e){
		loopable = !loopable;
		(loopable) ? $p.loop() : $p.noLoop();
	});

	var FACTOR = 12 / 10;
	$('#zoomin').on('click', function(e){
		$p.externals.context.scale(FACTOR, FACTOR);
	});
	$('#zoomout').on('click', function(e){
		$p.externals.context.scale(1 / FACTOR, 1 / FACTOR);
	});
	var STEP = 10;
	$('#goup').on('click', function(e){
		$p.externals.context.translate(0, -STEP);
	});

	var omegas = [];
	var clay = null;

	var app = function(){

		$p.setup = function(){
			$p.size(CANVAS_WIDTH, CANVAS_HEIGTH);
			$p.frameRate(10);

			var end1 = utlx.fac.newGrabbable(100, 100);
			var end2 = utlx.fac.newGrabbable(400, 400);
			var omega = $px.fac.newOmega(end1, end2, {debug: true});
			for(var i = 1; i <= 3; i++){
				var x = 100 * i, y = 100 * i + 100;
				if(i == 2) y += i * i * 10;
				omega.addPoint(x, y);
			}
			omegas.push(omega);

			clay = $px.fac.newClay(300, 100, {debug: true});
			clay.addPoint(350, 50);
			clay.addPoint(350, 150);
		};

		var drawBackground = function(){
			$p.background(BACKGROUND_COLOR);

			$p.stroke(BACKGROUND_COLOR - 8);
			for(var i = 10; i < CANVAS_WIDTH; i += 10) $p.line(i, 0, i, CANVAS_HEIGTH);
			for(var i = 10; i < CANVAS_HEIGTH; i += 10) $p.line(0, i, CANVAS_HEIGTH, i);
		};

		$p.draw = function(){
			drawBackground();

			for(var h = 0; h < omegas.length; h++){
				var omega = omegas[h];
				omega.update($p.mouseX, $p.mouseY).render();
				omega.renderAnchors();
				omega.renderPoints();
				omega.renderPointsPoints();
			}
			clay.update($p.mouseX, $p.mouseY);
			clay.render();
			clay.renderCenter();
			clay.renderPoints();
		};

		$p.mousePressed = function(){
			for(var h = 0; h < omegas.length; h++){
				var omega = omegas[h];
				if(omega.grabAnchors($p.mouseX, $p.mouseY)) return;
				for(var i = 0; i < omega.points.length; i++) if(omega.points[i].grab($p.mouseX, $p.mouseY)) return;
				for(var i = 0; i < omega.points.length; i++) if(omega.points[i].grabPoints($p.mouseX, $p.mouseY)) return;
			}
			if(clay.grab($p.mouseX, $p.mouseY)) return;
			if(clay.grabPoints($p.mouseX, $p.mouseY)) return;
		};

		$p.mouseReleased = function(){
			for(var h = 0; h < omegas.length; h++) omegas[h].release();
			clay.release();
		};

		$p.setup();
	};

	var hammertime = new Hammer($('#canvas').get(0));
	hammertime.on('doubletap', function(e){
		clay.spawnPoint($p.mouseX, $p.mouseY);
		for(var i = 0; i < omegas.length; i++) omegas[i].spawnPoint($p.mouseX, $p.mouseY);
	});

	return app;
});