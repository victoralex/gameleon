	
	"use strict";
	var log = require( "./class.log" ),
			generatorPoint = require( "./class.generatePoints" );
	
	exports.percentile = function( args )
	{
		if( Math.random() * 100 < args.percent )
		{
			args.onSuccess();
			
			return true;
		}
		
		args.onFailure();
		
		return false;
	}
	
	
	exports.generatePointsInPolygon = function( args )
	{
		var points = new generatorPoint( {	pointsNumber: args.pointsNumber,
											polygon: args.polygon
											});
	}