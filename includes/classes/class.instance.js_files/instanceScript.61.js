
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
	
	exports.script = function( instanceObject )
	{
		//
		// Variables
		//
	
		
		var thisInstanceObjectConstant_1 = instanceObject;
														
		var polygonIdConstant_10 = "n2";
														
		var objectIdConstant_11 = 424;
														
		var positiveNumberConstant_12 = 5;
														
		
		//
		// Events override
		//
		
		
			instanceObject.events._add( "afterInit", function( args )
			{
				
								var instanceObject_2 = args.instanceObject;
	thisInstanceObjectConstant_1.addRandomNPCInPolygon({
			polygon: polygonIdConstant_10,
	object_pool_id: objectIdConstant_11,
	pointsNumber: positiveNumberConstant_12,
	
		});
	
			});
		
	}	
	