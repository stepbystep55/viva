define(['jquery', 'pjs', 'utl', 'utlx', 'pjsx'], function($, $p, utl, utlx, $px){
	'use strict';

	var loopable = false;
	$('#btn').click(function(){
		loopable = !loopable;
		(loopable) ? $p.loop() : $p.noLoop();
	});

	var app = function(){

		var omega, star;

		$p.setup = function(){
			$p.size(500, 500);
			$p.frameRate(10);

			var end1 = utlx.fac.newGrabbableVector(100, 100);
			var end2 = utlx.fac.newGrabbableVector(200, 200);
			var fulcrums = [];
			fulcrums.push(utlx.fac.newGrabbableVector(100, 150));
			fulcrums.push(utlx.fac.newGrabbableVector(90, 120));
			omega = $px.fac.newOmega(end1, end2, {debug: true}).addPoints(fulcrums);

			var center = utlx.fac.newGrabbableVector(50, 50);
			var satellite = utlx.fac.newGrabbableVector(60, 80);
			star = $px.fac.newStar(center, satellite, {debug: true});
		};

		$p.draw = function(){
			$p.background(200);
			omega.update().render();
			star.update().render();
		};

		$p.mousePressed = function(){
			omega.grab();
			star.grab();
		};

		$p.mouseReleased = function(){
			omega.release();
			star.release();
		};

		$p.setup();
	};

	return app;
});