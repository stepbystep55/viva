define(['jquery', 'pjs', 'utl', 'utlx3', 'pjsx3'], function($, $p, utl, utlx, $px){
	'use strict';

	var loopable = false;
	$('#btn').click(function(){
		loopable = !loopable;
		(loopable) ? $p.loop() : $p.noLoop();
	});

	var app = function(){

		var omega, spark;

		$p.setup = function(){
			$p.size(500, 500);
			$p.frameRate(10);

			var end1 = utlx.fac.newGrabbable(100, 100);
			var end2 = utlx.fac.newGrabbable(200, 200);
			var fulcrums = [];
			fulcrums.push(utlx.fac.newGrabbable(150, 190));
			fulcrums.push(utlx.fac.newGrabbable(110, 130));
			omega = $px.fac.newOmega(end1, end2, {debug: true}).addPoints(fulcrums);

			var center = utlx.fac.newGrabbable(380, 350);
			fulcrums = [];
			fulcrums.push(utlx.fac.newGrabbable(400, 450));
			fulcrums.push(utlx.fac.newGrabbable(420, 420));
			spark = $px.fac.newSpark(center, {debug: true}).addPoints(fulcrums);
		};

		$p.draw = function(){
			$p.background(200);
			omega.update().render();
			spark.update().render();

		};

		$p.mousePressed = function(){
			omega.grab();
			spark.grab();
		};

		$p.mouseReleased = function(){
			omega.release();
			spark.release();
		};

		$p.setup();
	};

	return app;
});