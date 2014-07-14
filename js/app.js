define(['jquery', 'pjs', 'utl', 'utlx', 'pjsx'], function($, pjs, utl, utlx, pjsx){
	'use strict';

	var loopable = false;
	$('#btn').click(function(){
		loopable = !loopable;
		(loopable) ? pjs.loop() : pjs.noLoop();
	});

	var app = function(){

		var end1, end2, fulcrums, omega;

		pjs.setup = function(){
			pjs.size(500, 500);
			pjs.frameRate(10);
			end1 = utlx.fac.newGrabableVector(100, 100);
			end2 = utlx.fac.newGrabableVector(200, 200);
			fulcrums = [];
			fulcrums.push(utlx.fac.newGrabableVector(100, 150));
			fulcrums.push(utlx.fac.newGrabableVector(90, 120));
			omega = pjsx.fac.newOmega(end1, end2).addPoints(fulcrums);
		};

		pjs.draw = function(){
			pjs.background(200);
			omega.update().render();
		};

		pjs.mousePressed = function(){
			omega.grab();
		};

		pjs.mouseReleased = function(){
			omega.release();
		};

		pjs.setup();
	};

	return app;
});