
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var thisInstanceObjectConstant_2 = _iO;
														
		var pathConstant_32 = [{"x":1544,"y":361},{"x":1331,"y":493},{"x":1176,"y":916},{"x":756,"y":545},{"x":1927,"y":440},{"x":3181,"y":439},{"x":3165,"y":1468},{"x":3489,"y":2021},{"x":3367,"y":2485},{"x":2883,"y":2482},{"x":2554,"y":2383},{"x":2528,"y":2082},{"x":2529,"y":1843},{"x":2278,"y":1768},{"x":2371,"y":1170},{"x":2406,"y":748},{"x":1636,"y":407}];
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_1,
	movePath: pathConstant_32,
	
														});
	
			});
		
		
		//
		// Post all objects initialisation
		//
		
		this.postInit = function()
		{
			
		}
		
		//
		// Initialize
		//
		
		
		// bind to instance
		npcObject.events._add( "afterInit", function( args )
		{
			npcObject.bindToInstance( _iO, function() { } );
		});
		
	}
	