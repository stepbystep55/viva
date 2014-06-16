define(['jquery', 'pjs', 'utl', 'utlx'], function($, pjs, utl, utlx){
	'use strict';

	var loopable = false;
	$('#btn').click(function(){
		loopable = !loopable;
		(loopable) ? pjs.loop() : pjs.noLoop();
	});

	var app = function(){

		var end1, end2, fulcrum, ballBar;

		pjs.setup = function(){
			pjs.size(500, 500);
			pjs.frameRate(10);
			end1 = utlx.fac.newGrabableVector(100, 100);
			end2 = utlx.fac.newGrabableVector(200, 200);
			fulcrum = utlx.fac.newGrabableVector(150, 150);
			ballBar = utlx.fac.newBallBar(end1, end2, fulcrum);
		};

		pjs.draw = function(){
			end1.moveTo(pjs.mouseX, pjs.mouseY);
			end2.moveTo(pjs.mouseX, pjs.mouseY);
			fulcrum.moveTo(pjs.mouseX, pjs.mouseY);

			pjs.background(200);
			pjs.stroke(0, 0, 0);
			pjs.line(end1.x, end1.y, end2.x, end2.y);

			pjs.ellipse(fulcrum.x, fulcrum.y, 10, 10);
			pjs.ellipse(ballBar.projected.x, ballBar.projected.y, 5, 5);
		};

		pjs.mousePressed = function(){
			end1.grab(pjs.mouseX, pjs.mouseY);
			end2.grab(pjs.mouseX, pjs.mouseY);
			fulcrum.grab(pjs.mouseX, pjs.mouseY);
		};

		pjs.mouseReleased = function(){
			end1.release();
			end2.release();
			fulcrum.release();
		};

		pjs.setup();
	};

	return app;
});