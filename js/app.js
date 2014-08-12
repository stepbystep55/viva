define(['jquery', 'pjs', 'utl', 'utlx2', 'pjsx2'], function($, $p, utl, utlx, $px){
	'use strict';

	var layer = 0;
	$('#switcher').on('click', function(e){ ++layer; });

	var loopable = false;
	$('#btn').click(function(){
		loopable = !loopable;
		(loopable) ? $p.loop() : $p.noLoop();
	});

	var app = function(){

		var omega, spark1, spark2, spark3;

		$p.setup = function(){
			$p.size(500, 500);
			$p.frameRate(10);

			spark1 = $px.fac.newSpark(100, 200, {debug: true});
			spark1.addPoint(70, 170);
			spark1.addPoint(130, 230);
			spark2 = $px.fac.newSpark(200, 300, {debug: true});
			spark2.addPoint(170, 270);
			spark2.addPoint(230, 330);
			spark3 = $px.fac.newSpark(300, 400, {debug: true});
			spark3.addPoint(270, 370);
			spark3.addPoint(430, 430);

			var end1 = utlx.fac.newGrabbable(100, 100);
			var end2 = utlx.fac.newGrabbable(400, 400);

			omega = $px.fac.newOmega(end1, end2, {debug: true}).addPoints([spark1, spark2, spark3]);
		};

		$p.draw = function(){
			$p.background(64);
			omega.update($p.mouseX, $p.mouseY).render();
			spark1.update($p.mouseX, $p.mouseY).render();
			spark2.update($p.mouseX, $p.mouseY).render();
			spark3.update($p.mouseX, $p.mouseY).render();
		};

		$p.mousePressed = function(){
			switch(layer % 4){
				case 0:
					omega.grabAnchors($p.mouseX, $p.mouseY);
					break;
				case 1:
					omega.grabPoints($p.mouseX, $p.mouseY);
					break;
				case 2:
					spark1.grab($p.mouseX, $p.mouseY);
					spark2.grab($p.mouseX, $p.mouseY);
					spark3.grab($p.mouseX, $p.mouseY);
					break;
				case 3:
					spark1.grabPoints($p.mouseX, $p.mouseY);
					spark2.grabPoints($p.mouseX, $p.mouseY);
					spark3.grabPoints($p.mouseX, $p.mouseY);
					break;
			}
		};

		$p.mouseReleased = function(){
			omega.release();
			spark1.release();
			spark2.release();
			spark3.release();
		};

		$p.setup();
	};

	return app;
});