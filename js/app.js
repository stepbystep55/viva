define(['jquery', 'pjs', 'utl', 'utlx3', 'pjsx3'], function($, $p, utl, utlx, $px){
	'use strict';

	var loopable = false;
	$('#btn').click(function(){
		loopable = !loopable;
		(loopable) ? $p.loop() : $p.noLoop();
	});

	var app = function(){

		var omega, pair1, pair2;

		$p.setup = function(){
			$p.size(500, 500);
			$p.frameRate(10);

			pair1 = $px.fac.newPair(130, 200, 100, 200, {debug: true});
			pair2 = $px.fac.newPair(230, 200, 300, 250, {debug: true});

			var end1 = utlx.fac.newGrabbable(100, 100);
			var end2 = utlx.fac.newGrabbable(300, 200);

			var fulcrums = [];
			fulcrums.push(utlx.fac.newGrabbable(150, 190));
			fulcrums.push(utlx.fac.newGrabbable(110, 130));
			omega = $px.fac.newOmega(end1, end2, {debug: true}).addPoints([pair1, pair2]);
		};

		$p.draw = function(){
			$p.background(200);
			omega.update($p.mouseX, $p.mouseY).render();
			pair1.update($p.mouseX, $p.mouseY).render();
			pair2.update($p.mouseX, $p.mouseY).render();
		};

		$p.mousePressed = function(){
			omega.grab($p.mouseX, $p.mouseY);
			pair1.grab($p.mouseX, $p.mouseY);
			pair2.grab($p.mouseX, $p.mouseY);
		};

		$p.mouseReleased = function(){
			omega.release();
			pair1.release();
			pair2.release();
		};

		$p.setup();
	};

	return app;
});