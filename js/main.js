require.config({
	urlArgs: 'v001'
	, baseUrl: "js"
	, enforceDefine: true
	, paths: {
		'jquery': [
			'lib/jquery.min.2.0.3'
		]
		,'underscore': [
			'lib/underscore.min.1.5.1'
		]
		,'processing': [
			'lib/processing-api.min.1.4.8'
		]
	}
	, shim: {
		'underscore': {
			exports: '_'
		}
		,'processing': {
			exports: 'Processing'
		}
	}
});
define(['app'], function(app){
	'use strict';

	try{
		app();
	}catch(e){
		console.log(e.message);
		console.log(e.stack);
	}
});
