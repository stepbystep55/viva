define(['jquery', 'pjs', 'utl', 'utlx'], function($, pjs, utl, utlx){
	'use strict';

	var loopable = false;
	$('#btn').click(function(){
		loopable = !loopable;
		(loopable) ? pjs.loop() : pjs.noLoop();
	});

	var app = function(){

		var end1, end2, fulcrums, ballBar;

		pjs.setup = function(){
			pjs.size(500, 500);
			pjs.frameRate(10);
			end1 = utlx.fac.newGrabableVector(100, 100);
			end2 = utlx.fac.newGrabableVector(200, 200);
			fulcrums = [];
			fulcrums.push(utlx.fac.newGrabableVector(100, 150));
			fulcrums.push(utlx.fac.newGrabableVector(90, 120));
			ballBar = utlx.fac.newOmega(end1, end2);
			ballBar.addPoints(fulcrums);
		};

		pjs.draw = function(){
			end1.moveTo(pjs.mouseX, pjs.mouseY);
			end2.moveTo(pjs.mouseX, pjs.mouseY);
			for(var i = 0; i < fulcrums.length; i++){
				fulcrums[i].moveTo(pjs.mouseX, pjs.mouseY);
			}

			pjs.background(200);
			pjs.stroke(0, 0, 0);
			pjs.line(end1.x, end1.y, end2.x, end2.y);

			for(var i = 0; i < fulcrums.length; i++){
				pjs.ellipse(fulcrums[i].x, fulcrums[i].y, 10, 10);
				pjs.ellipse(ballBar.pArr[i].prjd.x, ballBar.pArr[i].prjd.y, 5, 5);
			}
		};

		pjs.mousePressed = function(){
			end1.grab(pjs.mouseX, pjs.mouseY);
			end2.grab(pjs.mouseX, pjs.mouseY);
			for(var i = 0; i < fulcrums.length; i++){
				fulcrums[i].grab(pjs.mouseX, pjs.mouseY);
			}
		};

		pjs.mouseReleased = function(){
			end1.release();
			end2.release();
			for(var i = 0; i < fulcrums.length; i++){
				fulcrums[i].release();
			}
		};

		pjs.setup();
	};

	return app;
});